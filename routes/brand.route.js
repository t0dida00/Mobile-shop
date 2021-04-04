const express = require('express');
const brandModel = require('../models/brand.model');
const productModel = require('../models/product.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await brandModel.all();
 
  res.render('vwBrands/list', {
    brand: list,
    empty: list.length === 0,
    err:req.session.err,
    success:req.session.success
  });
  delete req.session.err
  delete req.session.success
})
router.get('/add', function (req, res) {
  res.render('vwBrands/add');
})

router.post('/add', async function (req, res) {

  await brandModel.add(req.body);
  req.session.success="Add new brand successfully !"
  res.redirect('/admin/brands');
})

router.get('/edit/:id', async function (req, res) {
  // const id = +req.query.id || -1;
  const id = +req.params.id || -1;
  const rows = await brandModel.single(id);
  if (rows.length === 0)
    return res.send('Invalid parameter.');
  
  const brand = rows[0];
  res.render('vwBrands/edit', { brand });
})

router.post('/del', async function (req, res) {
  const check_list=await productModel.checkBrand(req.body.brand_id)
 

  if(check_list[0].count != 0)
  {
     req.session.err="Can not delete this brand because there are some product belonging this brand"
    return res.redirect('/admin/brands');
  }
  req.session.success="Delete brand successfully !"
  await brandModel.del(req.body.brand_id);
  res.redirect('/admin/brands');
})

router.post('/update', async function (req, res) {

  await brandModel.patch(req.body);
  req.session.success="Update brand information successfully !"
  res.redirect('/admin/brands');
})

module.exports = router;