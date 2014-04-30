var expect;

//Node.js
if(typeof(module) !== 'undefined' && typeof(exports) !== 'undefined') {
    expect = require('chai').expect;
    var OAuth = require('../../oauth-1.0a');
} else { //Browser
    expect = chai.expect;
}

describe("last_ampersand option", function() {
    
    describe("default (true)", function() {
        var oauth = OAuth({
            consumer: {
                secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'
            }
        });

        var token = {
            secret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
        };

        it("should be equal to Twitter example", function() {
            expect(oauth.getSigningKey(token.secret)).to.equal('kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE');
        });

        it("should has the ampersand at the end", function() {
            expect(oauth.getSigningKey()).to.equal('kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&');
        });
    });

    describe("change to false", function() {
        var oauth = OAuth({
            consumer: {
                secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'
            },
            last_ampersand: false
        });

        var token = {
            secret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
        };

        it("should be equal to Twitter example", function() {
            expect(oauth.getSigningKey(token.secret)).to.equal('kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE');
        });

        it("should not has the ampersand at the end", function() {
            expect(oauth.getSigningKey()).to.equal('kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw');
        });
    });
});