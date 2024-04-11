var BillingDetail = require('../modal/billingdetail.modal');
//var jimp = require("jimp");
const BillPdf = require('../modal/billpdf.modal');
const fs = require('fs');
var path = require('path');


module.exports.insertBillingPdf = function(req,res)
{              
    try
    {    
        if(!req.file){
            res.status(400).send({ success:false, message: 'Please Provide Bill.' });        
        }
        else{ 
            console.log(req.file.filename)
            var pdf = req.file.filename
  
        var bp = new BillPdf(req.body, pdf);         
        bp.statusId=1;
        bp.creationDate = new Date;
        console.log("Bill Pdf", bp);
        BillPdf.createBillPdf(bp, function(err, data) 
        {
            if(err){
                res.send({status:400,success:false,message:"Details not saved."});
            }
            else{
                res.send({status:200,success:true,message: data.message});
            }
        });
    }
    }catch(e){console.log(e)}
}