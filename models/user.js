// adapted from user management code attributed to Rafa @ GA. Thanks!
// originally using mongo, modified for psql
const psql = require('../db/db.js');
const bcrypt = require('bcryptjs');
const { createToken } = require('../lib/token');

  // creates a new user object using form input
  function createUser(req, res, next) {
    const SALTROUNDS = 10;
    console.log(req.body);
    const userObject = {
      username: req.body.username,
      // email: req.body.email,
      // Store hashed password
      // password: req.body.password
      password: bcrypt.hashSync(req.body.password, SALTROUNDS)
    };

  psql.none(`INSERT INTO users ( username, password )
    VALUES ('${userObject.username}', '${userObject.password}');`)
    .catch(error => console.log(error));
    // then gets the newly created id from the db
    psql.one(`SELECT id
      FROM users
      WHERE username = $/username/
      AND password = $/password/;`, userObject)
      .then((result) => {
        console.log(result);
        res.token = createToken(result);
        res.id = result.id;
        next();
      })
      .catch(error => next(error));
    };


function getUserById(id) {
  psql.one(`SELECT *
      FROM users
      WHERE id = '${id}';`)
    .then(user => user)
    .catch((error) => console.log(error));
}

function getUserByUsername(name) {
  psql.any(`SELECT *
    FROM users
    WHERE username = '${name}';`)
    .then(user => user)
    .catch((error) => console.log(error));
  }

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
};
