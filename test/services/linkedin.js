var expect  = require('chai').expect;
var Request = require('request');
var OAuth   = require('../../oauth-1.0a');
var crypto = require('crypto');

/*
    Can not use Header
*/
describe("Linkedin Personal Consumer", function() {
    var oauth;

    beforeEach(function () {
        if (
            !process.env.LINKEDIN_CONSUMER_PUBLIC ||
            !process.env.LINKEDIN_CONSUMER_SECRET
        ) {
            this.skip('LinkedIn secret not set.');
            return;
        }

        this.timeout(10000);

        oauth = new OAuth({
            consumer: {
                key: process.env.LINKEDIN_CONSUMER_PUBLIC,
                secret: process.env.LINKEDIN_CONSUMER_SECRET
            },
            signature_method: 'HMAC-SHA1',
            hash_function: function(base_string, key) {
                return crypto.createHmac('sha1', key).update(base_string).digest('base64');
            }
        });
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