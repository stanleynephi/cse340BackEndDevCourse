/**this it to handle the routing for the inventory page
 * express
 * express router
 * inventory controller
 */

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventorycontroller');
const utilities = require('../utilities/');
const validation = require('../utilities/classification-validation')
/**route to get the inventory by classification */
router.get('/type/:classificationId', utilities.errorHandling(inventoryController.buildInventoryByClassification))
/**router to get the detail by the inv_id */
router.get('/detail/:inv_id', utilities.errorHandling(inventoryController.buildInventoryItemDetail))


/**route to handle management view. */
router.get('/management', utilities.errorHandling(inventoryController.buildmanagementView))


/**route to add new classification page */
router.get('/management/addclassification', utilities.errorHandling(inventoryController.buildaddtoclassification))
router.post('/management/addclassification', 
    validation.validateClassification(),
    validation.validateClassificationResult,
    utilities.errorHandling(inventoryController.registerclassification)
)


/**route to the addinventory */
router.get('/management/addinventory', utilities.errorHandling(inventoryController.addinventory))
router.post('/management/addinventory',
    validation.validateInventory(),
    validation.validateInventoryResult,
    utilities.errorHandling(inventoryController.registerInventory)
)


/**export the router */
module.exports = router;
