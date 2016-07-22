var request = require("request");
var app = require("../server.js");
var base_url = "http://localhost:4000";

describe("How to grat configuration: ", function() {
  it("Set grat configuration", function(done) {
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
    	expect(body.how_to_grat).toBe(undefined);
		var options={
		  url: base_url+"/user/444444443333332222333333/how_to_grat",
		  json: true,
		  method: 'PUT',
		  body:{
		    'new_customer': 3,
	        'recommended_customer': 5,
	        'recommending_customer': 3,
	        'by_visits':{
	            'for_every': 10,
	            'with_minimun': 5,
	            'gets_a_reward': 3
	        },
	        'by_spending':{
	            'when_spent': 80,
	            'gets_a_reward': 5
	        }
		  }
		};
		request(options, function(error, response, body) {
			expect(response.statusCode).toBe(200);
			options={
		        url: base_url+"/user/444444443333332222333333",
		        json: true,
		        method: 'GET'
		      };
			request(options, function(error, response, body) {
				//we need to recover the queried user already modified.
				var how_to_grat=body.how_to_grat;
				if(how_to_grat) {
					expect(how_to_grat.new_customer).toBe(3);
					expect(how_to_grat.recommended_customer).toBe(5);
					expect(how_to_grat.recommending_customer).toBe(3);
					var by_visits=how_to_grat.by_visits;
					if (by_visits){
						expect(by_visits.for_every).toBe(10);
						expect(by_visits.with_minimun).toBe(5);
						expect(by_visits.gets_a_reward).toBe(3);
					} else {
						expect(by_visits).not.toBeUndefined();
						expect(by_visits).not.toBeNull();
					}
					var by_spending=how_to_grat.by_spending;
					if (by_spending){
						expect(by_spending.when_spent).toBe(80);
						expect(by_spending.gets_a_reward).toBe(5);
					} else {
						expect(by_spending).not.toBeUndefined();
						expect(by_spending).not.toBeNull();
					}
				} else {
					expect(how_to_grat).not.toBeUndefined();
					expect(how_to_grat).not.toBeNull();
				}
				done();
			});
		});
    });
  });

  it("Clean up", function(done) {
    request.delete(base_url+"/user/444444443333332222333333", function(error, response, body) {
      expect(response.statusCode).toBe(200); //we deleted user
      request.get(base_url+"/user/444444443333332222333333", function(error, response, body) {
        expect(response.statusCode).toBe(404); //User no longer exists
        done();
      });
    });
  });

});