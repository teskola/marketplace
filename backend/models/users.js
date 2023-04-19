const pool = require('../db/pool');

const users = {
  create: (user) => new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        return reject(err);
      }

      connection.query('INSERT INTO users SET ?;', user, (err, result) => {
        connection.release();
        if(err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }),
  findByEmail: (email) => new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        return reject(err);
      }
      connection.query("SELECT id, password, name, email, phone, convert_tz(created, @@session.time_zone, '+00:00') AS created FROM users WHERE email LIKE ?;", email, (err, result) => {
        connection.release();
        if(err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }),
  findById: (id) => new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query("SELECT id, name, email, phone, convert_tz(created, @@session.time_zone, '+00:00') AS created FROM users WHERE id=?", id, (err, result) => {
        connection.release();
        if (err) {
          return reject(err);
        }
        resolve(result);
      })
    })
  })
};

module.exports = users;
