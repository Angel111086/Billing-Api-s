var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const BillPdf = function(billpdf, file) {   
  this.billing_id = billpdf.billing_id;
  this.bill_pdf = file;
  this.statusId = billpdf.statusId;
  this.createdById = billpdf.createdById;  
  this.creationDate = billpdf.creationDate;
  this.modifiedById = billpdf.modifiedById;
  this.modificationDate = billpdf.modificationDate;
};

BillPdf.createBillPdf = function (billpdf, result) {       
    pool.query("INSERT INTO bill_pdf SET ?", billpdf, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"Details Saved Successfully."});

            }
        });           
};

module.exports = BillPdf;