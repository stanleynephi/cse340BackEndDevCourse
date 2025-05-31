/*contains function to interate with the database. */
/**begin by connecting to the pool or bringing it into scope if it exists in a different file */
const pool = require('../database/index.js');

/**function to write sql code to be executed. */
async function inventoryClassifications() {
    
    /**sql query to select everything from the database using a query */
    const query = 'SELECT * FROM public.classification ORDER BY classification_name;';
    /**execute the query using the pool */
    const result = await pool.query (query);
    /**return the result of the query */
    return result
}

/**function to get the data based of the classification type provideded */
async function getInventoryByClassification(classification_id) {
    /**sql select query for the inventory table based of the classificationId 
     * use an inner join
    */
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
                JOIN public.classification AS c 
                ON i.classification_id = c.classification_id 
                WHERE i.classification_ID = $1`,
            [classification_id]
        );
        console.log("Data fetched for classification ID:", classification_id, data);
        return data; // Return the rows of the result
    } catch (error) {
        console.log("Error fetching inventory by classification:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}

async function getInventoryItemDetails(inv_id) {
    /**sql select query to select everything about a car from the inventory using the car id */
    try {
        const data = await pool.query (
            `SELECT * FROM public.inventory AS i
                WHERE i.inv_id = $1`,
            [inv_id]
        );
        console.log("Data fetched for inventory ID:", inv_id, data);
        return data; // Return the rows of the result
    }
    catch (error) {
        console.log("Error fetching inventory item details:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}

/**export the function once done */
module.exports = { inventoryClassifications, getInventoryByClassification, getInventoryItemDetails };