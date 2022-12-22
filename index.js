const express = require("express");
//import products from "./Data.js";
const cors = require('cors');
const multer = require('multer')
 //const products = require('./Data')
const dotenv = require("dotenv");
 //const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// const authRoute = require("./routes/auth");
// const productRoute = require("./routes/product");
// const productDetailRoute = require("./routes/productDetail");
// const orderRoute = require("./routes/order");
const DataimportRoute = require("./models/Dataimport") 
const productRoute = require("./routes/product");
const { notFound, errorHandler } = require("./Middleware/Error");
const authRoute = require("./routes/auth")
const orderRoute = require("./routes/order")
const uploadRoute = require("./routes/upload")

const app = express();

dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })
  
  const upload = multer({ storage: storage })
  
// Configurer la connexion mongoose par défaut  
// const mongoDB = "mongodb+srv://mya:w5EGjKeWSyjeY6VC@cluster0.y5vgdxc.mongodb.net/myashop?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connecter!!'))
    .catch((err) => {
        console.log(err);
    });

app.use(cors());

// app.post('/image', upload.single('file'), function (req, res) {
//     res.json({})
//   })

app.use(express.json());
 app.use(express.urlencoded({extended: false}));
 app.use(cookieParser());
// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/products", productRoute);
// app.use("/api/productDetails", productDetailRoute);
// app.use("/api/orders", orderRoute);
app.use("/api/import", DataimportRoute);
app.use("/api/products", productRoute);
app.use("/api/users", authRoute);
app.use('/api/orders', orderRoute);
app.use('/api/upload', uploadRoute);




//ERROR HANDLER
app.use(notFound);
app.use(errorHandler);




// Obtenirs la connexion par défaut
const db = mongoose.connection;





// Liez la connexion à l'événement d'erreur pour obtenir une notification des erreurs de connexion
db.on("error", console.error.bind(console, "MongoDB connection error:"));


//product from server
//  app.get("/api/products", (req, res) => {
//     res.send( products);
//  });


//   app.get("/api/products/:id", (req, res) => {
//  const thisProduct = products.find((prod) => prod.id === req.params.id);
//     res.json(thisProduct);
//   });

//demarrer le serveur
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`L'application est demarré au port ${port}`);
});