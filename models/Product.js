const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    comment:{
        type: Number,
        required: true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
});


const ProductSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        img:{
            type: Object,
            required: true
        },
        desc:{
            type: String,
            required: true
        },
        reviews:[reviewSchema],
       rating:{
            type: Number,
            required: true,
            default:0,
        },
        numReviews:{
            type: Number,
            required: true,
            default:0,
        },
    price:{
        type: Number,
        required: true,
        default:0
    },
   countInStock:{
        type: Number,
        required: true,
        default:0,
    },
    },
    { timestamps: true}
);

module.exports = mongoose.model("Product", ProductSchema)