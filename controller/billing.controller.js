var BillingMaster = require('../modal/billingmaster.modal');
var BillingDetail = require('../modal/billingdetail.modal');
const pool = require('../authorization/pool');

module.exports.insertBillingDetail = function(req,res,next)
{              
    var bm = new BillingMaster(req.body);                
    if(!bm.billing_autogennumber)
    {
        return res.status(400).send({ error:true, message: 'Please Enter Auto Generated Number.' });        
    }
    else if(!bm.billing_date)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Billing Date.' });        
    }
    else if(!bm.billing_duedate)
    {
        return res.status(400).send({ error:true, message: 'Please Provide Billing Due Date.' });        
    }
    bm.statusId=1;
    bm.creationDate = new Date;
    console.log("Billing Master", bm);
    BillingMaster.createBillingMaster(bm, function(err, data) 
    {
        if(err){
                res.send({status:400,success:false,message:"Details not saved."});
        }
        else{
                console.log('Data Id', data.id[0].billing_id);
                console.log('Data ', data);
                var billing_id = data.id[0].billing_id;
                insertBillingDetail(billing_id, req,res);
            }
        });
}


insertBillingDetail = async function(billing_id,req,res){
try{
    //console.log('OrderDetailId', order_id);
    let odData = req.body.billingDetail;
        var value,order,count=0;
        for(i=0;i<odData.length;i++)
        {
            value = odData[i];

            console.log(Object.values(value));  
            odData[i].billing_id = billing_id;
            bd = new BillingDetail(odData[i]);   

            if(!billing_id)
            {
                return res.status(400).send({ error:true, message: 'No Billing.' });        
            }
            else if(!bd.product_id)
            {
                return res.status(400).send({ error:true, message: 'Please Provide Product' });        
            }      
            bd.statusId=1;
            bd.creationDate = new Date;
            BillingDetail.createBillingDetail(bd, function(err, data) 
            {
                if(err){
                    return res.send({status:400,success:false,message:"Details not saved." + err});
                }
                else{
                    count++;
                    if(count==odData.length)
                    {
                        //console.log('Test PA Value', data);
                        return res.send({status:200,success:true,message: data.message, bill_id: billing_id});
                    }
                }
            });
        }    
}catch(e){console.log(e)}
}


module.exports.getLastBill = function(req,res,next)
{
    BillingMaster.getLastBill(function(err,data){
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

module.exports.getBillById = function(req,res){
    var bill_id = req.query.billing_id;
    var query = `select bm.*,bd.*, bp.bill_pdf, pro.product_name from billing_master as bm
    LEFT JOIN billing_detail as bd ON(bm.billing_id = bd.billing_id) 
    LEFT JOIN bill_pdf as bp ON(bm.billing_id = bp.billing_id) 
    LEFT JOIN products as pro ON(bd.product_id = pro.product_id) 
    Where bm.statusId=1 and bm.billing_id=${bill_id};`;
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
    var billingMaster = {};
var billingDetail = [];

data.forEach(function(row) {
   var bm = billingMaster[row.billing_id];
   console.log('Row',row);
   if (!bm) {
      bm = {
         billing_id: row.billing_id,
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
         bill_pdf: row.bill_pdf,
         billDet: []
      };

      billingMaster[row.billing_id] = bm;
      billingDetail.push(bm);
   }
   console.log('Product Name', row.product_name);
   bm.billDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_weight: row.product_weight,
    product_amount: row.product_amount
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:billingDetail});
}

module.exports.searchBill = function(req,res){
    var est = req.query.bill;
    var query = `select bm.*,bd.*, pro.product_name from billing_master as bm
    LEFT JOIN billing_detail as bd ON(bm.billing_id = bd.billing_id) 
    LEFT JOIN products as pro ON(bd.product_id = pro.product_id) 
    Where bm.statusId=1 and bm.user_name LIKE '%${est}%' OR bm.billing_autogennumber LIKE'%${est}%';`;
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
            getSearchJsonData(res, data);;
        }
    });
}

function getSearchJsonData(res,data){
    var billingMaster = {};
var billingDetail = [];

data.forEach(function(row) {
   var bm = billingMaster[row.billing_id];
   console.log('Row',row);
   if (!bm) {
      bm = {
         billing_id: row.billing_id,
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
         bill_pdf: row.bill_pdf,
         billDet: []
      };

      billingMaster[row.billing_id] = bm;
      billingDetail.push(bm);
   }
   console.log('Product Name', row.product_name);
   bm.billDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_weight: row.product_weight,
    product_amount: row.product_amount
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:billingDetail});
}

module.exports.filterBill = function(req,res){
    var year = req.query.year;
    var month = req.query.month;
    var query = `select bm.*,bd.*, pro.product_name from billing_master as bm 
                LEFT JOIN billing_detail as bd ON(bm.billing_id = bd.billing_id) 
                LEFT JOIN products as pro ON(bd.product_id = pro.product_id) 
                Where bm.statusId=1 and YEAR(bm.billing_date) = ${year} and MONTH(bm.billing_date) = ${month}; `;
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
    var billingMaster = {};
var billingDetail = [];

data.forEach(function(row) {
   var bm = billingMaster[row.billing_id];
   console.log('Row',row);
   if (!bm) {
      bm = {
         billing_id: row.billing_id,
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
         bill_pdf: row.bill_pdf,
         billDet: []
      };

      billingMaster[row.billing_id] = bm;
      billingDetail.push(bm);
   }
   console.log('Product Name', row.product_name);
   bm.billDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_weight: row.product_weight,
    product_amount: row.product_amount
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:billingDetail});
}


module.exports.getAllBill = function(req,res){
    var query = `select bm.*,bd.*, bp.bill_pdf, pro.product_name from billing_master as bm 
                LEFT JOIN billing_detail as bd ON(bm.billing_id = bd.billing_id) 
                LEFT JOIN bill_pdf as bp ON(bm.billing_id = bp.billing_id) 
                LEFT JOIN products as pro ON(bd.product_id = pro.product_id) 
                Where bm.statusId=1 Order By bm.billing_date DESC`;
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
            getProductJsonData(res,data);
        }
    });
}
function getProductJsonData(res,data){
    var billingMaster = {};
var billingDetail = [];

data.forEach(function(row) {
   var bm = billingMaster[row.billing_id];
   console.log('Row',row);
   if (!bm) {
      bm = {
         billing_id: row.billing_id,
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
         bill_pdf: row.bill_pdf,
         billDet: []
      };

      billingMaster[row.billing_id] = bm;
      billingDetail.push(bm);
   }
   console.log('Product Name', row.product_name);
   bm.billDet.push({
    product_id: row.product_id,
    product_name: row.product_name,
    product_quantity: row.product_quantity,
    product_rate: row.product_rate,
    product_weight: row.product_weight,
    product_amount: row.product_amount
   });
});
//console.log(JSON.stringify(billingDetail));
res.send({status:200,success:true,message:"Detail Found", data:billingDetail});
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