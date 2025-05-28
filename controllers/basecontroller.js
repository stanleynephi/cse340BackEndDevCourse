// controls all the logic needed to complete the request for the base components of the website
/**logic to run the page*/

const utilities = require('../utilities/');
const baseController = {};

/**function to render the home page base on the query */
baseController.renderHomePage = async function (req, res) {
    /**building the dynamic navigation from the utility section */
    const nav = await utilities.getNavigations()
    res.render('index', {
        title: 'Home',
        nav,
    })
}

/**export the controller module so it could be used by other aspects of the code */
module.exports = baseController;

/**alter the route to use the baseControler as a route to build dynamic homepage */