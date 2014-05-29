var expect  = require('chai').expect;
var Request = require('request');
var OAuth   = require('../../oauth-1.0a');

describe("Twitter Personal Consumer", function() {
    var oauth = new OAuth({
        consumer: {
            public: process.env.TWITTER_CONSUMER_PUBLIC,
            secret: process.env.TWITTER_CONSUMER_SECRET
        },
        signature_method: 'HMAC-SHA1'
    });

    var token = {
        public: process.env.TWITTER_TOKEN_PUBLIC,
        secret: process.env.TWITTER_TOKEN_SECRET
    };

    describe("#Get user timeline", function() {
        this.timeout(10000);

        var request = {
            url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
            method: 'GET'
        };

        it("should be an array of tweets", function(done) {
            Request({
                url: request.url,
                method: request.method,
                qs: oauth.authorize(request, token),
                json: true
            }, function(err, res, body) {
                expect(err).to.be.a('null');
                expect(body).to.be.an.instanceof(Array);
                done();
            });
        });
    });

    describe("#Get user timeline limit 5", function() {
        this.timeout(10000);

        var request = {
            url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
            method: 'GET',
            data: {
                count: 5
            }
        };

        it("should be an array of tweets (length 5)", function(done) {
            Request({
                url: request.url,
                method: request.method,
                qs: oauth.authorize(request, token),
                json: true
            }, function(err, res, body) {
                expect(err).to.be.a('null');
                expect(body).to.be.an.instanceof(Array);
                expect(body).to.have.length(5);
                done();
            });
        });
    });

    describe("#Get user timeline limit 5 by url", function() {
        this.timeout(10000);

        var request = {
            url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=5',
            method: 'GET'
        };

        it("should be an array of tweets", function(done) {
            Request({
                url: request.url,
                method: request.method,
                qs: oauth.authorize(request, token),
                json: true
            }, function(err, res, body) {
                expect(err).to.be.a('null');
                expect(body).to.be.an.instanceof(Array);
                expect(body).to.have.length(5);
                done();
            });
        });
    });

    describe("#Get user timeline by header", function() {
        this.timeout(10000);

        var request = {
            url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
            method: 'GET'
        };

        it("should be an array of tweets", function(done) {
            Request({
                url: request.url,
                method: request.method,
                qs: request.data,
                headers: oauth.toHeader(oauth.authorize(request, token)),
                json: true
            }, function(err, res, body) {
                expect(err).to.be.a('null');
                expect(body).to.be.an.instanceof(Array);
                done();
            });
        });
    });

    describe.skip("#Tweet", function() {
        this.timeout(10000);

        var text = 'Testing oauth-1.0a';

        var request = {
            url: 'https://api.twitter.com/1.1/statuses/update.json',
            method: 'POST',
            data: {
                status: text
            }
        };

        it("should be an success object", function(done) {
            Request({
                url: request.url,
                method: request.method,
                form: oauth.authorize(request, token),
                json: true
            }, function(err, res, body) {
                expect(body).to.have.property('entities');
                expect(body).to.have.property('created_at');
                expect(body).to.have.property('id');
                expect(body).to.have.property('text');
                expect(body.text).to.equal(text);
                expect(body.user).to.be.an('object');
                done();
            });
        });
    });

    describe.skip("#Tweet by header", function() {
        this.timeout(10000);

        var text = 'Testing oauth-1.0a';

        var request = {
            url: 'https://api.twitter.com/1.1/statuses/update.json',
            method: 'POST',
            data: {
                status: text
            }
        };

        it("should be an success object", function(done) {
            Request({
                url: request.url,
                method: request.method,
                form: request.data,
                headers: oauth.toHeader(oauth.authorize(request, token)),
                json: true
            }, function(err, res, body) {
                expect(body).to.have.property('entities');
                expect(body).to.have.property('created_at');
                expect(body).to.have.property('id');
                expect(body).to.have.property('text');
                expect(body.text).to.equal(text);
                expect(body.user).to.be.an('object');
                done();
            });
        });
    });
});