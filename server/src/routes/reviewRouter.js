const express = require("express");
const reviewRouter = express.Router();
const {getReviews , createReview} = require("../controllers/AddReview");
const userMiddleware = require("../middleware/userMiddleware");

reviewRouter.post("/add",userMiddleware,createReview);
reviewRouter.get("/get/:product_id",getReviews)

module.exports = reviewRouter;