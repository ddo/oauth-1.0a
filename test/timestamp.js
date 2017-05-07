var expect;

//Node.js
if(typeof(module) !== 'undefined' && typeof(exports) !== 'undefined') {
    expect = require('chai').expect;
    var OAuth = require('../../oauth-1.0a');
} else { //Browser
    expect = chai.expect;
}

function unixtime() {
	return Math.floor(new Date().getTime()/1000)
}

describe("timestamp adjustment argument", function() {
   var oauth = OAuth({
		consumer: {
			public: 'xvz1evFS4wEEPTGEFPHBog',
			secret: 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'
		},
		signature_method: 'HMAC-SHA1'
	});
	var request = {
		url: 'https://api.twitter.com/1/statuses/update.json?include_entities=true',
		method: 'POST',
		data: {
			status: 'Hello Ladies + Gentlemen, a signed OAuth request!'
		}
	};
	var token = {
		public: '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
		secret: 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'
	};

    describe("no adjustment", function() {
		var now = unixtime()
		var authorization = oauth.authorize(request, token)
		it("produces a timestamp of now", function() {
			expect(authorization.oauth_timestamp).to.equal(now)
		});
	});

    describe("positive adjustment", function() {
		var future = unixtime() + 55
		var authorization = oauth.authorize(request, token, 55)
		it("produces a timestamp in the future", function() {
			expect(authorization.oauth_timestamp).to.equal(future)
		});
	});

    describe("negative adjustment", function() {
		var past = unixtime() - 44
		var authorization = oauth.authorize(request, token, -44)
		it("produces a timestamp in the past", function() {
			expect(authorization.oauth_timestamp).to.equal(past)
		});
	});
});