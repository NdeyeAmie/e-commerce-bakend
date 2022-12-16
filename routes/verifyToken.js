   const jwt =require("jsonwebtoken");

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:"30d",
    });
};

module.exports =  generateToken;


//   const verifyToken = (req, res, next) =>{
//      const authHeader = req.headers.token;
//      if (authHeader) {
//           const token = authHeader.split(" ")[1];
//          jwt.verify(token, process.env.JWT_SEC, (err, user) =>{
//             if(err) res.status(403).json("le token n'est pas valide");
//             req.user = user; 
//             next();
//          });
//      } else {
//          return res.status(401).json("vous n'etes pas authentifie");
//      }
//  };

//   const verifyTokenAndAuthorization = (req, res, next) =>{
//      verifyToken(req, res, () =>{
//           if (req.user.id === req.params.id || req.user.isAdmin){
//           next();
//          } else {
//              res.status(403).json("vous n'avez pas le droit de faire ca")
//          }
//          });
//       };

//      const verifyTokenAndAdmin = (req,res,next) =>{
//         verifyToken(req, res, () =>{
//              if (req.user.isAdmin){
//              next();
//             } else {
//                 res.status(403).json("vous n'avez pas le droit de faire ca")
//             }
//             });
//          };


//    module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };