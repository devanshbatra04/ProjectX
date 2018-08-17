var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    product_id: Number,
    description : String,
    listedPrice: Number,
    costPrice: Number,
    unit: String,
    Category : String,
    url: String,
    rating: Number,
    featured: Boolean
});



var User = mongoose.model("Article", userSchema);


module.exports = User;