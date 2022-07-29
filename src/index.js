const iClient = require('./internalClient/iClient.js');
const account = require('./internalClient/account.js');

module.exports = class XenoHostsClient {

    #_internalClient;

    /**
     * Construct the client to make API requests
     * @param {string} key
     */
    constructor(key) {
        if (!key instanceof String)
            throw new TypeError("Key must be type-of String");

        this.#_internalClient = new iClient(async () => {
                const response = await this.#_internalClient.authenticate(key);
                if (response.type === "error")
                    throw new Error(response.getValue("message"))
            }
        );

        this.account = new account(this.#_internalClient);
    };

    set onClose(callback) {
        this.#_internalClient.onclose = callback
    }

    /**
     * Safely close the client
     */
    close() {
        this.#_internalClient.close()
    }

}