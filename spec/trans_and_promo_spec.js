var request = require("request");
var app = require("../server.js");
var _ = require('../config.js');
var base_url = _.appLocalUrl;


describe("Transactions and promotions spec: ", function() {
	it("First Tranaction queries", function(done) {
    //Creating provider
    var options={
      url: base_url+"/user",
      json: true,
      method: 'POST',
      body:{
        '_id':'444444443333332222333333',
        'user_name':'Test Provider'
      }
    };
    request(options, function(error, response, body) {
    	//configuring provider promos
		options={
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
			//Create new customer
			options={
		      url: base_url+"/user",
		      json: true,
		      method: 'POST',
		      body:{
		        '_id':'333333332222221111222222',
		        'user_name':'Test Customer'
		      }
		    };
			request(options, function(error, response, body) {
				//Request for promo if a payment is done.
				options={
			      url: base_url+"/new_transaction",
			      json: true,
			      method: 'GET',
			      body:{
			        'customer':'333333332222221111222222',
			        'provider':'444444443333332222333333',
			        'amount': 2.5
			      }
			    };
			    request(options, function(error, response, body) {
			    	expect(body.customer).toBe('333333332222221111222222');
			    	expect(body.provider).toBe('444444443333332222333333');
			    	expect(body.original_amount).toBe(2.5);
			    	expect(body.reward_amount).toBe(3);
			    	expect(body.paied_amount).toBe(0); //if amount is less than promo, I expect to get 0 as payment.
            		expect(body.to_next_visit_promo).toBe(10);
			    	expect(body.to_next_spent_promo).toBe(80);
			    	expect(body.transaction_count).toBe(0);
				});
			    options.body.amount=4.5;
				request(options, function(error, response, body) {
			    	expect(body.customer).toBe('333333332222221111222222');
			    	expect(body.provider).toBe('444444443333332222333333');
			    	expect(body.original_amount).toBe(4.5);
			    	expect(body.reward_amount).toBe(3);
			    	expect(body.paied_amount).toBe(1.5);
            		expect(body.to_next_visit_promo).toBe(10);
			    	expect(body.to_next_spent_promo).toBe(78.5); //paied amount already counts for spent promo
			    	expect(body.transaction_count).toBe(0);
				});
				options.body.amount=10;
				request(options, function(error, response, body) {
			    	expect(body.customer).toBe('333333332222221111222222');
			    	expect(body.provider).toBe('444444443333332222333333');
			    	expect(body.original_amount).toBe(10);
			    	expect(body.reward_amount).toBe(3);
			    	expect(body.paied_amount).toBe(7);
            		expect(body.to_next_visit_promo).toBe(9);  //paied amount already counts for visit promo if meets the minimum
			    	expect(body.to_next_spent_promo).toBe(73); //paied amount already counts for spent promo
			    	expect(body.transaction_count).toBe(0);
			    	done();
				});
			});
		});
    });
  });

  it("First Tranaction commit", function(done) {
  	//Creating additional users
	var options={
      url: base_url+"/user",
      json: true,
      method: 'POST',
      body:{
        '_id':'222222221111110000111111',
        'user_name':'Test User 2'
      }
    };
    request(options, function(error, response, body) {
    	//here we are just hoping that the user actually got created before the next request finishes.
    });
    options.body._id='111111112222223333222222';
    options.body.user_name='Test User 3';
    request(options, function(error, response, body) {
    	done();
    });
  });

  it("Clean up", function(done) {
  	//delete provider
    request.delete(base_url+"/user/444444443333332222333333", function(error, response, body) {
      expect(response.statusCode).toBe(200); //we deleted user
      request.get(base_url+"/user/444444443333332222333333", function(error, response, body) {
        expect(response.statusCode).toBe(404); //User no longer exists
      });
    });
    //delete user 1
    request.delete(base_url+"/user/111111112222223333222222", function(error, response, body) {
      expect(response.statusCode).toBe(200); //we deleted user
      request.get(base_url+"/user/111111112222223333222222", function(error, response, body) {
        expect(response.statusCode).toBe(404); //User no longer exists
      });
    });
    //delete user 2
    request.delete(base_url+"/user/222222221111110000111111", function(error, response, body) {
      expect(response.statusCode).toBe(200); //we deleted user
      request.get(base_url+"/user/222222221111110000111111", function(error, response, body) {
        expect(response.statusCode).toBe(404); //User no longer exists
      });
    });
    //Delete customer
    request.delete(base_url+"/user/333333332222221111222222", function(error, response, body) {
      expect(response.statusCode).toBe(200); //we deleted user
      request.get(base_url+"/user/333333332222221111222222", function(error, response, body) {
        expect(response.statusCode).toBe(404); //User no longer exists
        done(); // finish the test
      });
    });
  });
});