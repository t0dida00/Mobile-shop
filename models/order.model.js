const db = require('../utils/db');

const TBL_CATEGORIES = 'orders';

module.exports = {
  all: function () {
    return db.load(`SELECT *,
    Sum(products.product_price * order_items.quantity) AS Total
    FROM ${TBL_CATEGORIES}
    INNER JOIN payments ON orders.order_payment = payments.payment_id
    INNER JOIN order_items ON order_items.order_id = orders.order_id
    INNER JOIN products ON products.product_id = order_items.product_id
    INNER JOIN customers ON customers.customer_id = orders.customer_id
    INNER JOIN state ON state.state_id=customers.customer_state
    INNER JOIN city ON city.city_id=customers.customer_city
    INNER JOIN status ON status.status_id=orders.order_status
     GROUP  BY orders.order_id
     ORDER BY order_date DESC`);
  },
  single: function (id) {
    return db.load(`SELECT *,
    (order_items.quantity * products.product_price)  AS Total FROM order_items 
    INNER JOIN products ON products.product_id= order_items.product_id
    WHERE order_items.order_id=${id}`);
  },
  add: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  patch: function (entity) {
    const condition = {
      order_id: entity.order_id
    }

    delete entity.order_id;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  del: function (id) {
    
    const condition = {
      order_id: id
    }  
    return db.del(TBL_CATEGORIES, condition);
  },
  findByCustomerID: function(customer_id){
  
    return db.load(`
SELECT orders.*, payment_name,
Sum(products.product_price * order_items.quantity) AS Total
FROM ${TBL_CATEGORIES}
INNER JOIN payments ON orders.order_payment = payments.payment_id
INNER JOIN order_items ON order_items.order_id = orders.order_id
INNER JOIN products ON products.product_id = order_items.product_id
WHERE customer_id = ${customer_id} GROUP  BY orders.order_id `);
  },

  getValueforChart: function(){
    return db.load(`SELECT
    DISTINCT(substring(order_date,1,7)) AS DataDate,
    Sum(products.product_price * order_items.quantity) AS Total
     FROM ${TBL_CATEGORIES}
     INNER JOIN order_items ON order_items.order_id = orders.order_id
     INNER JOIN products ON products.product_id = order_items.product_id
      GROUP  BY  DataDate
     ORDER BY DataDate ASC`)
  },
  getValueforOrderChart: function(){
    return db.load(`SELECT
    (substring(order_date,1,7)) AS DataDate,
    COUNT(*) AS Value
      FROM  ${TBL_CATEGORIES}
      GROUP by DataDate`)
  }
  
};
