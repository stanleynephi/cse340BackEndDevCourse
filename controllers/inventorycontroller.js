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

/**build the inventory detail page */
inventorycontroller.buildInventoryItemDetail = async function (req, res, next) {
    /**try catch statement to get the parameter for the search and also the needed model functions */
    try {
        /**get the inv_id paramter given when the request is made */
        const inventory_id = req.params.inv_id
        console.log("Inventory ID received:", inventory_id);
        /**get the inventory item detail based on the inv_id */
        const inventory = await inventorymodel.getInventoryItemDetails(inventory_id);
        console.log("Inventory item detail fetched for ID:", inventory_id, inventory);

        /**get the classname */
        const classificationName = inventory.rows[0].inv_make + ' ' + inventory.rows[0].inv_model;
        /**get the navigations created */
        let nav = await utilities.getNavigations()
        /**get the car details display */
        const carDetails = await utilities.buildcarDetailDisplay(inventory);
        console.log("Car details display created:", carDetails);

        /**render response */
        res.render('./inventory/details', {
            title: classificationName,
            nav,
            carDetails,
        })
        
    } catch (error) {
        console.error("Error fetching inventory item detail:", error);
        res.status(500).send("Internal Server Error");
        
    }
}

/**export the inventory module to be used */
module.exports = inventorycontroller