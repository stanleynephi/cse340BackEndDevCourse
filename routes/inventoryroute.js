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
router.get('/management',utilities.checkEmployeeOrAdmin, utilities.errorHandling(inventoryController.buildmanagementView))


/**route to add new classification page */
router.get('/management/addclassification', utilities.checkEmployeeOrAdmin,utilities.errorHandling(inventoryController.buildaddtoclassification))
router.post('/management/addclassification', 
    validation.validateClassification(),
    validation.validateClassificationResult,
    utilities.errorHandling(inventoryController.registerclassification)
)


/**route to the addinventory */
router.get('/management/addinventory', utilities.checkEmployeeOrAdmin ,utilities.errorHandling(inventoryController.addinventory))
router.post('/management/addinventory',
    validation.validateInventory(),
    validation.validateInventoryResult,
    utilities.errorHandling(inventoryController.registerInventory)
)


//inventory route to find the inventory based of the classification id
router.get(
    '/getInventory/:classification_id',
    utilities.errorHandling(inventoryController.getInventoryJSON)
)


//route to the edit section of the web application
router.get(
    '/management/updateinventory/:classification_id',
    utilities.checkEmployeeOrAdmin ,
    utilities.errorHandling(inventoryController.editinventoryinformations)
)
//post routing for the form submission
router.post(
    '/management/updateinventory',
    validation.validateUpdateInventory(),
    validation.validateInventoryUpdateResult,
    utilities.errorHandling(inventoryController.updateInventory)
)


//delete route
router.get('/management/delete/:classification_id',
    utilities.checkEmployeeOrAdmin ,
    utilities.errorHandling(inventoryController.deleteInventoryView)
)

//delete post
router.post('/management/delete',
    utilities.errorHandling(inventoryController.deleteinventory)
)


/**export the router */
module.exports = router;
