/**this it to handle the routing for the inventory page
 * express
 * express router
 * inventory controller
 */

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventorycontroller');

/**route to get the inventory by classification */
router.get('/type/:classificationId', inventoryController.buildInventoryByClassification)

/**export the router */
module.exports = router;
