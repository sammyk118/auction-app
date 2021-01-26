var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "greatBay_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

const productArr = [];

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "postOrBid",
      type: "rawlist",
      message: "Would you like to [POST] an auction or [BID] on an auction?",
      choices: ["POST", "BID"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid.toUpperCase() === "POST") {
        postAuction();
      }
      else {
        bidAuction();
      }
    });
}

function postAuction() {
  inquirer
    .prompt({
      name: "itemName",
      type: "input",
      message: "What item are you posting?"

    });
}

function bidAuction() {
  inquirer
    .prompt({
      name: "bidItem",
      type: "rawlist",
      message: "What item would you like to bid on",
      choices: productArr
    });
}



function createProduct(varName, varCategory, varStarting) {
  console.log("inserting product");
  var query = connection.query(
    "INSERT INTO auctions SET ?",
    {
      item_name: varName,
      category: varCategory,
      starting_bid: varStarting
    },
    function (err, res) {
      console.log("Inserted ", varName, " with starting value of ", varStarting);
    }
  )
  console.log(query.sql);
}

function updateProduct(varId, newBid) {
  console.log("Updating bidding price");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        highest_bid: newBid
      },
      {
        id: varId
      }
    ],
    function (err, res) {
      console.log("Updated bidding price of ", varId, "to ", newBid);
    }
  )
}

function readProducts() {
  // connection.query("SELECT * FROM songs WHERE genre='indie'", function (err, res) {
  //     if (err) throw err;
  //     console.log("indie songs: \n", res);

  // })
  connection.query("SELECT * FROM auctions", function (err, res) {
    console.log("\n--------- Every auction --------------- ")
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      console.log(res[i].id, "|", res[i].item_name, "|", res[i].category, "|", res[i].starting_bid, "|", res[i].highest_bid);
    }
    console.log("-------- \n")
    connection.end();
  })
}

function getListing() {
  connection.query("SELECT * FROM auctions", function (err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      productArr.push(res[i].item_name);
    }
    connection.end();
  })
}