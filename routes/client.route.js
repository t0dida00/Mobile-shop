const express = require('express');

const otherModel= require("../models/other.model")

const customerModel= require("../models/customer.model")

const orderModel= require("../models/order.model")
var moment = require('moment');  
const router = express.Router();

router.get('/index', async function (req, res) {
  
  const product_list= await otherModel.getProduct();
 
  res.render('vwClient/index',{layout:'index', 
  encodedJson : encodeURIComponent(JSON.stringify(product_list))
})

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
  
  
 res.render('vwClient/shopping_cart',{layout:'index',
  err:req.session.err,
  success: req.session.success
})

 delete req.session.err
 delete req.session.success
})

router.get('/checkout',async function(req,res){

  const state_list = await otherModel.getState();

  return res.render('vwClient/information',{layout:'index',state_list})
})
  

router.get('/search?', async function(req,res)
{
  const data= req.query.customer_phone
  
  if(data )
  { 
    const list = await orderModel.searchByPhone(data);
 
 for(let i = 0; i < list.length; i++)
{
    list[i].order_date=moment(list[i].order_date).format('DD-MM-YYYY');
    list[i].order_estimated_date=moment(list[i].order_estimated_date).format('DD-MM-YYYY');
}
 return res.render('vwClient/search', {
  layout:"index",
  list: list,
  empty: list.length === 0,
});
  }

 return res.render('vwClient/search',{layout:'index'})
})
router.post('/del', async function (req, res) {
 
  await orderModel.del(req.body.order_id);
  req.session.success="Delete order successfully !"
  return res.redirect(`/search?customer_phone=${req.body.customer_phone1}`);

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
  var array_quantity_list = quantity_product_list.split(",")
  //temp
  var id_customer = 13;
  var order_id=13;
  //Check if customer is exists
  const check_data=await customerModel.getCustomerByPhoneOrEmail(req.body.customer_phone,req.body.customer_mail)
  if(check_data.length !=0)
  {
    //Neu ton` tai. thi` lay id nay va cap nhat don hang
   
    id_customer=check_data[0].customer_id
  }
  else{
    //Neu chua co thi tao moi o day
    const customer= await customerModel.add(req.body);
   
     
      id_customer=customer.insertId
  }
 
  //conditions for create new order
  


  var today = new Date()
  var order_estimated_date=new Date();
  order_estimated_date.setDate(new Date().getDate() + 5)

 
  const order_condition={
    customer_id : id_customer,
    order_date :today,
    order_status: 1,
    order_payment: payment,
    order_estimated_date: order_estimated_date,

  }

  const order= await orderModel.add(order_condition)
  order_id = order.insertId
  //condition for create order_item
for(let i = 0 ;i<array_id_product.length;i ++)
{
  const order_items_condition={
    order_id: order_id,
    product_id:parseInt(array_id_product[i]),
    quantity: parseInt(array_quantity_list[i])

  }

  const order_items= await orderModel.addOrderItems(order_items_condition)

  
}


req.session.success="Checkout successfully !"

 res.redirect('/shopping-cart');


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