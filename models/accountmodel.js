/**this model file is used to process the registration forms by the user 
 * establish a connection to the database using the pool
*/
const pool = require('../database/index.js')

/**async function to process the registration */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
            /**sql query to insert the data into the database */
            const query = `INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
                   VALUES ($1, $2, $3, $4) RETURNING *;`;
            /**execute the query using the pool */
            const result = await pool.query(query, [account_firstname, account_lastname, account_email, account_password]);
            /**return the result of the query */
            return result.rows[0];
    
    } catch (error) {
        console.error("Error registering account:", error);
        throw error; // Re-throw the error to be handled by the calling function
        return error.message
        
    }
}

/**export the module function registerAccount */
module.exports = { registerAccount };
/**this model file is used to process the registration forms by the user 
 * establish a connection to the database using the pool
*/