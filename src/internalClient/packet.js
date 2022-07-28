export default class {

    #__packet_type;
    #__eventId;
    #__data;

    constructor(eventId = 0, packet_type = "", data = {}) {
        this.#__eventId = eventId;
        this.#__packet_type = packet_type;
        this.#__data = data;
    }

    get eventId() {
        return this.#__eventId;
    }

    /**
     * @param {number} eventId
     */
    set eventId(eventId) {
        this.#__eventId = eventId;
    }

    get type() {
        return this.#__packet_type;
    }

    get data() {
        return this.#__data;
    }

    /**
     * @param {string} key
     * @param {*} value
     */
    setValue(key, value) {
        this.#__data[key] = value;
    }

    /**
     * @param {string} key
     * @return {*}
     */
    getValue(key) {
        return this.#__data[key];
    }

    encode(stringify = true, base64 = true) {
        const packetJSON = {
            eventId: this.#__eventId,
            packet: {
                type: this.#__packet_type,
                data: this.#__data
            }
        };

        return stringify ? (base64 ? new Buffer.from(JSON.stringify(packetJSON)).toString("base64") : JSON.stringify(packetJSON)) : packetJSON;
    }

    /**
     *
     * @param {{
     *     eventId: string,
     *     packet: {
     *         type: string,
     *         data: array
     *     }
     * }} packetData
     *
     * @return {boolean|this}
     */
    decode(packetData) {
        try {
            this.#__eventId = packetData.eventId;
            this.#__packet_type = packetData.packet.type;
            this.#__data = packetData.packet.data;
            return this;
        } catch {
            return false;
        }
    }

    toString() {
        return this.encode(true);
    }

}