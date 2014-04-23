oauth-1.0a
==========

[![NPM version](https://badge.fury.io/js/oauth-1.0a.png)](http://badge.fury.io/js/oauth-1.0a)
[![Dependency Status](https://david-dm.org/ddo/oauth-1.0a.png?theme=shields.io)](https://david-dm.org/ddo/oauth-1.0a)
[![Coverage Status](https://coveralls.io/repos/ddo/oauth-1.0a/badge.png?branch=master)](https://coveralls.io/r/ddo/oauth-1.0a?branch=master)
[![Code Climate](https://codeclimate.com/github/ddo/oauth-1.0a.png)](https://codeclimate.com/github/ddo/oauth-1.0a)

![codeship](https://www.codeship.io/projects/4388a200-ac85-0131-b0cb-7e8dce60f53f/status)

OAuth 1.0a Request Authorization for **Node** and **Browser**

Send OAuth request with your favorite HTTP client ([request](https://github.com/mikeal/request), [jQuery.ajax](http://api.jquery.com/jQuery.ajax/)...)

No more headache about OAuth 1.0a's stuff or "oauth_consumer_key, oauth_nonce, oauth_signature...." parameters, just use your familiar HTTP client to send OAuth requests.

Tested on some popular OAuth 1.0a services:

* Twitter
* Flickr
* Bitbucket
* Linkedin

## Quick Start

```js
var oauth = new OAuth({
    consumer: {
        public: '<your consumer key>',
        secret: '<your consumer secret>'
    },
    signature_method: '<signature method>' //HMAC-SHA1 or PLAINTEXT ...
});
```

Get OAuth request data then you can use with your http client easily :)
```js
oauth.authorize(request, token);
```

Or if you want to get as a header key-value data
```js
oauth.toHeader(oauth_data);
```


##Installation

###Node.js
    $ npm install oauth-1.0a
    
###Browser
Download oauth-1.0a.js [here](https://github.com/ddo/oauth-1.0a/blob/0.0.8/oauth-1.0a.js)

    <script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha1.js"></script>
    <script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/enc-base64-min.js"></script>
    <script src="oauth-1.0a.js"></script>

##Examples

###Work with [request](https://github.com/mikeal/request) (Node.js)

Depencies

```js
var request = require('request');
var OAuth   = require('oauth-1.0a');
```

Init
```js
var oauth = new OAuth({
    consumer: {
        public: 'xvz1evFS4wEEPTGEFPHBog',
        secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'
    },
    signature_method: 'HMAC-SHA1'
});
```

Your request data
```js
var request_data = {
	url: 'https://api.twitter.com/1/statuses/update.json?include_entities=true',
    method: 'POST',
    data: {
        status: 'Hello Ladies + Gentlemen, a signed OAuth request!'
    }
};
```

Your token (optional for some requests)
```js
var token = {
    public: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
    secret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
};
```

Call a request

```js
request({
	url: request_data.url,
	method: request_data.method,
	form: oauth.authorize(request_data, token)
}, function(error, response, body) {
	//process your data here
});
```

Or if you want to send OAuth data in request's header

```js
request({
	url: request_data.url,
	method: request_data.method,
	form: request_data.data,
	headers: oauth.toHeader(oauth.authorize(request_data, token))
}, function(error, response, body) {
	//process your data here
});
```

###Work with [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) (Browser)

**Caution:** please make sure you understand what happen when use OAuth protocol at client side [here](#client-side-usage-caution)

Init
```js
var oauth = new OAuth({
    consumer: {
        public: 'xvz1evFS4wEEPTGEFPHBog',
        secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'
    },
    signature_method: 'HMAC-SHA1'
});
```

Your request data
```js
var request_data = {
	url: 'https://api.twitter.com/1/statuses/update.json?include_entities=true',
    method: 'POST',
    data: {
        status: 'Hello Ladies + Gentlemen, a signed OAuth request!'
    }
};
```

Your token (optional for some requests)
```js
var token = {
    public: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
    secret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
};
```

Call a request

```js
$.ajax({
	url: request_data.url,
	type: request_data.method,
	data: oauth.authorize(request_data, token)
}).done(function(data) {
	//process your data here
});
```

Or if you want to send OAuth data in request's header

```js
$.ajax({
	url: request_data.url,
	type: request_data.method,
	data: request_data.data,
	headers: oauth.toHeader(oauth.authorize(request_data, token))
}).done(function(data) {
	//process your data here
});
```
##Notes

* Some OAuth requests without token use ``.authorize(request_data)`` instead of ``.authorize(request_data, {})``

* **If you want an easier way to handle your OAuth request. Please visit [Simple OAuth](https://github.com/ddo/simple-oauth), it's a wrapper of this project, some features:**
	* Request Token method
	* Get Authorize link method
	* Access Token method
	* OAuth 2.0 support
	* Simpler syntax:
 
Node.js:

```js
request(oauth.requestsToken(), function(error, response, body) {
	//process your data here
});
```
```js
request(oauth.accessToken({
	oauth_verifier: '<verifier>'
}), function(error, response, body) {
	//process your data here
});
```

jQuery:

```js
$.ajax(oauth.requestsToken()).done(function(data) {
	//process your data here
});
```
```js
$.ajax(oauth.accessToken({
	oauth_verifier: '<verifier>'
})).done(function(data) {
	//process your data here
});
```

##Client Side Usage Caution

OAuth is based around allowing tools and websites to talk to each other.
However, JavaScript running in web browsers is hampered by security restrictions that prevent code running on one website from accessing data stored or served on another.

Before you start hacking, make sure you understand the limitations posed by cross-domain XMLHttpRequest.

On the bright side, some platforms use JavaScript as their language, but enable the programmer to access other web sites. Examples include:

* **Google/Firefox/Safari extensions**
* **Google Gadgets**
* **Microsoft Sidebar**...

For those platforms, this library should come in handy.

##Todo
* RSA-SHA1 signature method

##[Changelog](https://github.com/ddo/oauth-1.0a/releases)


##Depencies
* Browser: [crypto-js](https://code.google.com/p/crypto-js/)
* Node: [crypto-js](https://github.com/evanvosberg/crypto-js)