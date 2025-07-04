/**create the controller to handle the the view rendering for the account 
 * use the utilities to handle the error handling and the flash messages
 * and also other utilities that are needed for the account controller
 * add the model to handle the registration page sign up
*/

const utilities = require('../utilities/')
const model = require('../models/accountmodel.js')
/**this is the bcryptsjs for hashing the password for the node application */
const bcrypt = require('bcryptjs')
//require the jsonwebtoken to use for the login
const jwt = require('jsonwebtoken')
require('dotenv').config()
/**create the account controller object */
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

/**function to handle the registration process of the user with the password being hashed as well.
 * we use the bcryptjs to hash the password before storing it in the database
 * this is to ensure that our database is secure and our users' passwords are not stored in plain text.
 * we also use the try catch to handle the errors and output it in the teminal as needed.
 */
accountController.registerAccount = async function (req,res) {
  let nav = utilities.getNavigations()
  const { first_name, last_name, account_email, account_password } = req.body
  /**hash the account password before storing it in the database */
  let hashpassword
  /**try catch to handle the errors and output it in the teminal as needed */
  try {
    /**regular password */
    hashpassword = await bcrypt.hashSync(account_password, 10)
    /**console log the hashed password. */
    console.log("Hashed Password:", hashpassword)

  } 
  catch (error) {
    console.error("Error hashing password:", error)
    req.flash('error', 'An error occurred while processing your request. Please try again.')
    /**redirect to a diffrent page as needed */
    res.status(501).redirect('/account/reggistration', {
      title: 'Registration Error',
      nav,
      error: null,
      success: req.flash('success')
    })
    
  }
  try {
    /**call the model to register the account */
    const result = await model.registerAccount(first_name, last_name, account_email, hashpassword)
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


/**function to handle the account login process. */
accountController.loginAccount = async function(req,res) {
  let nav = await utilities.getNavigations()
  const { account_email, account_password } = req.body

  /**check if the email exists in the database */
  const existingEmail = await model.getAccountbyEmail(account_email)
  console.log(existingEmail)
  
    if (existingEmail === 0) {
      req.flash('error', 'Email does not exist. Please register or use a different email.')
      return res.status(401).redirect('/account/login')
    }

  try {
    /**password verification and proccess */
    if(await bcrypt.compare(account_password, existingEmail.account_password)) {
      delete existingEmail.account_password
      /**creating the jwt token and for the proccessing */
      const accessToken = jwt.sign(existingEmail, process.env.accessToken, { expiresIn: 3600 * 1000})

      if(process.env.NODE_ENV === "development"){
        res.cookie ('jwt', accessToken, {httpOnly: true, maxAge: 3600 * 1000})
      }
      else {
        res.cookie ('jwt', accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
      }

      return res.redirect ('/account/')
    }
    else{
      req.flash ('message notice', 'please check your credentials and try again')
      return res.status (401).redirect ('/account/login')
    }

    } 
  
  catch (error) {
    console.error("Error in login:", error)
    req.flash('error', 'An error occurred while logging in. Please try again.')
    res.redirect('/account/login')
    throw new Error('Error in login')
  }
}

//process the request for the managment view and render it
accountController.managementView = async function (req,res){
  let nav = await utilities.getNavigations()

  //put it in the view.
  req.flash('notice', 'You are logged-in Successfully.')
  res.render('account/management', {
    title: 'Account Management',
    nav,
    error: null,
  })
}



//update profiles views and functions
accountController.updateProfie = async function(req,res,next) {
  //needed components
  let nav = await utilities.getNavigations()
  let account_id = parseInt(req.params.account_id)
  let account = await model.getAccountById (account_id)

  try {
    res.render(
      './account/updateaccount', {
        title: 'Update Account',
        nav,
        account
      }
    )
  } catch (error) {
    
  }
}


/**module to export the account controller objects... */
module.exports = accountController;