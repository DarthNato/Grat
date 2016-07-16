var request = require("request");
var app = require("../server.js");
var base_url = "http://localhost:8000";

describe("Basic user handling: ", function() {
  it("Get an error when quering a non existing user", function(done) {
    request.get(base_url+"/user/444444443333332222333333", function(error, response, body) {
      expect(error).toBe(2001);
      done();
    });
  });

  it("Create new users", function(done) {
    //Creating message with new user as the body
    var options={
      url: base_url+"/user",
      json: true,
      method: 'POST',
      body:{
        '_id':'444444443333332222333333',
        'user_name':'Test User'
      }
    };
    request(options, function(error, response, body) {
       //we need to recover the sent user
      expect(body._id).toBe('444444443333332222333333');
      expect(body.user_name).toBe('Test User');
      expect(body.contact_history).toBe([]);
      done();
    });

  });

  it("Query for existing user", function(done) {
    request.get(base_url+"/user/444444443333332222333333", function(error, response, body) {
      expect(body._id).toBe('444444443333332222333333');
      expect(body.user_name).toBe('Test User');
      expect(body.contact_history).toBe([]);
      done();
    });
  });

  it("Modify an existing user", function(done) {
    //Modify a current user, and query again TODO:decide what to change
    var options={
      url: base_url+"/user/444444443333332222333333",
      json: true,
      method: 'PUT',
      body:{
        'user_name':'Test User Changed'
      }
    };
    request.put(options, function(error, response, body) {
      //we need to recover the changed user
      expect(body._id).toBe('444444443333332222333333');
      expect(body.user_name).toBe('Test User');
      expect(body.contact_history).toBe([]);

      request.get(base_url+"/user/444444443333332222333333", function(error, response, body) {
        //we need to recover the queried user already modified.
        expect(body._id).toBe('444444443333332222333333');
        expect(body.user_name).toBe('Test User');
        expect(body.contact_history).toBe([]);
        done();
      });
    });
  });

  it("Delete an existing user", function(done) {
    request.delete(base_url+"/user/444444443333332222333333", function(error, response, body) {
      expect(response.statusCode).toBe(200); //we deleted user
      request.get(base_url+"/user/444444443333332222333333", function(error, response, body) {
        expect(error).toBe(2001); //User no longer exists
        done();
      });
    });
  });

});