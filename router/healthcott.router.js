const express = require('express');
const router = express.Router();
var multer = require('multer');
var http = require('http');
var path = require('path');


//controller listing
const greetcontroller = require('../controller/greetings.controller');
const productcontroller = require('../controller/product.controller');
const billingcontroller = require('../controller/billing.controller');
const billpdfcontroller = require('../controller/billpdf.controller');
const estimatecontroller = require('../controller/estimate.controller');

//-------------------------------------------------------------------
const DIR = './public/bills';
let storage = multer.diskStorage({	
    destination: function (req, file, callback) {
      callback(null, DIR);        
    },
    filename: function (req, file, cb) 
    {      
      cb(null, file.originalname);      
 	}
});
let upload = multer({storage: storage});


 
  

//-----------------------------------------------------------





//---------------------------------------------------------------------
router.get("/greetings", greetcontroller.greetings);
//--------------------------------------------------------------------------

//-----------------------Product Api---------------------------
router.get("/getAllProducts", productcontroller.getAllProducts);
router.get("/getProductById", productcontroller.getProductById);
router.get("/getProductByName", productcontroller.getProductByName);
//--------------------------------------------------------------


//-----------------------Billing Details--------------------------
router.post('/insertBillingDetail', billingcontroller.insertBillingDetail);
router.get('/getLastBill', billingcontroller.getLastBill);
router.get('/getBillById', billingcontroller.getBillById);
router.get('/searchBill', billingcontroller.searchBill);
router.get('/filterBill', billingcontroller.filterBill);
router.get('/getAllBill', billingcontroller.getAllBill);
//----------------------------------------------------------------

//-----------------------Bill Pdf--------------------------
router.post('/insertBillingPdf', upload.single("bill_pdf"), billpdfcontroller.insertBillingPdf);
//----------------------------------------------------------------


//-----------------------Estimate Details--------------------------
router.post('/insertEstimateDetail', estimatecontroller.insertEstimateDetail);
router.post('/updateEstimateDetail', estimatecontroller.updateEstimateDetail);
router.get('/getEstimateById', estimatecontroller.getEstimateById);
router.get('/searchEstimate', estimatecontroller.searchEstimate);
router.get('/filterEstimate', estimatecontroller.filterEstimate);
router.get('/getAllEstimate', estimatecontroller.getAllEstimate);
router.get('/deleteEstimate', estimatecontroller.deleteEstimate);
router.get('/getLastEstimate', estimatecontroller.getLastEstimate);

//----------------------------------------------------------------
module.exports = router;