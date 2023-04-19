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

    update: (product, userId) => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            const query = 'UPDATE products ' + 
            'SET title = COALESCE(?, title),' + 
            'description = COALESCE(?, description),' +
            'image = COALESCE(?, image),' +
            'price = COALESCE(?, price) ' +
            'WHERE id=? AND seller=?;'
            connection.query(query, [product.title, product.description, product.image, product.price, product.id, userId], (err, result) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(Object.values(JSON.parse(JSON.stringify(result))));
            })
        })  
    }),

    deleteById: (productId, userId) => new Promise((resolve, reject) => {
        const deleteQuery = 'DELETE FROM products WHERE id=? AND seller=?;';
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
            })
        })
    }),



}

module.exports = products;