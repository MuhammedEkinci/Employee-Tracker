
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
        }).then (function(answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees();
                    break;

                case "View All Employees By Department":
                    viewEmployeesByDept();
                    break;

                case "View departments":
                    viewDeptartment();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "Add department":
                    addDept();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Update Employee Manager":
                    updateEmployeeMng();
                    break;

                case "EXIT":
                    process.exit();
            }
        });
}
