var mysql = require('mysql');
const pool = require('../authorization/pool');

// constructor
const Product = function(product) {   
  this.product_name = product.product_name;
  this.product_rate = product.product_rate;   
  this.product_weight = product.product_weight;   
  this.product_gst = product.product_gst;   
  this.statusId = product.statusId;
  this.createdById = product.createdById;  
  this.creationDate = product.creationDate;
  this.modifiedById = product.modifiedById;
  this.modificationDate = product.modificationDate;
};

Product.createProduct = function (product, result) {       
    pool.query("INSERT INTO products SET ?", product, function (err, res) {
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

Product.getAllProducts = function (result) {       
    pool.query(`select * from products order by product_id DESC`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getProductById = function (id,result) {       
    pool.query(`select * from products where product_id=${id}`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

Product.getProductByName = function(num, result){
    var query;
    if(num==1){
        query = `select * from products where product_name LIKE '%Absorbent Cotton%'`
    }
    else{
        query = `select * from products where product_name LIKE '%Carded Cotton%'`;
    }
    pool.query(query, function (err, res) {
        if(err) {
            console.log(err);
            result(err, null);
        }
        else{                       
            result(null, res);

        }
    }); 
}


module.exports = Product;