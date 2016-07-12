var request = require("request");
var app = require("../server.js");
var base_url = "http://localhost:8000";

describe("Basic user handling: ", function() {
  it("Get an error when quering a non existing user", function(done) {
    request.get(base_url+"/user/JASMIN_TEST_USER_000", function(error, response, body) {
      expect(error).toBe(2001);
      done();
    });
  });

  it("Create new users", function(done) {
    //TODO: We still need to spec the user structure (create JASMIN_TEST_USER_000 user)
    request.post(base_url+"/user", function(error, response, body) {
      expect(body).toBe({}); //we need to recover the sent user
      done();
    });
  });

  it("Query for existing user", function(done) {
    request.get(base_url+"/user/JASMIN_TEST_USER_000", function(error, response, body) {
      expect(body).toBe({}); //we need to recover the queried user
      done();
    });
  });

  it("Modify an existing user", function(done) {
    //Modify a current user, and query again TODO:decide what to change
    request.put(base_url+"/user", function(error, response, body) {
      expect(body).toBe({}); //we need to recover the changed user
      request.get(base_url+"/user/JASMIN_TEST_USER_000", function(error, response, body) {
        expect(body).toBe({}); //we need to recover the queried user already modified.
        done();
      });
    });
  });

  it("Delete an existing user", function(done) {
    request.delete(base_url+"/user/JASMIN_TEST_USER_000", function(error, response, body) {
      expect(response.statusCode).toBe(200); //we deleted user
      request.get(base_url+"/user/JASMIN_TEST_USER_000", function(error, response, body) {
        expect(error).toBe(2001); //User no longer exists
        done();
      });
    });
  });

});