"use strict";

let classificationList = document.querySelector(".classificationList");

classificationList.addEventListener("change", async function () {
    let classification_id = classificationList.value;
    console.log(classification_id);

    let classificationIdURL = "/inv/getInventory/" + classification_id

    //fetch data
   fetch(classificationIdURL) 

   //create json file
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 

  //convert json into data
  .then(function (data) { 
   console.log(data); 
   buildInventoryList(data); 
  }) 

  //handles errors
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 

});


function buildInventoryList(data) {
    let displayTable = document.querySelector("#inventoryDisplayTable");

    if (!data || data.length === 0) {
        displayTable.innerHTML = "<p>No inventory items found for this classification.</p>";
        return;
    }

    let dataTable = "<thead>";
    dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
    dataTable += "</thead>";
    dataTable += "<tbody>";

    data.forEach(element => {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/management/updateinventory/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/management/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    });

    dataTable += "</tbody>";
    displayTable.innerHTML = dataTable;
}

