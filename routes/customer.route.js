const express = require('express');
const customerModel = require('../models/customer.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const list = await customerModel.all();
  res.render('vwCustomers/list', {
    customers: list,
    empty: list.length === 0,
    err:req.session.err,
    success: req.session.success
    
  });
 
  delete req.session.err
  delete req.session.success
})
router.get('/edit/:id', async function (req, res) {
    // const id = +req.query.id || -1;
    const id = +req.params.id || -1;
  
    const rows = await customerModel.single(id);
    if (rows.length === 0)
      return res.send('Invalid parameter.');
  
    const customer = rows[0];
    res.render('vwCustomers/edit', { customer });
  })

  router.post('/update', async function (req, res) {
    
    await customerModel.patch(req.body);
    req.session.success="Update customer information successfully !"
    res.redirect('/admin/customers');
  })
  
module.exports = router;