/**this it to handle the routing for the inventory page
 * express
 * express router
 * inventory controller
 */

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventorycontroller');
const utilities = require('../utilities/');

/**route to get the inventory by classification */
router.get('/type/:classificationId', utilities.errorHandling(inventoryController.buildInventoryByClassification))
/**router to get the detail by the inv_id */
router.get('/detail/:inv_id', utilities.errorHandling(inventoryController.buildInventoryItemDetail))
/**route to get the inventory classifications */

/**export the router */
module.exports = router;
