var db = require('../utils/db');

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

  delete: id => {
    return db.delete('users', 'user_id', id);
  },
};
