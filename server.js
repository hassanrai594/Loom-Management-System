const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const es6Renderer = require('express-es6-template-engine');
const cookieParser = require('cookie-parser');



// ------ Initializing Middle-Ware ------ //
const PORT = 4000;
const TEMPLATES_PATH = __dirname + "\\templates";

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.static(TEMPLATES_PATH))
app.use(cookieParser());
// Setting Templating Engine
app.engine('html', es6Renderer);
// Defining Directory that contains all templates
app.set('views', 'templates');
app.set('view engine', 'html');



// -------------------------------------- //


// ----------- Importing Controllers -----------//
var verifyRoutes = require("./controllers/verifyToken");
var userRoutes = require("./controllers/userControllers");
var loomRoutes = require("./controllers/loomControllers");
var stockRoutes = require("./controllers/stockControllers");
var purchaseRoutes = require("./controllers/purchaseControllers");
var saleRoutes = require("./controllers/saleControllers");
var attendenceRoutes = require("./controllers/attendenceControllers");
var shiftRoutes = require("./controllers/shiftControllers");
var salaryRoutes = require("./controllers/salaryControllers");
var expenseRoutes = require("./controllers/expenseControllers");
var profitRoutes = require("./controllers/profitControllers");
var productRoutes = require("./controllers/productControllers");
var raw_materialRoutes = require("./controllers/raw_materialControllers");
var reportRoutes = require("./controllers/reportControllers");
var accountRoutes = require("./controllers/accountControllers");
var employRecordRoutes = require("./controllers/employRecordsController");
var homePageRoutes = require("./controllers/homePageControllers");
var queryRoutes = require("./controllers/queryControllers");
var emailRoutes = require("./controllers/emailControllers");
// -------------------------------------------- //



// Initializing different Routes with base Apis //

app.use("/home", homePageRoutes);
app.use('/verify', verifyRoutes);
app.use('/user', userRoutes);
app.use('/loom', loomRoutes);
app.use('/stock', stockRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/sale', saleRoutes);
app.use('/attendence', attendenceRoutes);
app.use('/shift', shiftRoutes);
app.use('/salary', salaryRoutes);
app.use('/expense', expenseRoutes);
app.use('/profit', profitRoutes);
app.use('/product', productRoutes);
app.use('/raw_material', raw_materialRoutes);
app.use('/report', reportRoutes);
app.use('/query', queryRoutes);
app.use('/email', emailRoutes);
app.use('/account', accountRoutes);
app.use('/emprec', employRecordRoutes);


// Starting server
app.listen(PORT, function() {
    console.log(`Server Up at http://localhost:${PORT}`);
});