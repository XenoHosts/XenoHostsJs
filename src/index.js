const iClient = require('./internalClient/iClient');
const {account} = require('./internalClient/account');
const {server} = require('./internalClient/server');

module.exports = class XenoHostsClient {

    #_internalClient;
    /** * @var {account} */
    #_account;
    /** * @var {server} */
    #_server;

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

        this.#_account = new account(this.#_internalClient);
        this.#_server = new server(this.#_internalClient)
    };

    /**
     * Self-explanatory?
     * @return {account}
     */
    get account(){
        return this.#_account;
    }

    /**
     * Self-explanatory?
     * @return {server}
     */
    get server(){
        return this.#_server;
    }

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