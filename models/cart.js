var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    totals: Integer,
    username: String,
    items: [{
        title: String,
        price: Integer,
        qty: Integer
    }]

});



var User = mongoose.model("cart", userSchema);


module.exports = User;