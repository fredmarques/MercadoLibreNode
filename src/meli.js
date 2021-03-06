import needle from 'needle';
import querystring from 'querystring';

/**
 * You can either us those defaults values or
 * specify as an environment variable or
 * (recommended) pass as a config object to constructor
 */

/** *  @default */
const apiRootUrl = process.env.ML_API_ROOT_URL || 'https =//api.mercadolibre.com';
/** *  @default */
const authUrl = process.env.ML_AUTH_URL || 'https =//auth.mercadolibre.com/authorization';
/** *  @default */
const oauthUrl = process.env.ML_OAUTH_URL || 'https =//api.mercadolibre.com/oauth/token';


export default class Meli {

    /**
     * Creates a new object Meli
     *
     * @constructor
     * @param {string|number} clientId
     * @param {string} clientSecret
     * @param {string} [accessToken]
     * @param {string} [refreshToken]
     * @param {object} [config]
     */
    constructor(clientId, clientSecret, accessToken, refreshToken, config = {}) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.apiRootUrl = config.apiRootUrl || apiRootUrl;
        this.authUrl = config.authUrl || authUrl;
        this.oauthUrl = config.oauthUrli || oauthUrl;
    }

    /**
     * Get the auth url.
     *
     * @param {string} redirectUri
     * @returns {string}
     */
    getAuthURL(redirectUri) {
        const self = this;
        const query = {
            response_type: 'code',
            client_id: self.clientId,
            redirect_uri: redirectUri
        };
        return `${self.authUrl}?${querystring.stringify(query)}`;
    }

    /**
     * Exchange the code for a token
     *
     * @param {string} code
     * @param {string} redirectUri
     * @param {function} callback function(error,response)
     */
    authorize(code, redirectUri, callback) {
        const self = this;
        needle.post(self.oauthUrl, {
            grant_type: 'authorization_code',
            client_id: self.clientId,
            client_secret: self.clientSecret,
            code,
            redirect_uri: redirectUri
        }, {
        }, (err, res, body) => {
            if (body) {
                self.accessToken = body.access_token;
                self.refreshToken = body.refresh_token;
            }
            callback(err, body);
        });
    }

    /**
     *
     * Refresh your access token, using the token of the
     * constructor or the token get in the Authorize method
     *
     * @param {function} callback function (error,response)
     */
    refreshAccessToken(callback) {
        const self = this;
        needle.post(self.oauthUrl, {
            grant_type: 'refresh_token',
            client_id: self.clientId,
            client_secret: self.clientSecret,
            refresh_token: self.refreshToken
        }, {
        }, (err, res, body) => {
            if (body) {
                self.refreshToken = body.refresh_token;
                self.accessToken = body.access_token;
            }
            callback(err, body);
        });
    }

    /**
     *
     * get request
     *
     * @param {string} path relative path to get
     * @param {object} [params] automatically add the access_token in the query
     * @param {function} callback function (error,response)
     */
    get(path, params, callback) {
        const cb = callback || params;
        const query = (typeof(params) === 'object') ?
            querystring.stringify(params) :
            querystring.stringify({});

        const nextPath = this.apiRootUrl + (path.charAt(0) === '/' ? '' : '/') + path + query;
        needle.get(nextPath, {
        }, (err, res) => {
            cb(err, res ? res.body : res);
        });
    }

    /**
     *
     * post request
     *
     * @param {string} path relative path to post
     * @param {object} body data to send to post, not require stringify
     * @param {object} [params] automatically add the access_token in the query
     * @param {function} callback function (error,response)
     */
    post(path, body, params, callback) {
        const cb = callback || params;
        const query = (typeof(params) === 'object') ?
            querystring.stringify(params) :
            querystring.stringify({});

        const nextPath = this.apiRootUrl + (path.charAt(0) === '/' ? '' : '/') + path + query;
        needle.post(nextPath, body, {
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }, (err, res) => {
            cb(err, res ? res.body : res);
        });
    }

    /**
     *
     * post request (multipart)
     *
     * @param {string} path relative path to post
     * @param {object} body data to send to post, not require stringify
     * @param {object} [params] params automatically add the access_token in the query
     * @param {function} callback function (error,response)
     */
    upload(path, body, params, callback) {
        const cb = callback || params;
        const query = (typeof(params) === 'object') ?
            querystring.stringify(params) :
            querystring.stringify({});

        const nextPath = this.apiRootUrl + (path.charAt(0) === '/' ? '' : '/') + path + query;
        needle.post(nextPath, body, {
            multipart: true
        }, (err, res) => {
            cb(err, res ? res.body : res);
        });
    }

    /**
     *
     * put request
     *
     * @param {string} path relative path to put
     * @param {object} body data to send to put, not require stringify
     * @param {object} [params] params automatically add the access_token in the query
     * @param {function} callback function (error,response)
     */
    put(path, body, params, callback) {
        const cb = callback || params;
        const query = (typeof(params) === 'object') ?
            querystring.stringify(params) :
            querystring.stringify({});

        const nextPath = this.apiRootUrl + (path.charAt(0) === '/' ? '' : '/') + path + query;
        needle.put(nextPath, body, {
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }, (err, res) => {
            cb(err, res ? res.body : res);
        });
    }

    /**
     *
     * delete request
     *
     * @param {string} path relative path to delete
     * @param {object} [params] params automatically add the access_token in the query
     * @param {function} callback function (error,response)
     */
    delete(path, params, callback) {
        const cb = callback || params;
        const query = (typeof(params) === 'object') ?
            querystring.stringify(params) :
            querystring.stringify({});

        const nextPath = this.apiRootUrl + (path.charAt(0) === '/' ? '' : '/') + path + query;
        needle.delete(nextPath, {
            headers: {
                'Content-Type': 'application/json'
            }
        }, (err, res) => {
            cb(err, res ? res.body : res);
        });
    }
}
