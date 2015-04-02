var expect  = require('chai').expect;
var Request = require('request');
var OAuth   = require('../../oauth-1.0a');

describe("Openbank Personal Consumer", function() {
    this.timeout(10000);

    var oauth = new OAuth({
        consumer: {
            public: process.env.OPENBANK_CONSUMER_PUBLIC,
            secret: process.env.OPENBANK_CONSUMER_SECRET
        },
        signature_method: 'HMAC-SHA256'
    });

    //need to send as header
    describe("#Request Token", function() {
        var request = {
            url:    'https://apisandbox.openbankproject.com/oauth/initiate',
            method: 'POST',
            data: {
                oauth_callback: 'http://www.ddo.me'
            }
        };

        it("should be a valid response", function(done) {
            Request({
                url:        request.url,
                method:     request.method,
                form:       request.data,
                headers:    oauth.toHeader(oauth.authorize(request))
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