/**this route controls the routing for the login page and the registration page using express router method
 * and the registration and login controller functions and the error handler in the utilities section
 */

const express = require('express')
const router = express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountcontroller')
const registrationValidation = require('../utilities/account-validation')


/**create the routing */
router.get('/login',utilities.errorHandling(accountController.renderLoginPage))
router.get('/register', utilities.errorHandling(accountController.renderRegistrationPage))


/**add a router post to handle the login data sent */
router.post('/login',
    // (req,res) => {
    //     res.status(200).send('Login Process')
    // }
    registrationValidation.loginValidationRules(),
    registrationValidation.validateLogin,
    utilities.errorHandling(accountController.loginAccount)
)

/**add a router post to handle the data sent from the registration forms */
router.post('/register',
    registrationValidation.validationRules(),
    registrationValidation.validateRegistration, 
    utilities.errorHandling(accountController.registerAccount))



//account routing after verification
router.get('/',
    //verify if user has access to this page using the function in the utility file
    utilities.checkLogin,
    utilities.errorHandling(accountController.managementView)
)


//router to edit account details
router.get('/updateprofile',
    utilities.checkLogin,
    utilities.errorHandling(accountController.updateProfile)
)
/**export the router */
module.exports = router