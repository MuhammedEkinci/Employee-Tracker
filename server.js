
var mysql = require("mysql");
var inquirer = require("inquirer");
const consoleTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "*Momaster1",
  database: "pets_db"
});

connection.connect(function(err) {
  if (err) {
    throw err;
  }
  startCompany();
});

//Function that asks the questions and starts app
function startCompany() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
              "View All Employees",
              "View All Employees By Department",
              "View departments",
              "View roles",
              "Add department",
              "Add role",
              "Add Employee",
              "Remove Employee",
              "Update Employee Role",
              "Update Employee Manager",
              "EXIT"
            ]
        })
}
