var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    totals: Number,
    username: String,
    items: [{
        title: String,
        price: Number,
        qty: Number
    }]

});



var User = mongoose.model("cart", userSchema);


module.exports = User;