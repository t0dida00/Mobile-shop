const express = require('express');

const otherModel= require("../models/other.model")

const customerModel= require("../models/customer.model")

const router = express.Router();

router.get('/index', async function (req, res) {
  
  const product_list= await otherModel.getProduct();
 
  res.render('vwClient/index',{layout:'index', encodedJson : encodeURIComponent(JSON.stringify(product_list))})
 
  
})
router.get('/list/:query?', async function (req, res) {
 
   
    if(req.query.nameBrand)
    {
      var product_list= await otherModel.getProductByBrand(req.query.id);
      var flag=true
    }
    else{
      var product_list= await otherModel.getProductByCategory(req.query.id);
     
    }
    
    var id_filter= req.query.id
    
  
return res.render('vwClient/list',{layout:'index', encodedJson : encodeURIComponent(JSON.stringify(product_list)),flag,id_filter})


})


router.get('/product/:id?', async function (req, res) {
  
  var product= await otherModel.getProductById(req.query.id);
    product=product[0];
  
    var list_product= await otherModel.getProductByCategoryRandom(req.query.idCate); 
    
  return res.render('vwClient/detail',{layout:'index',product,list_product})
                                                         

})
router.get('/shopping-cart', async function (req, res) {
  
  
  return res.render('vwClient/shopping_Cart',{layout:'index'})
                                                         

})

router.get('/checkout',async function(req,res){

  const state_list = await otherModel.getState();

  return res.render('vwClient/information',{layout:'index',state_list})
})
  
router.post('/checkout',async function(req,res){

  
  //get data from request
  var id_product_list=req.body.id_product_list;
  delete req.body.id_product_list
  var quantity_product_list = req.body.quantity_list
  delete req.body.quantity_list
  var payment=req.body.payment
  delete req.body.payment
  //Change string to array
  var array_id_product=id_product_list.split(",");
  var array_quantity_lis = quantity_product_list.split(",")
  //Check if customer is exists
  const check_data=await customerModel.getCustomerByPhoneOrEmail(req.body.customer_phone,req.body.customer_mail)
  if(check_data.length !=0)
  {
    //Neu ton` tai. thi` lay id nay va cap nhat don hang
    console.log(check_data[0].customer_id)
  }
  else{
    //Neu chua co thi tao moi o day
   
    //Tao moi xong thi lay ID lon nhat de cap nhat vao order
    //const customer= await customerModel.add(req.body);
   
      //console.log(customer.insertId)
  }
 
  //conditions for create new order
  


  var today = new Date()
  var order_estimated_date=new Date();
  order_estimated_date.setDate(new Date().getDate() + 5)

 
  const order_condition={
    customer_id : 13,
    order_date :today,
    order_status: 1,
    order_payment: payment,
    order_estimated_date: order_estimated_date,

  }

 console.log(order_condition)

 // console.log(req.body) // condition for create new customer

})
router.post('/filter', async function (req, res) {
 
  var sql="";
  if(req.body.brand_category_filter)
  {
    sql+="WHERE "+ req.body.flag2 + " = " +req.body.id_filter+ " ";
    if((req.body.brand_category_filter).length>2)
    {
      sql+= "AND "+req.body.flag1 +" IN ("+req.body.brand_category_filter + ") "
    }
   
  }
 
  if(req.body.price_filter)
  {
    sql+=req.body.price_filter
  }

     const list_product= await otherModel.searchProduct(sql)
  
  
     res.send({list_product:JSON.stringify(list_product)});



})
module.exports = router;