let express = require('express');
let router = express.Router();

/**
 * This router handles all the endpoints for communication between FE & BE.
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.writeHead(301, {Location: 'http://localhost:5173'}).end();
});

module.exports = router;
