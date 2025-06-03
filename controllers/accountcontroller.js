/**create the controller to handle the the view rendering for the account 
 * use the utilities to handle the error handling and the flash messages
 * and also other utilities that are needed for the account controller
 * add the model to handle the registration page sign up
*/

const utilities = require('../utilities/')
const model = require('../models/accountmodel.js')
const accountController = {}

/**function to render the login page */
accountController.renderLoginPage = async function (req,res) {
  /**building the dynamic navigation from the utility section */
  const nav = await utilities.getNavigations()
  /**building the forms from the utility section */
  const form = await utilities.loginforms()
  /**flash message rendering */
  req.flash('notice', 'Please login to continue.')
  res.render('account/login', {
    title: 'Login',
    nav,
    form,
    error: null,
    success: req.flash('success')
  })
    
}

accountController.renderRegistrationPage = async function (req,res) {
    /**building the dynamic navigation from the utility section */
    const nav = await utilities.getNavigations()
    /**building the forms from the utility section */
    const form = await utilities.registrationforms()
    /**flash message rendering */
    req.flash('notice', 'Please register to continue.')
    res.render('account/registration', {
        title: 'Register',
        nav,
        form,
        error: null,
        success: req.flash('success')
    })
}

/**function to handle the registration process of the user */
accountController.registerAccount = async function (req,res) {
  let nav = utilities.getNavigations()
  const { first_name, last_name, account_email, account_password } = req.body
  try {
    /**call the model to register the account */
    const result = await model.registerAccount(first_name, last_name, account_email, account_password)
    /**if the result is successful then redirect to the login page */
    if (result) {
      req.flash('success', 'Account created successfully. Please login.')
      res.status(201).redirect('/account/login'
      )
    } else {
      req.flash('error', 'Error creating account. Please try again.')
      res.status(501).redirect('/account/registration'
      )
    }
  } catch (error) {
    console.error("Error in registration:", error)
    req.flash('error', 'An error occurred while creating your account. Please try again.')
    res.redirect('/account/registration')
  }
}


/**module to export the account controller objects... */
module.exports = accountController;