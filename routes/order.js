const router = require("express").Router();

//import expressAsyncHandler from 'express-async-handler';
const Order = require("../models/Order")
const User = require("../models/User");
const Product = require("../models/Product");
//import { isAuth, isAdmin, mailgun, payOrderEmailTemplate } from '../utils.js';



 router.get(
   '/',
   async (req, res) => {
     const orders = await Order.find().populate('user', 'username');
     res.send(orders);
   });


router.post(
  '/',
  async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  });

router.get(
  '/summary',
  async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  });

router.get(
  '/mine',
  async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  });

router.get(
  '/:id',
async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  });

router.put(
  '/:id/deliver',
  async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  });

router.put(
  '/:id/pay',
  async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email username'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  });

router.delete(
  '/:id',
  async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  });

  module.exports = router;




















// const   Order = require("../models/Order");
// const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
// const router = require("express").Router();

// //CREATE
// router.post("/",verifyToken, async (req, res) => {
// const newOrder = new Order(req.body);

// try {
//    const savedOrder = await newOrder.save();
//    res.status(200).json(savedOrder);
// } catch (err) {
//    res.status(500).json(err); 
// }
// });

// //Update
//   router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
//        try {
//            const updatedOrder = await Order.findByIdAndUpdate(
//                req.params.id, 
//                {
//                $set: req.body
//            },
//                { new: true }
//            );
//           res.status(200).json(updatedOrder);
//        } catch (err) {
//            res.status(500).json(err);
//        }
//    });

//   //DELETE
//    router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
//    try {
//       await Order.findByIdAndDelete(req.params.id)
//       res.status(200).json("ordre detail a été supprimé...")
//    } catch (err) {
//       res.status(500).json(err)
//    }
//    });

//    //GET USER ORDERS 
//    router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res)=>{
//       try {
//       const orders = await Order.find({userId: req.params.userId});
//       res.status(200).json(orders);
//       } catch (err) {
//          res.status(500).json(err)
//       }
//       });
 
//       //GET ALL 
//       router.get("/", verifyTokenAndAdmin, async (req, res)=>{
//          try {
//             const orders = await Order.find();
//             res.status(200).json(orders);
//          } catch (err) {
//             res.status(500).json(err)
//          }
//  });

//  //GET MONTHLY INCOME

//  router.get("/income", verifyTokenAndAdmin, async(req,res)=>{
//   const date = new Date();
//   const lastMonth = new  Date(date.setMonth(date.getMonth()-1));
//   const previousMonth = new  Date(new Date().setMonth(lastMonth.getMonth()-1));
//   try {
//     const income = await Order.aggregate([
//         { $match: { createdAt: { $gte: previousMonth } } },
//         {
//             $project:{
//                 month: { $month: "$createdAt" },
//                 sales: "$amount",
//             }, 
//         }, 
//             {
//                 $group: {
//                     _id: "$month",
//                     total:{$sum: "$sales" },
//                 },
//             },
//     ]);
//     res.status(200).json(income)
//   } catch (err) {
//     res.status(500).json(err)
//   }
//  });
   
// module.exports = router;