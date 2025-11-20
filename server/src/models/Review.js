const mongoose = require("mongoose");
const {Schema} = mongoose;

const reviewModel = new Schema({
    name:{
        type:String,
        required:true
    },
    review:{
         type:String,
         required:true
    },
    rating:{
        type:Number,
        required:true
    },
    product_id:{
        type: Schema.Types.ObjectId,
        required:true
    }
})

const review = mongoose.model("ClientsReviews",reviewModel);
module.exports = review;
