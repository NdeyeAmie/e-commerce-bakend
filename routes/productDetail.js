// const   ProductDetail = require("../models/ProductDetail");
// const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
// const router = require("express").Router();

// //CREATE
// router.post("/",verifyToken, async (req, res) => {
// const newProductDetail = new ProductDetail(req.body);

// try {
//    const savedProductDetail = await newProductDetail.save();
//    res.status(200).json(savedProductDetail);
// } catch (err) {
//    res.status(500).json(err); 
// }
// });

// //Update
//   router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
//        try {
//            const updatedProductDetail = await ProductDetail.findByIdAndUpdate(
//                req.params.id, 
//                {
//                $set: req.body
//            },
//                { new: true }
//            );
//           res.status(200).json(updatedProductDetail);
//        } catch (err) {
//            res.status(500).json(err);
//        }
//    });

//   //DELETE
//    router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
//    try {
//       await ProductDetail.findByIdAndDelete(req.params.id)
//       res.status(200).json("produit detail a été supprimé...")
//    } catch (err) {
//       res.status(500).json(err)
//    }
//    });

//    //GET USER PRODUCTDETAIL 
//    router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res)=>{
//       try {
//       const productDetail = await ProductDetail.findOne({userId: req.params.userId});
//       res.status(200).json(productDetail);
//       } catch (err) {
//          res.status(500).json(err)
//       }
//       });
 
//       //GET ALL 
//       router.get("/", verifyTokenAndAdmin, async (req, res)=>{
//          try {
//             const productDetails = await ProductDetail.find();
//             res.status(200).json(productDetails);
//          } catch (err) {
//             res.status(500).json(err)
//          }
//  });
   
// module.exports = router;