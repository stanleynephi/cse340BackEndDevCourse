/**this file handles the form data sanitation and validations.
 * requires the index.js file from the utilities folder
 * and the express-validator package to validate the data
 * and the express-validator package to sanitize the data
 */

const utilities = require('.')
const { body, validationResult } = require('express-validator');
const validator = {}

/**this function is used to set the rules for validation form data */
validator.validationRules = () => {
    return [
       // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ];
}



/**this function checks the data and returns errors or continues registration */
validator.validateRegistration = async function (req, res, next) {
    const {account_firstname, account_lastname, account_email, account_password} = req.body;
    let  error = []

    error = validationResult(req);
    if (!error.isEmpty()) {
        let nav = await utilities.getNavigations()
        /**building the forms from the utility section */
        let form = await utilities.registrationforms()
        res.render('account/registration', {
            error,
            title: 'Register',
            nav,
            account_firstname,
            account_lastname,
            account_email,
            form
        });

        return;
    }

    next()
}

module.exports = validator;