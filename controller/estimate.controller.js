var EstimateMaster = require('../modal/estimatemaster.modal');
var EstimateDetail = require('../modal/estimatedetail.modal');
const pool = require('../authorization/pool');

module.exports.insertEstimateDetail = function(req,res)
{              
    var em = new EstimateMaster(req.body);                
    if(!em.billing_autogennumber)
    {
        return res.status(400).send({ error:true, message: 'Please Enter Auto Generated Number.' });        
    }
    else if(!em.billing_date)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Billing Date.' });        
    }
    else if(!em.billing_duedate)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Billing Due Date.' });        
    }
    em.statusId=1;
    em.creationDate = new Date;
    console.log("Estimate Master", em);
    EstimateMaster.createEstimateMaster(em, function(err, data) 
    {
        if(err){
                res.send({status:400,success:false,message:"Details not saved."});
        }
        else{
                console.log('Data Id', data.id[0].estimate_id);
                console.log('Data ', data);
                var billing_id = data.id[0].estimate_id;
                insertEstimateDetail(billing_id, req,res);
            }
        });
}


insertEstimateDetail = async function(estimate_id,req,res){
try{
    //console.log('OrderDetailId', order_id);
    let odData = req.body.estimateDetail;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];

            console.log(Object.values(value));  
            odData[i].estimate_id = estimate_id;
            ed = new EstimateDetail(odData[i]);   

            if(!estimate_id)
            {
                return res.status(400).send({ error:true, message: 'No Billing.' });        
            }
            else if(!ed.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }      
            ed.statusId=1;
            ed.creationDate = new Date;
            EstimateDetail.createEstimateDetail(ed, function(err, data) 
            {
                if(err){
                    return res.send({status:400,success:false,message:"Details not saved." + err});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        return res.send({status:200,success:true,message: data.message, estimate_id: estimate_id});
                    }
                }
            });
        }    
}catch(e){console.log(e)}
}


module.exports.getEstimateById = function(req,res){
    var est_id = req.query.estimate_id;
    var query = `select es.*,est.*, pro.product_name, pro.product_weight as pro_weight  from estimate_master as es
    LEFT JOIN estimate_detail as est ON(es.estimate_id = est.estimate_id) 
    LEFT JOIN products as pro ON(est.product_id = pro.product_id) 
    Where es.statusId=1 and es.estimate_id=${est_id};`;
    pool.query(query,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        } 
        else{
            //res.send({status:200,success:true,message:"Detail Found", data:data});
            getIdJsonData(res, data);
        }
    });
}

function getIdJsonData(res,data){
    var estimateMaster = {};
var estimateDetail = [];

data.forEach(function(row) {
   var em = estimateMaster[row.estimate_id];
   console.log('Row',row);
   if (!em) {
      em = {
         estimate_id: row.estimate_id,
         billing_autogennumber: row.billing_autogennumber,
         user_name: row.user_name,
         address: row.address,
         email: row.email,
         billto_fullname: row.billto_fullname,
         billto_address: row.billto_address,
         billto_gst: row.billto_gst,
         billto_mobile: row.billto_mobile,
         billto_email: row.billto_email,
         billing_date: tranformDate(new Date(row.billing_date).toISOString().split('T')[0]),
         billing_duedate: tranformDate(new Date(row.billing_duedate).toISOString().split('T')[0]),
         balance_due: row.balance_due,
         totalweight: row.totalweight,
         totaldiscount: row.totaldiscount,
         totalcashdiscount: row.totalcashdiscount,
         totalamount: row.totalamount,
         afterdiscount_amount: row.afterdiscount_amount,
         gst: row.gst,
         totalpayable: row.totalpayable,
         amountbefore_gst: row.amountbefore_gst,
         estimateDet: []
      };

      estimateMaster[row.estimate_id] = em;
      estimateDetail.push(em);
   }
   console.log('Product Name', row.product_name);

   em.estimateDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_total_weight: row.product_weight,
    product_amount: row.product_amount,
    product_weight: row.pro_weight
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:estimateDetail});
}

module.exports.searchEstimate = function(req,res){
    var est = req.query.estimate;
    var query = `select es.*,est.*, pro.product_name from estimate_master as es
    LEFT JOIN estimate_detail as est ON(es.estimate_id = est.estimate_id) 
    LEFT JOIN products as pro ON(est.product_id = pro.product_id) 
    Where es.statusId=1 and es.user_name LIKE '%${est}%' OR es.billing_autogennumber LIKE'%${est}%';`;
    console.log('Query', query);
    pool.query(query,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        } 
        else{
            //res.send({status:200,success:true,message:"Detail Found", data:data});
            getSearchJsonData(res,data);
        }
    });
}

function getSearchJsonData(res,data){
    var estimateMaster = {};
var estimateDetail = [];

data.forEach(function(row) {
   var em = estimateMaster[row.estimate_id];
   console.log('Row',row);
   if (!em) {
      em = {
         estimate_id: row.estimate_id,
         billing_autogennumber: row.billing_autogennumber,
         user_name: row.user_name,
         address: row.address,
         email: row.email,
         billto_fullname: row.billto_fullname,
         billto_address: row.billto_address,
         billto_gst: row.billto_gst,
         billto_mobile: row.billto_mobile,
         billto_email: row.billto_email,
         billing_date: tranformDate(new Date(row.billing_date).toISOString().split('T')[0]),
         billing_duedate: tranformDate(new Date(row.billing_duedate).toISOString().split('T')[0]),
         balance_due: row.balance_due,
         totalweight: row.totalweight,
         totaldiscount: row.totaldiscount,
         totalcashdiscount: row.totalcashdiscount,
         totalamount: row.totalamount,
         afterdiscount_amount: row.afterdiscount_amount,
         gst: row.gst,
         totalpayable: row.totalpayable,
         amountbefore_gst: row.amountbefore_gst,
         estimateDet: []
      };

      estimateMaster[row.estimate_id] = em;
      estimateDetail.push(em);
   }
   console.log('Product Name', row.product_name);
   em.estimateDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_weight: row.product_weight,
    product_amount: row.product_amount
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:estimateDetail});
}

module.exports.filterEstimate = function(req,res){
    var year = req.query.year;
    var month = req.query.month;
    var query = `select es.*,est.*, pro.product_name from estimate_master as es 
                LEFT JOIN estimate_detail as est ON(es.estimate_id = est.estimate_id) 
                LEFT JOIN products as pro ON(est.product_id = pro.product_id) 
                Where es.statusId=1 and YEAR(es.billing_date) = ${year} and MONTH(es.billing_date) = ${month}; `;
    console.log('Query', query);
    pool.query(query,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        } 
        else{
            //res.send({status:200,success:true,message:"Detail Found", data:data});
            getFilterJsonData(res,data);
        }
    });
}

function getFilterJsonData(res,data){
    var estimateMaster = {};
var estimateDetail = [];

data.forEach(function(row) {
   var em = estimateMaster[row.estimate_id];
   console.log('Row',row);
   if (!em) {
      em = {
         estimate_id: row.estimate_id,
         billing_autogennumber: row.billing_autogennumber,
         user_name: row.user_name,
         address: row.address,
         email: row.email,
         billto_fullname: row.billto_fullname,
         billto_address: row.billto_address,
         billto_gst: row.billto_gst,
         billto_mobile: row.billto_mobile,
         billto_email: row.billto_email,
         billing_date: tranformDate(new Date(row.billing_date).toISOString().split('T')[0]),
         billing_duedate: tranformDate(new Date(row.billing_duedate).toISOString().split('T')[0]),
         balance_due: row.balance_due,
         totalweight: row.totalweight,
         totaldiscount: row.totaldiscount,
         totalcashdiscount: row.totalcashdiscount,
         totalamount: row.totalamount,
         afterdiscount_amount: row.afterdiscount_amount,
         gst: row.gst,
         totalpayable: row.totalpayable,
         amountbefore_gst: row.amountbefore_gst,
         estimateDet: []
      };

      estimateMaster[row.estimate_id] = em;
      estimateDetail.push(em);
   }
   console.log('Product Name', row.product_name);
   em.estimateDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_weight: row.product_weight,
    product_amount: row.product_amount
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:estimateDetail});
}

module.exports.getAllEstimate = function(req,res){
    var query = `select es.*,est.*, pro.product_name from estimate_master as es 
                LEFT JOIN estimate_detail as est ON(es.estimate_id = est.estimate_id) 
                LEFT JOIN products as pro ON(est.product_id = pro.product_id) 
                Where es.statusId=1 Order By es.billing_date DESC`;
    console.log('Query', query);
    pool.query(query,function(err,data){
        if(err){
            res.send({status:400,success:false,message:"No Detail Found"});
        }
        else if(data.length==0){
            res.send({status:200,success:true,message:"No Detail Available"});
        } 
        else{
            //res.send({status:200,success:true,message:"Detail Found", data:data});
            getProductJsonData(res, data);
        }
    });
}

function getProductJsonData(res,data){
    var estimateMaster = {};
var estimateDetail = [];

data.forEach(function(row) {
   var em = estimateMaster[row.estimate_id];
   console.log('Row',row);
   if (!em) {
      em = {
         estimate_id: row.estimate_id,
         billing_autogennumber: row.billing_autogennumber,
         user_name: row.user_name,
         address: row.address,
         email: row.email,
         billto_fullname: row.billto_fullname,
         billto_address: row.billto_address,
         billto_gst: row.billto_gst,
         billto_mobile: row.billto_mobile,
         billto_email: row.billto_email,
         //billing_date: row.billing_date,
         billing_date: tranformDate(new Date(row.billing_date).toISOString().split('T')[0]),
         billing_duedate: tranformDate(new Date(row.billing_duedate).toISOString().split('T')[0]),
         balance_due: row.balance_due,
         totalweight: row.totalweight,
         totaldiscount: row.totaldiscount,
         totalcashdiscount: row.totalcashdiscount,
         totalamount: row.totalamount,
         afterdiscount_amount: row.afterdiscount_amount,
         gst: row.gst,
         totalpayable: row.totalpayable,
         amountbefore_gst: row.amountbefore_gst,
         estimateDet: []
      };

      estimateMaster[row.estimate_id] = em;
      estimateDetail.push(em);
   }
   console.log('Product Name', row.product_name);
   em.estimateDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_weight: row.product_weight,
    product_amount: row.product_amount
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:estimateDetail});
}

function tranformDate(strDate) {

    console.log('raw date: ' + strDate);
   
    let result = '';

    if (strDate) {
      let parts = strDate.split('-');
      result = `${parts[1]}-${parts[2]}-${parts[0]}`;
    }
    return result;
}



module.exports.deleteEstimate = function(req,res,next)
{
    var estimate_id = req.query.estimate_id;
    pool.query(`DELETE FROM estimate_master, estimate_detail USING estimate_master 
                INNER JOIN estimate_detail ON estimate_master.estimate_id = estimate_detail.estimate_id  
                WHERE estimate_master.estimate_id = ${estimate_id};`,function(err, data) 
                {
                if(err){
                    res.send({status:400,success:false,message:"Details not deleted."});
                }           
                else{
                    res.send({status:200,success:true,message:"Details deleted Successfully."});
                }
        }); 
}

module.exports.getLastEstimate = function(req,res,next)
{
    EstimateMaster.getLastEstimate(function(err,data){
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

//Update Estimate Detail
module.exports.updateEstimateDetail = function(req,res)
{              
    var em = new EstimateMaster(req.body);                    
    if(!em.billing_date)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Billing Date.' });        
    }
    else if(!em.billing_duedate)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Billing Due Date.' });        
    }
    em.statusId=1;
    em.modificationDate = new Date;
    console.log("Update Estimate Master", em);
    EstimateMaster.updateEstimateMaster(req.body.estimate_id,em, function(err, data)
    {
        if(err){
                res.send({status:400,success:false,message:"Details not saved."});
        }
        else{
                console.log('Data Id', data.id[0].estimate_id);
                console.log('Data ', data);
                var billing_id = data.id[0].estimate_id;
                updateEstimateDetail(billing_id, req,res);
            }
        });
}
updateEstimateDetail = async function(estimate_id,req,res){
try{
    let odData = req.body.estimateDetail;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];
            console.log(Object.values(value));  
            //odData[i].estimate_id = estimate_id;
            var id = odData[i].estimate_detailId;  
            ed = new EstimateDetail(odData[i]);  
            console.log('ED', ed);
            if(!estimate_id)
            {
                return res.status(400).send({ error:true, message: 'No Estimate.' });        
            }
            else if(!ed.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }      
            ed.statusId=1;
            ed.modificationDate = new Date;
            EstimateDetail.updateEstimateDetail(id,estimate_id,ed, function(err, data)
            {
                if(err){
                    return res.send({status:400,success:false,message:"Details not saved." + err});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        return res.send({status:200,success:true,message: data.message});
                    }
                }
            });
        }    
}catch(e){console.log(e)}
}