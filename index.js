import { v4 as uuidv4 } from 'uuid';

const fundElement = document.getElementById("funds");
const response = document.getElementById("response");
const reset = document.getElementById("reset");
const alertItems = document.getElementById("alert-items");

// Button Elements
const submit = document.getElementById("submit");
const add = document.getElementById("add");

// window.localStorage.clear();

// load array of items from localStorage or if empty then an empty array
let itemArr = JSON.parse(window.localStorage.getItem("itemArr")) || [] ;

// Check if value for funds have been stored
fundElement.value = window.localStorage.getItem("funds") || 0;

// Tests whether or not the value passed in is a int or float
const checkIntOrFloat = (num) => {
    return Number.isInteger(Math.round(num));
}

// Function that loads array of items and populates table field
const loadItemArr = () => {
    const itemTableBody = document.getElementById("itemTable-body");
    let tally = 0;
    
    //Iterate throught itemArr and create corresponding html elements
    itemArr.forEach(item => {
       const { name, price, id } = item;
       const fixedPrice = parseFloat(price).toFixed(2);
       
       // Create the table rows and cells
       let rowNode = document.createElement("tr");
       let nameNode = document.createElement("td");
       let priceNode = document.createElement("td");
       
       // Place the name and price values from item into their cells
       nameNode.appendChild(document.createTextNode(name));
       priceNode.appendChild(document.createTextNode(fixedPrice));
       
       // Add corresponding class name onto 
       nameNode.classList.add("itemName");
       priceNode.classList.add("itemPrice");
       
       // Add cells to newly created row and then add to table body
       rowNode.appendChild(nameNode);
       rowNode.appendChild(priceNode);
       document.getElementById("itemTable-body").appendChild(rowNode);
       
       // Add item cost to tally
       tally += parseFloat(price);
    });
    
    //create a tally value at the bottom
    const itemTally = document.getElementById("itemTally");
    itemTally.innerHTML = tally.toFixed(2);
}

// Load itemArr from localStorage and create HTML elements
if (itemArr.length > 0) {
    loadItemArr();
    
    // clear invisible class from table when data is present
    document.getElementById("itemList").classList.add("visible");
    
    // show reset button when items are present
    reset.classList.remove("invisible");
}

// Handle onClick event for reset button
reset.addEventListener("click", () => {
    itemArr = [];
    window.localStorage.removeItem("itemArr");
    loadItemArr();
});

// Handle onClick event for add button
add.addEventListener("click", () => {
   const itemName = document.getElementById("itemName").value;
   const itemPrice = document.getElementById("itemPrice").value;
   
    // Check that both name and price have been provided and that price is a legit number  
    if (itemName && itemPrice && checkIntOrFloat(itemPrice)) {
        // Add new item to array and update localStorage with the array
        itemArr.push({
            name: itemName, 
            price: itemPrice,
            id: uuidv4()
            });
        
        // Add invisible class to hide alerts
        alertItems.classList.add("invisible");
        
        // update itemArr in localStorage and item Table
        window.localStorage.setItem("itemArr", JSON.stringify(itemArr));
        
        loadItemArr();
    } else {
        // console.log('ALERT ITEMS TRIGGERED');
        alertItems.classList.remove("invisible");
    }
});

// Handle when the Submit button is clicked and calculates the current purchase
submit.addEventListener("click", () => {
    const funds = fundElement.value;
    const tally = document.getElementById("itemTally").innerHTML;
    const alertFunds = document.getElementById("alert-funds");

    if (funds && checkIntOrFloat(funds)) {
        response.classList.remove("invisible");
        
        if (parseFloat(funds) > parseFloat(tally)) {
            response.textContent = "You have enough funds for your purchase"
        } else {
            response.textContent = "You cannot afford to make this purchase"    
        }

        // Remove alert message if present
        alertFunds.classList.add("invisible");        
        // Store values in localStorage
        window.localStorage.setItem("funds", funds);
    } else {
        // Remove invisible class that hides the alert message
        alertFunds.classList.remove("invisible");
        // Remove the response message if present
        response.classList.add("invisible");
    }
});

