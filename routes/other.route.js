const express = require('express');
const otherModel = require('../models/other.model');

const router = express.Router();



router.post('/city',async function(req,res)
{
 
  const city_list = await otherModel.getCity(req.body.state_id);
  

 res.send({city_list:JSON.stringify(city_list)});
})
module.exports = router;