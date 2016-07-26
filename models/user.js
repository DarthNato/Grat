var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_name:String,
    how_to_grat:{
        new_customer: {type: Number, min: 0},
        recommended_customer: {type: Number, min: 0},
        recommending_customer: {type: Number, min: 0},
        by_visits:{
            for_every: {type: Number, min: 1},
            with_minimun: {type: Number, min: 0},
            gets_a_reward: {type: Number, min: 0},
        },
        by_spending:{
            when_spent: {type: Number, min: 0},
            gets_a_reward: {type: Number, min: 0}
        }
      },
    contact_history:
    [
        {
            vendor_id:{type: Schema.ObjectId, ref: 'User'},
            transaction_log:{type: Schema.ObjectId, ref: 'User'}, //to be changed to reference a transaction log
            to_next_visit_promo: Number,
            to_next_spent_promo: Number,
            recommending_friend:{type: Schema.ObjectId, ref: 'User'},
        }
    ]
}, {
        collection:'user',
        timestamps:{createdAt:'created_at', updatedAt:'updated_at'},
    }
);

module.exports = mongoose.model("User",UserSchema);