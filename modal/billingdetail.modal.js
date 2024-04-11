var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const BillingDetail = function(billingdetail) {   
  this.billing_id = billingdetail.billing_id;
  this.product_id = billingdetail.product_id;   
  this.product_quantity = billingdetail.product_quantity;   
  this.product_rate = billingdetail.product_rate;   
  this.product_weight = billingdetail.product_weight;   
  this.product_amount = billingdetail.product_amount;   
  this.statusId = billingdetail.statusId;
  this.createdById = billingdetail.createdById;  
  this.creationDate = billingdetail.creationDate;
  this.modifiedById = billingdetail.modifiedById;
  this.modificationDate = billingdetail.modificationDate;
};

BillingDetail.createBillingDetail = function (billingdetail, result) {       
    pool.query("INSERT INTO billing_detail SET ?", billingdetail, function (err, res) {
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

module.exports = BillingDetail;