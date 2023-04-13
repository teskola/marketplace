const pool = require('../db/pool');

const products = {
    findAll: () => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }

            connection.query('SELECT * FROM products', (err, result) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            })

        })
    }),
    findProductById: (id) => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query('SELECT * FROM products WHERE id=?', id, (err, result) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            })
        })
    }),

    findProductByUser: (id) => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query('SELECT * FROM products WHERE seller=?', id, (err, result) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            })
        })
    }),

    create: (product) => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            const query = connection.query('INSERT INTO products SET ?;', product, (err, result) => {
                connection.release();
                if (err) {
                    reject(err);
                    
                } else {
                    resolve(result);
                }
            });
        });
    }),

    deleteById: (id) => new Promise((resolve, reject) => {
        const deleteQuery = 'DELETE FROM products WHERE id=?;';
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(deleteQuery, id, (err, result) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            })
        })
    }),



}

module.exports = products;