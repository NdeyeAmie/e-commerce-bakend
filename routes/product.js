const router = require("express").Router();
const asyncHandler = require("express-async-handler");
//const products = require("../Data");
const cloudinary = require('cloudinary').v2;
const Product = require("../models/Product");

cloudinary.config ({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET 
  });

//GET ALL PRODUCT
router.get ("/", asyncHandler(async(req,res) =>{
 const products = await Product.find({})
 res.json(products);
})
);

 router.post("/post", async (req, res)  =>{
    try {
        const {produit_id, title,img,desc,price,countInStock,rating,numReviews } = req.body;
        //console.log(req.body);
        if (!img){
            res.status (404);
            res.json ({ msg: 'charger une image' });
            return;
        } 

     //    const product = await Product.findOne ({ produit_id });
//     //    if (product){
//     //        res.status (404);
//     //        res.json ({ msg: 'cet produit existe' });
//     //        return
//     //    }

        const newProduit = new Product ({
          produit_id,title: title.toLowerCase(),img, price, desc, countInStock,rating,numReviews
        });

        await newProduit.save ();

        res.status (200);
        res.json ({ msg: 'le produit a été ajouter' });
    } catch (error) {
        res.status (400);
        res.json ({ msg: error.message });
       
    }
 }),

// //CREATE
//  router.post("/post", async (req, res) => {
//     // console.log(req.body);
//  const newProduct = new Product(req.body);
//     console.log(newProduct);
 

//  try {
//     const savedProduct = await newProduct.save();
//     res.status(200).json(savedProduct);
//  } catch (err) {
//     // console.log(err.message);   
//     res.status(500).json(err); 
//  }
//  });

//GET  PRODUCT ID
router.get ("/:id", asyncHandler(async(req,res) =>{
    const product = await Product.findById({_id: req.params.id})
    //console.log(product);
    if (product){
    res.json(product);
    }else{
        res.status(404);
        throw new Error("Product not found")
    }
   })
   );


   // //Update
   router.put("/:id",  async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            {
            $set: req.body
        },
            { new: true }
        );
       res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});


  //DELETE
    router.delete("/:id", async (req, res)=>{
    try {
       await Product.findByIdAndDelete(req.params.id)
       res.status(200).json("produit a été supprimé...")
    } catch (err) {
       res.status(500).json(err)
    }
    });

 module.exports = router;
