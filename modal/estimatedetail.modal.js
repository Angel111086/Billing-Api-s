var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const EstimateDetail = function(estimatedetail) {   
  this.estimate_id = estimatedetail.estimate_id;
  this.product_id = estimatedetail.product_id;   
  this.product_quantity = estimatedetail.product_quantity;   
  this.product_rate = estimatedetail.product_rate;   
  this.product_weight = estimatedetail.product_weight;   
  this.product_amount = estimatedetail.product_amount;   
  this.statusId = estimatedetail.statusId;
  this.createdById = estimatedetail.createdById;  
  this.creationDate = estimatedetail.creationDate;
  this.modifiedById = estimatedetail.modifiedById;
  this.modificationDate = estimatedetail.modificationDate;
};

EstimateDetail.createEstimateDetail = function (estimatedetail, result) {       
    pool.query("INSERT INTO estimate_detail SET ?", estimatedetail, function (err, res) {
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


EstimateDetail.updateEstimateDetail = function (id,est_id,ed, result) {
    var query = `update estimate_detail SET product_id=?, product_quantity=?,product_rate=?,
    product_weight=?, product_amount=?, modificationDate=? where estimate_detailId=? and estimate_id=?`;  
    pool.query(query,
                [ed.product_id, ed.product_quantity, ed.product_rate, ed.product_weight,ed.product_amount,
                ed.modificationDate, id,est_id], function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log('Detail Query', query);        
                result(null, {status:200,success:true,message:"Details Updated Successfully."});
            }
        });          
};

module.exports = EstimateDetail;