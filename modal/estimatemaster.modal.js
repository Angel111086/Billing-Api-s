var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const EstimateMaster = function(estimatemaster) {   
  this.billing_autogennumber = estimatemaster.billing_autogennumber;
  this.user_name = estimatemaster.user_name;
  this.address = estimatemaster.address;
  this.email = estimatemaster.email;
  this.billto_fullname = estimatemaster.billto_fullname;
  this.billto_address = estimatemaster.billto_address;
  this.billto_gst = estimatemaster.billto_gst;
  this.billto_mobile = estimatemaster.billto_mobile;
  this.billto_email = estimatemaster.billto_email;
  this.billing_date = estimatemaster.billing_date;   
  this.billing_duedate = estimatemaster.billing_duedate;   
  this.balance_due = estimatemaster.balance_due;   
  this.totalweight = estimatemaster.totalweight;   
  this.totaldiscount = estimatemaster.totaldiscount;
  this.totalcashdiscount = estimatemaster.totalcashdiscount;
  this.totalamount = estimatemaster.totalamount;  
  this.afterdiscount_amount = estimatemaster.afterdiscount_amount, 
  this.gst = estimatemaster.gst;   
  this.totalpayable = estimatemaster.totalpayable;  
  this.amountbefore_gst = estimatemaster.amountbefore_gst; 
  this.statusId = estimatemaster.statusId;
  this.createdById = estimatemaster.createdById;  
  this.creationDate = estimatemaster.creationDate;
  this.modifiedById = estimatemaster.modifiedById;
  this.modificationDate = estimatemaster.modificationDate;
};

EstimateMaster.createEstimateMaster = function (estimatemaster, result) {       
    pool.query("INSERT INTO estimate_master SET ?", estimatemaster, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                pool.query(`select * from estimate_master where estimate_id=${res.insertId}`, function(err, data){
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


EstimateMaster.updateEstimateMaster = function (id,em, result) {      
    pool.query(`update estimate_master SET billing_date=?, billing_duedate=?,balance_due=?,totalweight=?,
                totaldiscount=?, totalcashdiscount=?,totalamount=?,afterdiscount_amount=?, gst=?,
                totalpayable=?,amountbefore_gst=?,modificationDate=? where estimate_id=?`, 
                [em.billing_date, em.billing_duedate,em.balance_due,
                em.totalweight,em.totaldiscount,em.afterdiscount_amount,
                em.totalcashdiscount,em.totalamount,
                em.gst, em.totalpayable,em.amountbefore_gst,em.modificationDate,id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);        
                pool.query(`select * from estimate_master where estimate_id=${id}`, function(err, data){
                    if(err){
                        console.log(err);
                        result(err, null);
                    }
                    else{    
                        result(null, {status:200,success:true,message:"Details Updated Successfully.",id: data});
                    }
                });
            }
        });          
};

EstimateMaster.getLastEstimate = function(result)
{
    pool.query(`SELECT estimate_id,billing_autogennumber FROM estimate_master 
                ORDER BY estimate_id DESC LIMIT 1`, function (err, res) {
        if(err) {
            console.log(err);
            result(err, null);
        }
        else{                       
            result(null, res);

        }
    });          
}

module.exports = EstimateMaster;