const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

// router.get('/', async function (req, res) {
//   const list = await productModel.all();
//   res.render('vwProducts/list', {
//     products: list,
//     empty: list.length === 0
//   });
// })

router.get('/',function(req,res){
    res.render('vwCustomers/list');
})
module.exports = router;