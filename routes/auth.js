const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("./verifyToken");
const protect = require("../Middleware/AuthMiddleware");



//LOgin
  router.post("/login", asyncHandler(async(req,res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    //console.log({body: req.body,user})
    if(user && (await bcrypt.compare(password,user.password))) {
        res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isUser: user.isUser,
        token: generateToken(user._id),
        createdAt: user.createdAt,
    });
    }else{
       res.status(401)
       throw new Error("Invalid Email or Password")
    }
  })
  );

  //REGISTER
router.post ("/register", asyncHandler(async(req,res) =>{
const {username, email, password} = req.body;
const userExists = await User.findOne({email});

if(userExists) {
    res.status(400);
    throw new Error("User already exists")
}
const user = await User.create({
    username,
    email,
    password,
});

if (user) {
res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    isUser: user.isUser,
    token: generateToken(user._id), 
});
}
else{
    res.status(400)
    throw new Error("Invalid User Data")
}
})
);


router.get("/",protect,
asyncHandler
 (async (req, res)=>{
             const query = req.query.new
             try {
             const users = query   
             ? await User.find().sort({_id: -1}).limit(5)
              : await User.find();
             res.status(200).json(users);
             } catch (err) {
                res.status(500).json(err)
             }
             })
             );
  
// PROFILE
  router.get("/profile",
  protect,
  asyncHandler(async(req,res) =>{
    const user = await User.findById(req.user._id)
    
    if(user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            createdAt: user.createdAt,  
        })
    } else{
        res.status(404)
        throw new Error("User not found") 
    }
  })
  );

  //UPDATE PROFILE
  router.put("/profile",
  protect,
  asyncHandler(async(req,res) =>{
    const user = await User.findById(req.user._id);
    
    if(user) {  
            user.username= req.body.username || user.username;
             user.email= req.body.email || user.email;
        if (req.body.password) {
         user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            createdAt: updatedUser.createdAt,  
            token: generateToken(updatedUser._id),  
        })
        } else{
        res.status(404)
        throw new Error("User not found") 
    }
  })
  );

  module.exports =router;
