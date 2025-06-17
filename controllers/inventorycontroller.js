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

/**build management view */
inventorycontroller.buildmanagementView = async function (req,res,next) {
    /**get the page components, the nav from the utilities and other stuff that will be needed */
    try {
        let nav = await utilities.getNavigations()
        //use the classification list to create a drop down select
        let classificationlist = await utilities.buildClassificationList()
        let error = []

        res.render('./inventory/management', {
            title: 'Management View',
            nav,
            message: 'This is the management view. Here you can manage your inventory items.',
            classificationlist,
            error
        })
        
    } catch (error) {
        console.error("Error building management view:", error);
        res.status(500).send("Internal Server Error");
        
    }
    
}



/**add to classificaiton 
 * this function renders the look for the add classification page.
 * after write another function to register what the user puts in the form
 * 
*/
inventorycontroller.buildaddtoclassification = async function (req,res,next) {
    try {
        //navigation components
        let nav = await utilities.getNavigations()
        //render the page
        res.render('./inventory/addclassification', {
            title: 'Add Classification',
            nav,
            message: 'Please add a non-exisiting classification name.',
            error: req.flash('error')
        })
    }

    catch (error) {
        console.error('Error building add classification view', error)
        res.status(500).send('Internal Server Error')
    }
}

/**register classification being entered */
inventorycontroller.registerclassification = async function (req,res,next) {
    //get the nav component
    let nav = await utilities.getNavigations()
    //get the classification name from the request body
    const {classification_name} = req.body
    console.log("Classification name received:", classification_name);

    //try catch statement. 
    /**first check the classification name with those in the database
     * if it exists, then dont register else register it
     */
    try{
        /**check if it exist */
        const exists = await inventorymodel.checkClassificationExists(classification_name)
        console.log("Classification exists:", exists);
        if(exists){
            console.log("Classification already exists, not registering.");
            req.flash('error', 'Classification already exists. Please try a different name.')
            res.render('./inventory/addclassification', {
                title: 'Add Classification',
                nav,
                message: 'Classification already exists. Please try a different name.',
                error: req.flash('error')
            })
        }
        else {
            /*register the classifications and then return to the homepage */
            const result = await inventorymodel.registerclassification(classification_name)
            console.log("Classification registered:", result);
            req.flash('success', 'Classification registered successfully.')
            res.status(201).redirect('/')
        }
    }
    catch (error) {
        console.error("Error registering classification:", error);
        req.flash('error', 'An error occurred while registering the classification. Please try again.')
        res.render('./inventory/addclassification', {
            title: 'Add Classification',
            nav,
            message: 'An error occurred while registering the classification. Please try again.',
            error: req.flash('error')
        })
    }


}




/**build the inventory classification component needed for the addinventory page */
inventorycontroller.addinventory = async function (req, res, next) {
    //navigation components
    let nav = await utilities.getNavigations()
    //get classification list from index
    let classifications = await utilities.buildClassificationList();


    //try catch statement to handle the errors that may occur
    try {
        
        //render the components together
        res.render('./inventory/addinventory', {
            title: 'Add Inventory',
            nav,
            message: 'Please fill out the form to add a new inventory item.',
            error: req.flash('error'),
            classifications
        })

    } catch (error) {
        
    }
}


/**process the registration for the items in the inventory */
inventorycontroller.registerInventory = async function (req, res, next) {
    //get the nav component
    let nav = await utilities.getNavigations()
    //get the data from the request body
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body;
    console.log("Inventory data received:", req.body);

    //try catch statement to handle the errors that may occur in the process.
    try {
        //add the inventory item to the database
        const result = await inventorymodel.registerInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
        console.log("Inventory item registered successfully:", result);
        //flash success message and redirect to the homepage
        req.flash('success', 'Inventory item registered successfully.')
        res.status(201).render('./inventory/management', {
            title: 'Management View',
            nav,
            message: 'Inventory item registered successfully.',
        });


    } catch (error) {
        console.error("Error registering inventory item:", error);
        req.flash('error', 'An error occurred while registering the inventory. Please try again.')
        res.render('./inventory/addinventory', {
            title: 'Add Inventory',
            nav,
            message: 'An error occurred while registering the inventory. Please try again.',
    })
}

}


//function to deliver the inventory JSON
inventorycontroller.getInventoryJSON = async (req,res,next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await inventorymodel.getInventoryByClassification(classification_id)
    console.log(invData.rows)
    if(invData.rows) {
        return res.json(invData.rows)
    }
    else{
        next(new Error ("No Data returned"))
    }
}


//query the database to edit the inventory in the database
inventorycontroller.editinventoryinformations = async function (req, res, next) {
    //navigation components
    let nav = await utilities.getNavigations()
    let items_id = parseInt(req.params.classification_id)
    let inventoryItems = await inventorymodel.getInventoryItemDetails(items_id)
        let classifications = await utilities.buildClassificationList(inventoryItems.rows[0].classification_id);

    const itemName = `${inventoryItems.rows[0].inv_make} ${inventoryItems.rows[0].inv_model}`
    console.log(itemName)


    //try catch statement to handle the errors that may occur
    try {
        
        //render the components together
        res.render('./inventory/updateinventory', {
            title: 'Update' + itemName + 'Details',
            nav,
            classifications,
            errors: null,
            message:'Update' + itemName + 'Details',
            inv_id: inventoryItems.rows[0].inv_id,
            inv_make: inventoryItems.rows[0].inv_make,
            inv_model: inventoryItems.rows[0].inv_model,
            inv_year: inventoryItems.rows[0].inv_year,
            inv_description: inventoryItems.rows[0].inv_description,
            inv_image: inventoryItems.rows[0].inv_image,
            inv_thumbnail: inventoryItems.rows[0].inv_thumbnail,
            inv_price: inventoryItems.rows[0].inv_price,
            inv_miles: inventoryItems.rows[0].inv_miles,
            inv_color: inventoryItems.rows[0].inv_color,
            classification_id: inventoryItems.rows[0].classification_id
        })

    } catch (error) {
        console.log(error)
    }
}



inventorycontroller.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNavigations()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await inventorymodel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/updateinventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


//delete data from the database
inventorycontroller.deleteInventoryView = async function (req, res, next) {
    let nav = utilities.getNavigations()
    let inv_id = parseInt(req.params.classification_id)
    let model = await inventorymodel.getInventoryItemDetails(inv_id)
    let data = model.rows[0]
    let classifications = await utilities.buildClassificationList(data)
    console.log(data)

    try{
        
        //render this on the delete page
        res.render(
            './inventory/deleteitem', {
            title: 'Delete',
            nav,
            classifications,
            errors: null,
            message:'Update',
            inv_id: data.inv_id,
            inv_make: data.inv_make,
            inv_model: data.inv_model,
            inv_year: data.inv_year,
            inv_description: data.inv_description,
            inv_image: data.inv_image,
            inv_thumbnail: data.inv_thumbnail,
            inv_price: data.inv_price,
            inv_miles: data.inv_miles,
            inv_color: data.inv_color,
            classification_id: data.classification_id
            }
        )
    }
    catch(error){
        console.log(error)
    }
}


//delete the item provided
inventorycontroller.deleteinventory = async function (req, res, next) {
    const {
        inv_id
    } = req.body

    const deleteItems = await inventorymodel.deleteInventory(
        inv_id
    )

    if (deleteItems) {
    req.flash("success", `The delete was successful`)
    res.redirect("/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).redirect('/')
  }
}





/**export the inventory module to be used */
module.exports = inventorycontroller