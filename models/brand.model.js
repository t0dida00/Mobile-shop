const db = require('../utils/db');

const TBL_CATEGORIES = 'brands';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_CATEGORIES} where brand_id = ${id}`);
  },
  add: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  patch: function (entity) {
    const condition = {
      brand_id: entity.brand_id
    }

    delete entity.brand_id;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  del: function (id) {
    
    const condition = {
      brand_id: id
    }
   
    return db.del(TBL_CATEGORIES, condition);
  }
};
