const express = require('express');

var bcrypt = require('bcrypt');

var passport = require('passport');

var userModel=require("../models/user.model")

var config = require('../config/default.json');
const router = express.Router();


router.get('/login',function(req,res){
  if(req.session.isAuthenticated)
  {

   res.redirect("/admin/home")
  }
  
    res.render('vwAccount/login',  {layout: false});
  
})


router.post('/login',async function(req,res){
  const user = await userModel.singleByUserName(req.body.username)
  
  if(user.length === 0)
  {
   
    return res.render('vwAccount/login',{
      layout:false,
      err:" Invalid username or password."
    })
  }
  const hash = bcrypt.hashSync(req.body.password, 10);

 const check_pass= bcrypt.compareSync(req.body.password,user[0].password)
  if(check_pass === !true)
  {
    
    return res.render('vwAccount/login',{
      layout:false,
      err:" Invalid username or password."
    })
  }
  delete user[0].password
  req.session.isAuthenticated=true;
  req.session.authUser=user[0];

  res.redirect("/admin/home")

})

router.post('/register', async (req, res, next) => {
    var hash = bcrypt.hashSync(req.body.password, config['authenticate'].saltRounds);
   

    var user = {
      username: req.body.username,
      password: hash,
      staff_name: req.body.staffname,
    }

   
  
    await userModel.add(user) 
    res.redirect('/admin/home');
  })
  
  router.post('/logout', function(req, res){
    req.session.destroy()
  
    res.redirect('/login');
  });
module.exports = router;