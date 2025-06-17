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

        
    }
}


/**fucntion to check for the email and find out if it exists already in the database */
async function chceckExisitingEmail(account_email) {
    try {
        /**sql query to check if the email exists in the database */
        const query = `SELECT * FROM public.account WHERE account_email = $1;`;
        /**execute the query using the pool */
        const email = await pool.query(query, [account_email]);
        /**return the result of the query */
        return email.rowCount
    } catch (error) {
        console.error("Error checking existing email:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
    
}


//get the account details based of the email the user entered
async function getAccountbyEmail(account_email) {
    try {
        /**sql query to check if the email exists in the database */
        const query = `SELECT account_id, account_firstname, account_lastname, account_email, account_password, account_type FROM public.account WHERE account_email = $1;`;
        /**execute the query using the pool */
        const email = await pool.query(query, [account_email]);
        /**return the result of the query */
        console.log(email.rows[0])
        return email.rows[0]
    } catch (error) {
        console.error("Error checking existing email:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
    
}

/**export the module function registerAccount */
module.exports = { registerAccount, chceckExisitingEmail, getAccountbyEmail };
/**this model file is used to process the registration forms by the user 
 * establish a connection to the database using the pool
*/