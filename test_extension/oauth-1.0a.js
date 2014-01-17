if(typeof(module) !== 'undefined' && typeof(exports) !== 'undefined') {
    module.exports = OAuth;
    var CryptoJS = require("crypto-js");
}

/*
    Constructor

    @param {Object} consumer key and secret
    {
        key,
        secret
    }
*/
function OAuth(opts) {
    this.consumer         = opts.consumer;
    this.signature_method = opts.signature_method || 'HMAC-SHA1';

    switch(this.signature_method) {
        case 'HMAC-SHA1':
            this.hash = function(base_string, key) {
                return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
            };
            break;
        case 'PLAINTEXT':
            this.hash = function(base_string, key) {
                return key;
            };
            break;
        case 'RSA-SHA1':
            console.warn('oauth-1.0a does not support this signature method right now. Coming Soon...');
            break;
        default:
            console.warn('The OAuth 1.0a protocol defines three signature methods: HMAC-SHA1, RSA-SHA1, and PLAINTEXT only');
            break;
    }
}

/*
    OAuth request authorize
    @param {Object} request data
    {
        method,
        url,
        data
    }
    @param {Object} public and secret token

    @return {Object} OAuth Authorized data
*/
OAuth.prototype.authorize = function(request, token) {
    var oauth_data = {
        oauth_consumer_key: this.consumer.public,
        oauth_nonce: this.getNonce(),
        oauth_signature_method: this.signature_method,
        oauth_timestamp: this.getTimeStamp(),
        oauth_version: '1.0'
    };

    if(token.public)
        oauth_data.oauth_token = token.public;

    oauth_data.oauth_signature = this.getSignature(request, token.secret, oauth_data);

    return oauth_data;
};

/*
    Create a OAuth Signature
    @param {Object} request data
    {
        method,
        url,
        data
    }
    @param {Object} public and secret token
    @param {Object} OAuth data

    @return {String} Signature
*/
OAuth.prototype.getSignature = function(request, token_secret, oauth_data) {
    return this.hash(this.getBaseString(request, oauth_data), this.getSigningKey(token_secret));
};

/*
    Base String = Method + Base Url + ParameterString
    @param {Object} Request data
    @param {Object} OAuth data

    @return {String} Base String
*/
OAuth.prototype.getBaseString = function(request, oauth_data) {
    return request.method.toUpperCase() + '&' + this.percentEncode(this.getBaseUrl(request.url)) + '&' + this.percentEncode(this.getParameterString(request, oauth_data));
};

/*
    Get data from url -> merge with oauth data -> percent encode key & value -> sort
    @param {Object} Request data
    @param {Object} OAuth data
    
    @return {Object} Parameter string data
*/
OAuth.prototype.getParameterString = function(request, oauth_data) {
    var base_string_data = this.sortObject(this.percentEncodeData(this.mergeObject(oauth_data, this.mergeObject(request.data, this.deParam(request.url)))));

    var data_str = '';

    //base_string_data to string
    for(var key in base_string_data) {
        data_str += key + '=' + base_string_data[key] + '&';
    }

    //remove the last character
    data_str = data_str.substr(0, data_str.length - 1);
    return data_str;
};

/*
    Create a Signing Key
    @param {String} Secret Token

    @return {String} Signing Key
*/
OAuth.prototype.getSigningKey = function(token_secret) {
    token_secret = token_secret || '';
    return this.percentEncode(this.consumer.secret) + '&' + this.percentEncode(token_secret);
};

/*
    Get base url
    @param {String}

    @return {String}
*/
OAuth.prototype.getBaseUrl = function(url) {
    return url.split('?')[0];
};

/*
    Get data from url
    @param {String} Url

    @return {Object} data
*/
OAuth.prototype.deParam = function(url) {
    var tmp = url.split('?');

    if(tmp.length === 1)
        return {};

    var arr = decodeURIComponent(tmp[1]).split('&');
    var data = {};

    for(var i = 0; i < arr.length; i++) {
        var item = arr[i].split('=');
        data[item[0]] = item[1];
    }
    return data;
};

/*
    Percent Encode
    @param {String}

    @return {String} percent encoded string
*/
OAuth.prototype.percentEncode = function(str) {
    return encodeURIComponent(str)
                .replace(/\!/g, "%21")
                .replace(/\*/g, "%2A")
                .replace(/\'/g, "%27")
                .replace(/\(/g, "%28")
                .replace(/\)/g, "%29");
};

/*
    Percent Encode Object
    @param {Object}

    @return {Object} percent encoded data
*/
OAuth.prototype.percentEncodeData = function(data) {
    var result = {};

    for(var key in data) {
        result[this.percentEncode(key)] = this.percentEncode(data[key]);
    }

    return result;
};

/*  
    Get OAuth data as Header
    @param {Object} OAuth data

    @return {String} Header data key - value
*/
OAuth.prototype.toHeader = function(oauth_data) {
    oauth_data = this.sortObject(oauth_data);

    var header_value = 'OAuth ';

    for(var key in oauth_data) {
        if(key.indexOf('oauth_') === -1)
            continue;
        header_value += this.percentEncode(key) + '="' + this.percentEncode(oauth_data[key]) + '", ';
    }

    return {
        Authorization: header_value.substr(0, header_value.length - 2) //cut the last 2 chars
    };
};

/*
    Create a random word characters string with input length
    @param {Int} string length (Default: 32)

    @return {String} a random word characters string
*/
OAuth.prototype.getNonce = function(length) {
    length = length || 32;

    var word_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';

    for(var i = 0; i < length; i++) {
        result += word_characters[parseInt(Math.random()*word_characters.length, 10)];
    }

    return result;
};

/*
    Get Current Unix TimeStamp

    @return {Int} current unix timestamp
*/
OAuth.prototype.getTimeStamp = function() {
    return parseInt(new Date().getTime()/1000, 10);
};

////////////////////// HELPER FUNCTIONS //////////////////////

/*
    Merge object
    @param {Object}
    @param {Object}

    @return {Object}
*/
OAuth.prototype.mergeObject = function(obj1, obj2) {
    var merged_obj = obj1;
    for(var key in obj2) {
        merged_obj[key] = obj2[key];
    }
    return merged_obj;
};

/*
    Sort object by key
    @param {Object}

    @return {Object} sorted version
*/
OAuth.prototype.sortObject = function(data) {
    var keys = Object.keys(data);
    var result = {};

    keys.sort();

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        result[key] = data[key];
    }

    return result;
};