var Product = require('../modal/product.modal');

module.exports.getAllProducts = function(req,res,next)
{
    Product.getAllProducts(function(err,data){
    if(err){
        res.send({status:400,success:false,message:"No Detail Found"});
    }
    else if(data.length==0){
        res.send({status:200,success:true,message:"No Detail Available"});
    } 
    else{
            res.send({status:200,success:true,message:"Detail Found", data:data});
        }
    });
}

module.exports.getProductById = function(req,res,next)
{
    Product.getProductById(req.query.product_id,function(err,data){
    if(err){
        res.send({status:400,success:false,message:"No Detail Found"});
    }
    else if(data.length==0){
        res.send({status:200,success:true,message:"No Detail Available"});
    } 
    else{
            res.send({status:200,success:true,message:"Detail Found", data:data});
        }
    });
}

module.exports.getProductByName = function(req,res,next)
{
    Product.getProductByName(req.query.num,function(err,data){
    if(err){
        res.send({status:400,success:false,message:"No Detail Found"});
    }
    else if(data.length==0){
        res.send({status:200,success:true,message:"No Detail Available"});
    } 
    else{
            res.send({status:200,success:true,message:"Detail Found", data:data});
        }
    });
}