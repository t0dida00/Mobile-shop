const db = require('../utils/db');

const TBL_CATEGORIES = 'products';

module.exports = {
  all: function () {
    return db.load(`SELECT products.*,brands.brand_name,categories.category_name 
    FROM  ${TBL_CATEGORIES} 
    INNER JOIN brands ON products.product_brand_id = brands.brand_id 
    INNER JOIN categories on products.product_category_id = categories.category_id
    `);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_CATEGORIES}
    INNER JOIN brands ON products.product_brand_id = brands.brand_id 
    INNER JOIN categories on products.product_category_id = categories.category_id
    where product_id = ${id}`);
  },
  add: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  patch: function (entity) {
    const condition = {
      product_id: entity.product_id
    }

    delete entity.product_id;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  del: function (id) {
    
    const condition = {
      product_id: id
    }
   
    return db.del(TBL_CATEGORIES, condition);
  },
  checkBrand: function(id){
    return db.load(`select count(*) as count from products ${TBL_CATEGORIES} where product_brand_id=${id} `)
  },
  checkCategory: function(id){
    return db.load(`select count(*) as count from products ${TBL_CATEGORIES} where product_category_id=${id} `)
  }
};
