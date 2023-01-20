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








// const   Product = require("../models/Product");
// const { route } = require("./user");
// const {  verifyTokenAndAdmin } = require("./verifyToken");
// const asyncHandler = require("express-async-handler");
// const router = require("express").Router();

// //
// // router.get("/products", 
// // asyncHandler(async(req, res) => {
// //     const products = await Product.find({})
// //     res.send( products);
// //  })
// //  ); 

// //
// // router.get("/products/:id", asyncHandler(async(req,res)=>{
// // const products = await Product.findById(req.params.id);
// // if(products) {
// //     res.json(products);
// // }else{
// //     res.status(404).json({message:"Product not found"})
// // }
// // })
// // )

// router.get("/products/:id", (req, res) => {
// const thisProduct = Product.find((prod) => prod.id === req.params.id);
//    res.json(thisProduct);
//  });


// //CREATE
// router.post("/", async (req, res) => {
// const newProduct = new Product(req.body);

// try {
//    const savedProduct = await newProduct.save();
//    res.status(200).json(savedProduct);
// } catch (err) {
//    res.status(500).json(err); 
// }
// });



//    //DELETE
//    router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
//    try {
//       await Product.findByIdAndDelete(req.params.id)
//       res.status(200).json("produit a été supprimé...")
//    } catch (err) {
//       res.status(500).json(err)
//    }
//    });

// //GET PRODUCT
//    router.get("/find/:id",  async (req, res)=>{
//       try {
//       const product = await Product.findById(req.params.id);
//       res.status(200).json(product);
//       } catch (err) {
//          res.status(500).json(err)
//       }
//       });
 
//       //GET ALL PRODUCTS
//       router.get("/", async (req, res)=>{
//           const qNew = req.query.new;
//           const qCategory = req.query.category;
//           try {
//              let products;
         
//              if(qNew){
//                  products = await Product.find().sort({createAt: -1}).limit(1)
//              } else if(qCategory){
//                  products = await Product.find({
//                      categories: {
//                          $in: [qCategory],
//                      },
//                  });
//              } else {
//                  products = await Product.find();
//              }

//           res.status(200).json(products);
//           } catch (err) {
//              res.status(500).json(err)
//           }
//           });

// module.exports = router;