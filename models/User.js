const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            //unique: true
        },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        require:true,
        default: false,
    },
    },
    { timestamps: true}
);

//LOGIN
UserSchema.methods.matchPassword = async function(enterPassword) {
    return await bcrypt.compare(enterPassword,this.password);
};



//register
 UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")){
        next();
   // this.password = bcryptjs.hashSync(this.password, 10);
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
 });

module.exports = mongoose.model("User", UserSchema)