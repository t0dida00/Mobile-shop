const db = require('../utils/db');



module.exports = {
  getState: function () {
    return db.load(`select * from state`);
  },

  getCity: function(state_id){
      return db.load(`select * from city where state_id=${state_id}`);
  },
  getBrand: function(state_id){
    return db.load(`select * from brands`);
  },
  getCategory: function(state_id){
  return db.load(`select * from categories`);
  },
  getProduct: function(state_id){
    return db.load(`select * from products`);
    },
  getProductByBrand: function(brand){
    return db.load(`select * from products where product_brand_id = ${brand}`)
  },
  getProductByCategory: function(category){
    return db.load(`select * from products where product_category_id = ${category}`)
  },
  
  searchProduct: function(string){
    return db.load(`select * from products ${string}`)
  },
  getProductById: function(id){
    return db.load(`select * from products 
    INNER JOIN brands ON products.product_brand_id = brands.brand_id 
    INNER JOIN categories on products.product_category_id = categories.category_id where product_id = ${id} `)
    
  },
  getProductByCategoryRandom:function(id)
  {
    return db.load(`SELECT * FROM products  
    WHERE product_category_id= ${id}
    ORDER BY RAND ( )  
    LIMIT 10`)
  }
};
