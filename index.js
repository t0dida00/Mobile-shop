const express = require('express');
const exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
const session=require("express-session")
const cors = require('cors');



const app = express();


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
 
}))


app.use(require('flash')());

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.engine('hbs', exphbs({
  layoutsDir: 'views/_layouts',
  defaultLayout: 'main',
  partialsDir: 'views/_partials',
  extname: '.hbs',
  helpers:{
    section:hbs_sections()
  }
}));
app.set('view engine', 'hbs');
app.use('/public', express.static('./public'))

const otherModel = require('./models/other.model');
app.use(async function(req,res,next){
 
  const category_list=await otherModel.getCategory();
  const brand_list=await otherModel.getBrand();
  res.locals.lcBrands=brand_list;
  res.locals.lcCategories=category_list;

  next();
  
})

app.use('/', require('./routes/client.route'));

app.use('/admin', require('./routes/account.route'));

app.use('/admin/other', require('./routes/other.route'));

app.use('/admin/orders', require('./routes/order.route'));

app.use(function(req,res,next){
 
  res.locals.user= req.session.authUser;
  res.locals.admin=req.session.admin;

  next();
  
})


app.use(function(req,res,next){
  
  if(!req.session.isAuthenticated)
  {

    return res.render("vwAccount/login",  {layout: false})
  }
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
})
app.use(cors());

app.get('/admin/home', function (req, res) {
  
  res.render('home');
})



app.get('/about', function (req, res) {
  res.render('about');
})

app.get('/bs', function (req, res) {
  res.sendFile(__dirname + '/bs.html');
})

// app.use(express.static('public'));

app.use('/admin/categories', require('./routes/category.route'));
app.use('/admin/products', require('./routes/product.route'));
// app.use('/admin/orders', require('./routes/order.route'));
app.use('/admin/customers', require('./routes/customer.route'));
app.use('/admin/brands', require('./routes/brand.route'));
app.use('/admin/accounts', require('./routes/admin.route'));




app.use(function (req, res) {
  res.render('404', { layout: false });
})









const PORT = process.env.PORT || 3000

app.listen( PORT, function () {
  console.log(`Server running at port `+PORT);
})
