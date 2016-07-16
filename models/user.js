var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_name:String,
    how_to_grat:{
        new_customer: Number,
        recommended_customer: Number,
        recommending_customer: Number,
        by_visits:{
            for_every: Number,
            with_minimun: Number,
            gets_a_reward: Number
        },
        by_spending:{
            when_spent: Number,
            gets_a_reward: Number
        }
      },
    contact_history:
    [
        {
            vendor_id:{type: Schema.ObjectId, ref: 'User'},
            transaction_log:{type: Schema.ObjectId, ref: 'User'},
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