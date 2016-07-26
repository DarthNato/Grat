var request = require("request");
var app = require("../server.js");
var _ = require('../config.js');
var base_url = _.appLocalUrl;

describe("Hello World Server", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns Hello World", function(done) {
      request.get(base_url+'/', function(error, response, body) {
        expect(body).toBe("Hello World!! =D");
        done();
      });
    });
  });
});