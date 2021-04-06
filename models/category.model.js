const db = require('../utils/db');

const TBL_CATEGORIES = 'categories';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_CATEGORIES} where category_id = ${id}`);
  },
  add: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  patch: function (entity) {
    const condition = {
      category_id: entity.category_id
    }

    delete entity.category_id;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  del: function (id) {
    
    const condition = {
      category_id: id
    }  
    return db.del(TBL_CATEGORIES, condition);
  },
  available: function(name)
  {
    
    return db.load(`select * from ${TBL_CATEGORIES} where category_name = "${name}"`);
  }
  
};
