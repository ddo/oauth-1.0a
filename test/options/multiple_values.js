var expect;

//Node.js
if(typeof(module) !== 'undefined' && typeof(exports) !== 'undefined') {
    expect = require('chai').expect;
    var OAuth = require('../../oauth-1.0a');
} else { //Browser
    expect = chai.expect;
}

describe("Signature method", function() {
    describe("HMAC-SHA1 signature method with multiple values", function() {
        var oauth = new OAuth({
          consumer: {
            public: "batch-dbc2cd8c-6ca8-463b-96e2-6d8683eac6fd",
            secret: "4S4Rvm25CJZWv7HBg5HOhhlRTBSZ7npl"
          },
          signature_method: 'HMAC-SHA1'
        });

        //overide for testing only !!!
        oauth.getTimeStamp = function() {
            return 1445951836;
        };

        //overide for testing only !!!
        oauth.getNonce = function(length) {
            return 'tKOQtKan8PHIrIoOlrl17zHkZQ2H5CsP';
        };


        var request_data = {
          url: "http://localhost:3737/rest/profiles/1ea2a42f-e14d-4057-8bcd-3e0b4514a267/properties?alt=json",
          method: "PUT",
          data: {
            currentbrowserversion: [ '1', '5', 'dfadfadfa' ],
            alt: 'json'
          }
        };

        var result = oauth.authorize(request_data);

        it("Signature should match", function() {
            expect(result.oauth_signature).to.equal("ri0lfv4udd2uQmkg5cCPVqLruyk=");
        });

        it("Nonce should match", function() {
            expect(result.oauth_nonce).to.equal("tKOQtKan8PHIrIoOlrl17zHkZQ2H5CsP");
        });

        it("Timestamp should match", function() {
            expect(result.oauth_timestamp).to.equal(1445951836);
        });
    });
});