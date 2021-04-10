const express = require('express');
const orderModel = require('../models/order.model');
var moment = require('moment');  
const customerModel = require('../models/customer.model');

const router = express.Router();


router.get('/',async function(req,res){
    const list = await orderModel.all();
 
 for(let i = 0; i < list.length; i++)
{
    list[i].order_date=moment(list[i].order_date).format('DD-MM-YYYY');
}
  res.render('vwOrders/list', {
    orders: list,
    empty: list.length === 0,
    err:req.session.err,
    success: req.session.success
    
  });
  delete req.session.err
  delete req.session.success
})
router.post('/detail', async function(req,res){
   
const order= await orderModel.single(req.body.order_id)

res.send(JSON.stringify(order));

})

router.post('/del', async function (req, res) {
 
 await orderModel.del(req.body.order_id);
 req.session.success="Delete order successfully !"
 res.redirect('/admin/orders/');
})

router.get('/overview',async function(req,res)
{
  const list_order = await orderModel.all();
  var count_total= 0;
  for(let i = 0; i < list_order.length; i++)
{
  list_order[i].order_date=moment(list_order[i].order_date).format('DD-MM-YYYY');
    count_total=count_total + list_order[i].Total
}
 const total_customer= await customerModel.countCustomer()
  
 const dataProfitChart= await orderModel.getValueforChart()
 const dataOrderChat= await orderModel.getValueforOrderChart()




  res.send({list_order:JSON.stringify(list_order),customer:JSON.stringify(total_customer),profitChart:JSON.stringify(dataProfitChart),orderChart:JSON.stringify(dataOrderChat)});
})
module.exports = router;