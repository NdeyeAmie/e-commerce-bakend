//const express = require("express");
const router = require("express").Router();
 //import User from "./models/User.js";
 const  UserModels= require("./UserModels");
const  User = require ("./User");
const products = require("../Data");
const Product = require("./Product")
const asyncHandler = require("express-async-handler")

 //const importData = express.Router()

 router.post("/user", asyncHandler (async(req,res)=>{
    await User.remove({})
     const importUser = await User.insertMany(UserModels);
     res.send({ importUser});
 })
 );

 router.post("/products", asyncHandler (async(req,res)=>{
    await Product.remove({});
     const importProducts = await Product.insertMany(products);
     res.send({ importProducts});
 })
 );

 //export default importData;
 module.exports=router; 
