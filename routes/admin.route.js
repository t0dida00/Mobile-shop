const express = require('express');
var userModel=require("../models/user.model")
var bcrypt = require('bcrypt');

var passport = require('passport');

var config = require('../config/default.json');
const router = express.Router();

router.get('/', async function (req, res) {
    if(!req.session.admin)
    {
        return res.render('404', { layout: false });
    }
    const list = await userModel.all();
   
   for(let i =0 ; i< list.length;i++)
   {
       delete list[i].password;
       if(list[i].username === "admin")
       {
           delete list[i]
       }
   }

  

   
    res.render('vwAccount/list', {
      accounts: list,
      empty: list.length === 0,
      err:req.session.err,
      success:req.session.success
    });
   
    delete req.session.err
    delete req.session.success
   
  })
  
  router.post('/register', async (req, res, next) => {
    var hash = bcrypt.hashSync(req.body.password, config['authenticate'].saltRounds);
   
    const username = req.body.username
    const check= await userModel.singleByUserName(username)
  
    if(check.length !== 0)
    {
      req.session.err="Username is availabel !"
     return res.redirect('/admin/accounts');
    }

    var user = {
      username: req.body.username,
      password: hash,
      staff_name: req.body.staff_name,
      phone:req.body.phone,
      email:req.body.email
    }

   
  
    await userModel.add(user) 
    req.session.success="Create new user successfully !"
    res.redirect('/admin/accounts');
  })

  router.get('/edit/:id', async function (req, res) {
    // const id = +req.query.id || -1;
    const id = +req.params.id || -1;
    const rows = await userModel.single(id);
    if (rows.length === 0)
      return res.send('Invalid parameter.');
    
    const account = rows[0];
    res.render('vwAccount/edit', { account });
  })

  router.post('/update', async function (req, res) {
    const username = req.body.username
    const check= await userModel.singleByUserName(username)
  
    if(check.length !== 0)
    {
      req.session.err="Username is availabel !"
     return res.redirect('/admin/accounts');
    }
    await userModel.patch(req.body);
    req.session.success="Update user information successfully !"
    res.redirect('/admin/accounts');
  })

  router.get('/add', function (req, res) {
    res.render('vwAccount/add');
  })
  

  router.post('/del', async function (req, res) {
  
   
    await userModel.del(req.body.user_id);
    req.session.success="Delete account successfully !"
    res.redirect('/admin/accounts');
  })
  
module.exports = router;