const packetTemplate = require('./packet');
const WebSocket = require('ws');
const {Buffer} = require('node:buffer');
const CryptoJs = require('crypto-js');

let encryption_key;

function decryptPacket(rawData, key) {

    const raw = new Buffer.from(rawData.toString(), "base64").toString("utf-8");

    if (raw.startsWith("{") && raw.endsWith("}"))
        return raw;

    const data = [
        CryptoJs.enc.Base64.parse(raw.split(";")[0]),
        CryptoJs.enc.Base64.parse(raw.split(";")[1]),
    ];

    return CryptoJs.AES.decrypt({ciphertext: data[1]}, key, {iv: data[0]}).toString(CryptoJs.enc.Utf8);

}

let eventCallbacks = {};

module.exports = class {

    #_ws;
    #_data = {
        "encryption": null,
        "isAuthenticated": false
    };

    constructor(onConnect = () => {
    }) {
        this.#_ws = new WebSocket("ws://127.0.0.1:9999");
        this.#_ws.on("open", onConnect);
        this.#_ws.on("message", this.#receive);
    }

    set onClose(callback) {
        this.#_ws.onclose = callback
    }


    /**
     * Set the encryption key used to encrypt packets
     * @param {string} key
     */
    setEncryptionKey(key) {
        key = CryptoJs.SHA256(key);
        this.#_data["encryption"] = key;
        encryption_key = key;
    }

    /**
     * Authenticate the client to start making requests
     * @param {string} key
     * @return {Promise<packetTemplate>}
     */
    authenticate(key) {
        let promise = this.send(new packetTemplate(0, "auth", {"key": CryptoJs.SHA256(key).toString()}));
        const unix_date = new Date().getUTCDate().toString() + (new Date().getUTCMonth() + 1).toString() + new Date().getUTCFullYear().toString();
        this.setEncryptionKey(key + "XenoHosts" + unix_date);
        return promise;
    }

    close() {
        this.#_ws.close(1000);
    }

    /**
     * ## INTERNAL USE ONLY!
     * @param {WebSocket.RawData} rawData
     * @param {boolean} isBinary
     */
    #receive(rawData, isBinary) {

        let rawPacket = decryptPacket(rawData, encryption_key);
        rawPacket = JSON.parse(rawPacket);
        const packet = new packetTemplate(rawPacket["eventId"], rawPacket["packet"]["type"], rawPacket["packet"]["data"]);
        if (packet.eventId === 0)
            throw new Error(packet.getValue("message"));

        if (eventCallbacks[packet.eventId] === undefined)
            throw new Error("Server Error,"+packet.getValue("message"))

        eventCallbacks[packet.eventId]["resolve"](packet);
        delete eventCallbacks[packet.eventId];

    }

    /**
     * @param {packetTemplate} packet
     * @param {[function, function]|Null} repeatedPromise
     */
    send(packet, repeatedPromise = null) {

        if (this.#_ws.closed === true) throw new Error("The websocket connection is closed but packets are still being sent.");

        if (this.#_ws.readyState === 0) // Sketchy Workaround
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.send(packet, [resolve, reject]);
                }, 5);
            })

        const eventId = (Math.floor(Math.random() * 99999999) + 10000000).toString();
        packet.eventId = eventId;

        if (this.#_data.encryption === null) {

            this.#_ws.send(packet.encode(true, true));

        } else {


            let iv = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
            let ivW = CryptoJs.enc.Utf8.parse(iv);
            const b64Packet = packet.encode(true, false);
            const crypt = CryptoJs.AES.encrypt(b64Packet, encryption_key, {
                iv: ivW,
                mode: CryptoJs.mode.CBC
            });

            let toSend = new Buffer.from(crypt.iv.toString(CryptoJs.enc.Utf8) + ";" + crypt.ciphertext.toString(CryptoJs.enc.Base64)).toString("base64");
            this.#_ws.send(toSend);

        }

        if (repeatedPromise !== null)
            return eventCallbacks[eventId] = {
                "resolve": repeatedPromise[0],
                "reject": repeatedPromise[1]
            };

        return new Promise((resolve, reject) => {
            eventCallbacks[eventId] = {
                "resolve": resolve,
                "reject": reject
            };
        });

    }

}
