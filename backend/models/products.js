const pool = require("../db/pool");

const selectProducts =
  "SELECT products.id, products.title, products.image, products.description, products.price, products.seller, convert_tz(products.created, @@session.time_zone, '+00:00') AS created, convert_tz(products.updated, @@session.time_zone, '+00:00') AS updated FROM products;";

const products = {
  findAll: () =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(selectProducts, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }),
  search: (text, min, max) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          selectProducts.slice(0, -1) +
            " LEFT JOIN users ON products.seller = users.id " +
            "WHERE (concat(title, description, name) LIKE concat('%', ?, '%')) AND price BETWEEN (COALESCE(?, (SELECT MIN(price)))) AND (COALESCE (?, (SELECT MAX(price))))",
          [text, min, max],
          (err, result) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });
    }),
  findProductById: (id) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          selectProducts.slice(0, -1) + " WHERE id=?",
          id,
          (err, result) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });
    }),

  findProductByUser: (id) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          selectProducts.slice(0, -1) + " WHERE seller=?",
          id,
          (err, result) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });
    }),

  getPriceRange: () =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          "SELECT min(price) AS min, max(price) AS max FROM products;",
          (err, result) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });
    }),

  create: (product) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        const query = connection.query(
          "INSERT INTO products SET ?;",
          product,
          (err, result) => {
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
    }),

  update: (product, userId) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        const query =
          "UPDATE products " +
          "SET title = COALESCE(?, title)," +
          "description = COALESCE(?, description)," +
          "image = COALESCE(?, image)," +
          "price = COALESCE(?, price) " +
          "WHERE id=? AND seller=?;";
        connection.query(
          query,
          [
            product.title,
            product.description,
            product.image,
            product.price,
            product.id,
            userId,
          ],
          (err, result) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            resolve(Object.values(JSON.parse(JSON.stringify(result))));
          }
        );
      });
    }),

  deleteById: (productId, userId) =>
    new Promise((resolve, reject) => {
      const deleteQuery = "DELETE FROM products WHERE id=? AND seller=?;";
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(deleteQuery, [productId, userId], (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }),
};

module.exports = products;
