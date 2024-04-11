var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const BillingMaster = function(billingmaster) {   
  this.billing_autogennumber = billingmaster.billing_autogennumber;
  this.user_name = billingmaster.user_name;
  this.address = billingmaster.address;
  this.email = billingmaster.email;
  this.billto_fullname = billingmaster.billto_fullname;
  this.billto_address = billingmaster.billto_address;
  this.billto_gst = billingmaster.billto_gst;
  this.billto_mobile = billingmaster.billto_mobile;
  this.billto_email = billingmaster.billto_email;
  this.billing_date = billingmaster.billing_date;   
  this.billing_duedate = billingmaster.billing_duedate;   
  this.balance_due = billingmaster.balance_due;   
  this.totalweight = billingmaster.totalweight;   
  this.totaldiscount = billingmaster.totaldiscount;   
  this.totalcashdiscount = billingmaster.totalcashdiscount;   
  this.totalamount = billingmaster.totalamount;   
  this.afterdiscount_amount = billingmaster.afterdiscount_amount;   
  this.gst = billingmaster.gst;   
  this.totalpayable = billingmaster.totalpayable;   
  this.amountbefore_gst = billingmaster.amountbefore_gst;
  this.statusId = billingmaster.statusId;
  this.createdById = billingmaster.createdById;  
  this.creationDate = billingmaster.creationDate;
  this.modifiedById = billingmaster.modifiedById;
  this.modificationDate = billingmaster.modificationDate;
};

BillingMaster.createBillingMaster = function (billingmaster, result) {       
    pool.query("INSERT INTO billing_master SET ?", billingmaster, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                pool.query(`select * from billing_master where billing_id=${res.insertId}`, function(err, data){
                    if(err){
                        console.log(err);
                        result(err, null);
                    }
                    else{     
                        result(null, {status:200,success:true,message:"Details Saved Successfully.",id: data});
                    }
                });
            }
        });           
};



BillingMaster.getLastBill = function(result)
{
    pool.query(`SELECT billing_id,billing_autogennumber FROM billing_master ORDER BY billing_id DESC LIMIT 1`, function (err, res) {
        if(err) {
            console.log(err);
            result(err, null);
        }
        else{                       
            result(null, res);

        }
    });          
}
module.exports = BillingMaster;