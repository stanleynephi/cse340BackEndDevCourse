/**this it the utility folder that contains reusable code that could
 * be used by other parts of the application.
 */
/**bring the inventory-model file into scope and create an object for the utility */
const inventoryModel = require('../models/inventory-model');
const utilities = {};

/**getNavigation function to be used across all part of the web application. */
utilities.getNavigations = async function (req,res,next) {
    let data = await inventoryModel.inventoryClassifications();
    /**console.log data to get the data returned from the query / get data result */
    console.log(data)

    /**create an unordered list for the navigations elements to be used */
    let list = '<ul class="nav-list">'
    list += '<li class="nav-item"><a href="/">Home</a></li>'

    /**loop through the data and create a list item for each classification */
    data.rows.forEach((row) => {
    list += '<li class="nav-item">'
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
    });
    list += '</ul>';

    /**return the list for the navigations. */
    return list;
}

/**grid display for the classification. */
utilities.buildgridDisplay = async function (data){

  let grid
  /**conditional statement for validation */
  if (!data || !data.rows || data.rows.length === 0) {
    return '<p>No items found.</p>';
  }
  else{
    grid = '<ul class=""grid-display">'
    data.rows.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
      + '"title ="View' + vehicle.inv_make + ' ' + vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  }

  return grid
}

/**function for structing the detail view for the website.*/
utilities.buildcarDetailDisplay = async function (data) {
  let car = data.rows[0]
  let details
  /**conditional statement for validation */
  if (!car) {
    return '<p>No car details found.</p>';
  }
  else{
    details = `<div class= "car-details">
      <div class="car-image-container">
        <img src="${car.inv_image}" alt="Image of ${car.inv_make} ${car.inv_model}" />
      </div>
      <div class="car-info">
        <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(car.inv_price)}</p>
        <p><strong>Description:</strong> ${car.inv_description}</p>
        <p><strong>Color:</strong> ${car.inv_color}</p>
        <p><strong>Year:</strong> ${car.inv_year}</p>
      </div>
    </div>
    `
  }

  return details;

}


/**robust error handler for the web application */
utilities.errorHandling = fn => (req,res,next) => Promise.resolve(fn
  (req,res,next)).catch(next)

/**export the module. */
module.exports = utilities

