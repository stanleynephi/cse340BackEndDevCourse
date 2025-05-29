/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expresslayout = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/basecontroller")
const inventoryRoute = require("./routes/inventoryroute")
const utilities = require("./utilities/")



/******************
 * View Engine and Template
 */
app.set("view engine", "ejs")
app.use(expresslayout)
app.set("layout", "layouts/layout")



/* ***********************
 * Routes is to help the application find all the static files needed for the application
 * The static files are in the public folder and subfolders and is imported into the server.js file using the static variable.
 *************************/
app.use(static)

/**route to the index page of the application 
 * app.get is used to get the request from the client and then send the response back by rendering the index.ejs file.
*/

/**controller route to the homepage with an error handler*/
app.get('/',utilities.errorHandling(baseController.renderHomePage))
/**route to the inventory page */
app.use('/inv', inventoryRoute)
/**route for a 404 error */
app.use(async (req,res,next) => {
  next({
    status: 404,
    message: `Page not found at ${req.originalUrl}`})
})

/**error handler using async method */
app.use(async(error,req,res,next) => {
  /**style the error view using navigation and error message with
   * a title for the error page.
   */
  let nav = await utilities.getNavigations()
  /**console log the error message first to test to see if it does work indeed */
  console.log(`error found at "${req.originalUrl}" : ${error.message}`)

  /**conditional statement for the error found */
  if(error.status === 404){ errorMessage = error.message} else {
    errorMessage = "An unexpected error occurred. Please try again later."
  }
  /**render the error page with the title and navigation */
  res.render('./error/error', {
    title: "Error",
    nav,
    errorMessage
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
