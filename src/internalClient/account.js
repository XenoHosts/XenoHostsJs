const iClient = require('./internalClient/iClient.js');
const packet = require('./packet.js');

module.exports = class {

    /**
     * @var {iClient}
     */
    #internalClient;

    /**
     * A constructor class to manage the account category of the api
     * @param {iClient} internalClient
     */
    constructor(internalClient) {
        this.#internalClient = internalClient;
    }

    /**
     * Get user information about a user or itself.
     * @param {null|string} username Default value is null, if it's null then it gets the current client data
     * @return {Promise<{
                      id: int,
                      username: string,
                      timeCreated: int,
                      email: string
                        }>}
     */
    async getUser(username = null) {
        if (username === null)
            username = "self";

        if (!username instanceof String)
            throw new TypeError("Username must be type-of String");
        const getUserPacket = new packet(0, "getUser", {"username": username});

        return (await this.#internalClient.send(getUserPacket)).data;
    }

    /**
     * Create a new user, this is only available with users with administrator/web_server permissions and above.
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @return {Promise<void>}
     */
    async createUser(username, email, password) {
        if (!username instanceof String || !email instanceof String || !password instanceof String)
            throw new TypeError("Username, Email or Password must be type-of String");

        const createUserPacket = new packet(0, "createUser",
            {
                "username": username,
                "email": email,
                "password": password
            }
        );

        return (await this.#internalClient.send(createUserPacket)).data;
    }

    /**
     * Verifies a user, this is only available with users with administrator/web_server permissions and above.
     * @param {string} key
     * @return {Promise<void>}
     */
    async verifyUser(key) {
        if (!key instanceof String)
            throw new TypeError("key must be type-of String");

        const createUserPacket = new packet(0, "verifyUser",
            {
                "key": key
            }
        );

        return (await this.#internalClient.send(createUserPacket)).data;
    }

}