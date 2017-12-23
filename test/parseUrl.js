var expect = require('chai').expect;
var OAuth = require('../oauth-1.0a');

describe('OAuth.parseUrl', function() {
    var oauth = new OAuth({consumer: {}});

    beforeEach(function () {
        oauth = new OAuth({consumer: {}});
    });

    it('should parse protocol', function () {
        expect(oauth.parseUrl('http://example.com/').protocol).to.equal('http');
        expect(oauth.parseUrl('https://example.com/').protocol).to.equal('https');
    });

    it('should parse auth component', function () {
        expect(oauth.parseUrl('http://example.com/').auth).to.equal('');
        expect(oauth.parseUrl('http://foo:bar@example.com/').auth).to.equal('foo:bar@');
    });

    it('should parse hostname component', function () {
        expect(oauth.parseUrl('http://example.com/').hostname).to.equal('example.com');
        expect(oauth.parseUrl('http://example.com:8080/').hostname).to.equal('example.com');
        expect(oauth.parseUrl('http://foo:bar@example.com/').hostname).to.equal('example.com');
    });

    it('should parse port component', function () {
        expect(oauth.parseUrl('http://example.com/').port).to.equal('');
        expect(oauth.parseUrl('http://example.com:80/').port).to.equal(':80');
        expect(oauth.parseUrl('http://foo:bar@example.com:80/').port).to.equal(':80');
    });

    it('should parse pathname component', function () {
        expect(oauth.parseUrl('http://example.com').pathname).to.equal('');
        expect(oauth.parseUrl('http://example.com/').pathname).to.equal('/');
        expect(oauth.parseUrl('http://example.com/foo/bar').pathname).to.equal('/foo/bar');
    });

    it('should parse search component', function () {
        expect(oauth.parseUrl('http://example.com').search).to.equal('');
        expect(oauth.parseUrl('http://example.com/?foo').search).to.equal('?foo');
        expect(oauth.parseUrl('http://example.com/?foo#bar').search).to.equal('?foo');
        expect(oauth.parseUrl('http://example.com/?foo?bar').search).to.equal('?foo?bar');
    });

    it('should parse hash component', function () {
        expect(oauth.parseUrl('http://example.com').hash).to.equal('');
        expect(oauth.parseUrl('http://example.com/?foo').hash).to.equal('');
        expect(oauth.parseUrl('http://example.com/?foo#bar').hash).to.equal('#bar');
    });
});
