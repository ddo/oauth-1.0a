var expect = require('chai').expect;
var OAuth = require('../oauth-1.0a');

describe('#getBaseUrl', function() {
	var oauth = new OAuth({
		consumer: {}
	});

	beforeEach(function () {
		oauth = new OAuth({
			consumer: {}
		});
  });

  it('should return base url', function () {
    expect(oauth.getBaseUrl('http://example.com/path/')).to.equal('http://example.com/path/');
    expect(oauth.getBaseUrl('http://example.com/path/?foo=bar')).to.equal('http://example.com/path/');
  });

  it('should exclude default port number', function () {
    expect(oauth.getBaseUrl('http://example.com/')).to.equal('http://example.com/');
    expect(oauth.getBaseUrl('http://example.com:80/')).to.equal('http://example.com/');
    expect(oauth.getBaseUrl('https://example.com/')).to.equal('https://example.com/');
    expect(oauth.getBaseUrl('https://example.com:443/')).to.equal('https://example.com/');
  });

  it('should include non-default port number', function () {
    expect(oauth.getBaseUrl('http://example.com:8080/')).to.equal('http://example.com:8080/');
    expect(oauth.getBaseUrl('http://example.com:443/')).to.equal('http://example.com:443/');
    expect(oauth.getBaseUrl('https://example.com:8080/')).to.equal('https://example.com:8080/');
    expect(oauth.getBaseUrl('https://example.com:80/')).to.equal('https://example.com:80/');
  });
});
