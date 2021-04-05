var db = require('../utils/db');
const TBL_CATEGORIES = 'users';
module.exports = {
  all: () => {
    return db.load('select * from users');
  },

  single: id => {
    return db.load(`select * from users where user_id = ${id}`);
  },

  singleByUserName: name => {
    return db.load(`select * from users where username = '${name}'`);
  },

  add: entity => {
    return db.add('users', entity);
  },

  update: entity => {
    return db.update('users', 'user_id', entity);
  },

  del: function (id) {
    
    const condition = {
      user_id: id
    }
   
    return db.del(TBL_CATEGORIES, condition);
  },
  patch: function (entity) {
    const condition = {
      user_id: entity.user_id
    }

    delete entity.user_id;
    return db.patch(TBL_CATEGORIES, entity, condition);
  }
};
