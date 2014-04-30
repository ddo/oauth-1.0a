var expect;

//Node.js
if(typeof(module) !== 'undefined' && typeof(exports) !== 'undefined') {
    expect = require('chai').expect;
    var OAuth = require('../../oauth-1.0a');
} else { //Browser
    expect = chai.expect;
}

//TODO: check alphabet and numberic only

describe("consumer option", function() {
    describe("required option", function() {
        it("should throw error on undefined", function() {
            expect(function() {
                oauth = OAuth();
            }).to.throw('consumer option is required');
        });
    });
});