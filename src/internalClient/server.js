const iClient = require('./iClient');
const packet = require('./packet');

module.exports.server = class {

    /**
     * @var {iClient}
     */
    #internalClient;

    /**
     * A constructor class to manage the server category of the api
     * @param {iClient} internalClient
     */
    constructor(internalClient) {
        this.#internalClient = internalClient;
    }


    /**
     * Returns list of the server ids of the user.
     * @param {string} key
     * @return {Promise<[String:{"permissions": String}]>}
     */
    async getServers() {
        const rpacket = new packet(0, "getServers", {});

        return (await this.#internalClient.send(rpacket)).data;
    }


    /**
     * Returns basic information of a server.
     * @param {string} serverId
     * @return {Promise[Any]}
     */
     async getServer(serverId) {
        if (serverId instanceof String)
            throw new TypeError("serverId must be type-of String");

        const rpacket = new packet(0, "getServer", {"serverId": serverId});

        return (await this.#internalClient.send(rpacket)).data;
    }

    /**
     * Starts a server
     * @param {string} serverId 
     * @returns {Promise<{"success": Boolean}>}
     */
    async startServer(serverId) {
        if (serverId instanceof String)
            throw new TypeError("serverId must be type-of String");

        const rpacket = new packet(0, "executeServer", {"serverId": serverId, "action": "start"})

        return (await this.#internalClient.send(rpacket)).data;
    }

    /**
     * Shutsdown a server
     * @param {string} serverId 
     * @returns {Promise<{"success": Boolean}>}
     */
     async shutdownServer(serverId) {
        if (serverId instanceof String)
            throw new TypeError("serverId must be type-of String");

        const rpacket = new packet(0, "executeServer", {"serverId": serverId, "action": "stop"})

        return (await this.#internalClient.send(rpacket)).data;
    }

    /**
     * Reboot a server
     * @param {string} serverId 
     * @returns {Promise<{"success": Boolean}>}
     */
     async rebootServer(serverId) {
        if (serverId instanceof String)
            throw new TypeError("serverId must be type-of String");

        const rpacket = new packet(0, "executeServer", {"serverId": serverId, "action": "reboot"})

        return (await this.#internalClient.send(rpacket)).data;
    }
}