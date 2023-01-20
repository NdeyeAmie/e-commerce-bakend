const  bcrypt =require("bcryptjs");

const UserModels = [
    {
        username:"Admin",
        email:"admin@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
    },
    {
        username:"User",
        email:"user@gmail.com",
        password:bcrypt.hashSync("123456", 10),
        isUser: true,
           
    },
    {
        username: "user",
        email:"user@gmail.com",
        password:bcrypt.hashSync("123456",10),
        isUser: true,
    },
]
module.exports= UserModels;