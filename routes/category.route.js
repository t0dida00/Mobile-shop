const express = require('express');
const categoryModel = require('../models/category.model');
const productModel= require("../models/product.model")
const router = express.Router();

router.get('/', async function (req, res) {

  const list = await categoryModel.all();
 
  res.render('vwCategories/list', {
    categories: list,
    empty: list.length === 0,
    err:req.session.err,
    success: req.session.success
    
  });
  delete req.session.err
  delete req.session.success
})

router.get('/add', function (req, res) {
  res.render('vwCategories/add');
})

router.post('/add', async function (req, res) {
  const name = req.body.category_name
  const check= await categoryModel.available(name)

  if(check.length !== 0)
  {
    req.session.err="Add new category fail because this name is available !"
   return res.redirect('/admin/categories');
  }
  
  await categoryModel.add(req.body);
  req.session.success="Add new category successfully !"
  res.redirect('/admin/categories');
})

router.get('/edit/:id', async function (req, res) {
  // const id = +req.query.id || -1;
  const id = +req.params.id || -1;
  const rows = await categoryModel.single(id);
  if (rows.length === 0)
    return res.send('Invalid parameter.');

  const category = rows[0];
  res.render('vwCategories/edit', { category });
})

router.post('/del', async function (req, res) {
  const check_list=await productModel.checkCategory(req.body.category_id)
  
  if(check_list[0].count != 0)
  {
    req.session.err="Can not delete this category because there are some product belonging this category"
    return res.redirect('/admin/categories');
  }
  req.session.success="Delete category successfully !"
 await categoryModel.del(req.body.category_id);

 res.redirect('/admin/categories');
})

router.post('/update', async function (req, res) {
  
  const name = req.body.category_name
  const check= await categoryModel.available(name)

  if(check.length !== 0)
  {
    req.session.err="Update category information fail because this name is available !"
   return res.redirect('/admin/categories');
  }

  await categoryModel.patch(req.body);
  req.session.success="Update category information successfully !"
  res.redirect('/admin/categories');
})

module.exports = router;