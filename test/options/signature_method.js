var expect;

//Node.js
if(typeof(module) !== 'undefined' && typeof(exports) !== 'undefined') {
    expect = require('chai').expect;
    var OAuth = require('../../oauth-1.0a');
} else { //Browser
    expect = chai.expect;
}

describe("Signature method", function() {
    describe("PLAINTEXT signature method", function() {
        var oauth = new OAuth({
            consumer: {},
            signature_method: 'PLAINTEXT'
        });

        it("hash should be return key only", function() {
            expect(oauth.hash('base_string', 'key')).to.equal('key');
        });
    });

    describe("RSA-SHA1 signature method", function() {
        it("constructor should throw a error", function() {
            expect(function() {
                OAuth({
                    consumer: {},
                    signature_method: 'RSA-SHA1'
                });
            }).to.throw('oauth-1.0a does not support this signature method right now. Coming Soon...');
        });
    });

    describe("UNKNOWN signature method", function() {
        it("constructor should throw a error", function() {
            expect(function() {
                new OAuth({
                    consumer: {},
                    signature_method: 'UNKNOWN'
                });
            }).to.throw('The OAuth 1.0a protocol defines three signature methods: HMAC-SHA1, RSA-SHA1, and PLAINTEXT only');
        });
    });
});