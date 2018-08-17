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
    featured: Boolean,
    title: String
});



var User = mongoose.model("Article", userSchema);


module.exports = User;