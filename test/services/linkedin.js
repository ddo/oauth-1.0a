var expect  = require('chai').expect;
var Request = require('request');
var OAuth   = require('../../oauth-1.0a');

/*
    Can not use Header
*/
describe("Linkedin Personal Consumer", function() {
    this.timeout(10000);

    var oauth = new OAuth({
        consumer: {
            public: process.env.LINKEDIN_CONSUMER_PUBLIC,
            secret: process.env.LINKEDIN_CONSUMER_SECRET
        },
        signature_method: 'HMAC-SHA1'
    });

    describe("#Request Token", function() {
        var request = {
            url: 'https://api.linkedin.com/uas/oauth/requestToken',
            method: 'POST',
            data: {
                oauth_callback: 'http://www.ddo.me'
            }
        };

        it("should be a valid response", function(done) {
            Request({
                url: request.url,
                method: request.method,
                form: oauth.authorize(request)
            }, function(err, res, body) {
                expect(body).to.be.a('string');

                body = oauth.deParam(body);

                expect(body).to.have.property('oauth_callback_confirmed', 'true');
                expect(body).to.have.property('oauth_token');
                expect(body).to.have.property('oauth_token_secret');

                done();
            });
        });
    });
});