//contains code to connect to the databse and export the connnection.
const { Pool, Query } = require('pg');
require('dotenv').config();

/**
 * create a connection pool 
 * ssl object needed for local testing of the application
 * use conditional to check for the environment variable before using ssl.
 */

let pool

/**conditional statement to determing the environment */
if (process.env.NODE_ENV === 'development'){
    /**create a connection pool with ssl */
    pool = new Pool ({
        /**determine how to connect to the database
         * add the database url to the .env file using the DATABASE_URL variable
         */
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })

    /**add a troubleshooting module to use during queries in the development*/
    module.exports = {
        /**establish a connection using the pool and ssl using an async*/
        async query(text, params) {
            /**use a try catch error to run and look out for the errors as well */
            try{
                const response = await pool.query(text,params);
                console.log('Query executed successfully:', text);
                return response;
            }
            /**catch an error if there is any */
            catch (error) {
                console.error('Error executing query:', error);
                throw error; // re-throw the error for further handling
            }
        }
    }

    
}

else {
    /**create a connection pool without ssl */
    pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    /**add a troubleshooting module to use during queries in the development */
    module.exports = pool;
}

