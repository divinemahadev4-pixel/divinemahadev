const Review = require("../models/Review");

const createReview = async(req ,res)=>{
    try{
        const {name , review , product_id , rating} = req.body;
        if(!name || !review || !product_id || !rating) throw new Error("plz fill the full information");
        await Review.create(req.body);
        res.status(201).json({
            message:name+" ,for your review"
        });

    }catch(e){
        res.status(400).json({
            message:"faild to add review due to: "+e.message
        })
    }
}

const getReviews = async (req,res) =>{
try{
    const {product_id} = req.params;
    const reviews = await review.find({product_id:product_id});
    res.status(200).json({
        message:"here's your all data",
        data:reviews
    })
}catch(e){
     res.status(400).json({
            message:"faild to get reviews due to: "+e.message
        })
}
}


module.exports = {getReviews , createReview};