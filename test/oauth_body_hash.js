var expect = require('chai').expect;
var OAuth = require('../oauth-1.0a');
var crypto = require('crypto');

describe("OAuth Body Hash", function() {
  var oauth = new OAuth({
    consumer: {
      key: '1434affd-4d69-4a1a-bace-cc5c6fe493bc',
      secret: '932a216f-fb94-43b6-a2d2-e9c6b345cbea'
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  //overide for testing only !!!
  oauth.getTimeStamp = function() {
    return 1484599369;
  };

  //overide for testing only !!!
  oauth.getNonce = function(length) {
    return 't62lMDp9DLwKZJJbZTpmSAhRINGBEOcF';
  };

  var request = {
    url: 'http://canvas.docker/api/lti/accounts/1/tool_proxy',
    method: 'POST',
    data: {
      "@context":[
        "http://purl.imsglobal.org/ctx/lti/v2/ToolProxy"
      ],
      "@type":"ToolProxy",
      "lti_version":"LTI-2p1",
      "tool_proxy_guid":"0cf04d67-8a0d-4d41-af61-6e8c6fc3e68c",
      "tool_consumer_profile":"http://canvas.docker/api/lti/accounts/1/tool_consumer_profile/339b6700-e4cb-47c5-a54f-3ee0064921a9",
      "tool_profile":{
        "lti_version":"LTI-2p1",
        "product_instance":{
          "guid":"fd75124a-140e-470f-944c-114d2d93db40",
          "product_info":{
            "product_name":{
              "default_value":"TestTool",
              "key":"tool.name"
            },
            "product_version":"0.1.0",
            "product_family":{
              "code":"testtool",
              "vendor":{
                "code":"Example.com",
                "vendor_name":{
                  "default_value":"Example",
                  "key":"tool.vendor.name"
                }
              }
            }
          }
        },
        "base_url_choice":[
          {
            "default_base_url":"http://example.docker/",
            "selector":{
              "applies_to":[
                "MessageHandler"
              ]
            }
          }
        ],
        "resource_handler":[
          {
            "resource_type":{
              "code":"testtool"
            },
            "resource_name":{
              "default_value":"TestTool",
              "key":"testtool.resource.name"
            },
            "message":[
              {
                "message_type":"basic-lti-launch-request",
                "path":"lti_launch",
                "enabled_capability":[
                  "Canvas.placements.courseNavigation"
                ]
              }
            ]
          }
        ]
      },
      "enabled_capability":[
        "OAuth.splitSecret"
      ],
      "security_contract":{
        "tp_half_shared_secret":"1c7849d3c9f037a9891575c8508d3aaab6a9e1312b5d0353625f83d68f0d545344f81ff9e1849b6400982a0d3f6bf953c6095265e3b6d700a73f5be94ce5654c"
      }
    },
    includeBodyHash: true
  };

  describe('#getBodyHash', function() {
    it('should handle data encoded as an object', function() {
      expect(oauth.getBodyHash(request, '')).to.equal('F7L9O06JqL/LZpQBlsKC/7R53uM=')
    });

    it('should handle data encoded as a string', function() {
      request.data = JSON.stringify(request.data)
      expect(oauth.getBodyHash(request, '')).to.equal('F7L9O06JqL/LZpQBlsKC/7R53uM=')
    });
  });

  describe('#authorize', function() {
    it('should properly include an oauth_body_hash param', function() {
      expect(oauth.authorize(request)).to.eql({
        oauth_consumer_key: '1434affd-4d69-4a1a-bace-cc5c6fe493bc',
        oauth_nonce: 't62lMDp9DLwKZJJbZTpmSAhRINGBEOcF',
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: 1484599369,
        oauth_version: '1.0',
        oauth_body_hash: 'F7L9O06JqL/LZpQBlsKC/7R53uM=',
        oauth_signature: 'ayrFZ4NkVhALlAPY8WjDJXuzK8Y='
      });
    });
  });

  describe('#toHeader', function() {
    it('should properly include an oauth_body_hash header', function() {
      expect(oauth.toHeader(oauth.authorize(request))).to.have.property('Authorization', 'OAuth oauth_body_hash="F7L9O06JqL%2FLZpQBlsKC%2F7R53uM%3D", oauth_consumer_key="1434affd-4d69-4a1a-bace-cc5c6fe493bc", oauth_nonce="t62lMDp9DLwKZJJbZTpmSAhRINGBEOcF", oauth_signature="ayrFZ4NkVhALlAPY8WjDJXuzK8Y%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1484599369", oauth_version="1.0"');
    });
  });
});
