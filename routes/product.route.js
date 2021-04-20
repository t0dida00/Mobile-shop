const express = require('express');
const productModel = require('../models/product.model');
const brandModel = require('../models/brand.model');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await productModel.all();
  res.render('vwProducts/list', {
    products: list,
    empty: list.length === 0,
    err:req.session.err,
    success:req.session.success
  });
  delete req.session.err
  delete req.session.success
})

router.get('/add', async function (req, res) {
  const brandName= await brandModel.all();
  const categoryName= await categoryModel.all();
  res.render('vwProducts/add',{
    brands:brandName,
    categories:categoryName
  });
})

router.post('/add', async function (req, res) {
 
  await productModel.add(req.body);
  req.session.success="Add new product successfully !"
  res.redirect('/admin/products');
})


router.post('/del', async function (req, res) {

  await productModel.del(req.body.product_id);
  req.session.success="Delete product successfully !"
  res.redirect('/admin/products');
})

router.get('/edit/:id', async function (req, res) {
  // const id = +req.query.id || -1;
  const id = +req.params.id || -1;
  const rows = await productModel.single(id);
  var brands= await brandModel.all();
  var categories= await categoryModel.all();
  if (rows.length === 0)
    return res.send('Invalid parameter.');

  const products = rows[0];



  res.render('vwProducts/edit', { products, brands ,categories });
})

router.post('/update', async function (req, res) {
  

 
  const rows = await productModel.single(req.body.product_id);
  if(req.body.product_image=="")
  {
    req.body.product_image= rows[0].product_image
  }
  await productModel.patch(req.body);
  req.session.success="Update product information successfully !"
  res.redirect('/admin/products');
  
})

module.exports = router;