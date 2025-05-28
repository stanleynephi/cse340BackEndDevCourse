/**logic to put together the components for the page once the 
 * request is made to the server
 */

const utilities = require('../utilities/')
const inventorymodel = require('../models/inventory-model')
const inventorycontroller = {} /**inventorycontroller object */

/**function to get the inventory based on the classification */
inventorycontroller.buildInventoryByClassification = async function (req, res, next) {
    try {
        /**get the classification based of the parameter given after the request made */
        const classification_Id = req.params.classificationId;
        console.log("Classification ID received:", classification_Id);
        /**get the inventory based on the classification id */
        const inventory = await inventorymodel.getInventoryByClassification(classification_Id);
        
        console.log("Inventory fetched for classification ID:", classification_Id, inventory);
        /**get the navigations created */
        let nav = await utilities.getNavigations()
        /**get classification name */
        const classificationName = inventory.rows[0].classification_name
        /**get the grid component */
        const grid = await utilities.buildgridDisplay(inventory)
        /**responds */
        res.render('./inventory/classification', {
            title: 'Inventory of ' + classificationName,
            nav,
            grid,
        });
    } catch (error) {
        console.error("Error fetching inventory by classification:", error);
        res.status(500).send("Internal Server Error");
        
    }
}

/**export the inventory module to be used */
module.exports = inventorycontroller