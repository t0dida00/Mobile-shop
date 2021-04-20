const db = require('../utils/db');

const TBL_CATEGORIES = 'customers';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}  
    INNER JOIN state ON state.state_id=customer_state
    INNER JOIN city ON city.city_id=customer_city`);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_CATEGORIES}   
    INNER JOIN state ON state.state_id=customer_state
    INNER JOIN city ON city.city_id=customer_city where customer_id = ${id} `);
  },
  getCustomerByPhoneOrEmail: function (phone,email) {
    return db.load(`select * from ${TBL_CATEGORIES}   
    where customer_phone LIKE '${phone}' or customer_mail LIKE '${email}' `);
  },
  add: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  patch: function (entity) {
    const condition = {
      customer_id: entity.customer_id
    }
    
    delete entity.customer_id;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  del: function (id) {
    
    const condition = {
      customer_id: id
    }  
    return db.del(TBL_CATEGORIES, condition);
  },
  available: function(name)
  {
    
    return db.load(`select * from ${TBL_CATEGORIES} where customer_id_name = "${name}"`);
  },
  countCustomer: function()
  {
    return db.load(`select  count( DISTINCT customer_phone ) as Total_customer from ${TBL_CATEGORIES} `);
  }
  
};
