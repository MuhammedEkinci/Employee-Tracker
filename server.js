
var mysql = require("mysql");
var inquirer = require("inquirer");
const consoleTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "*Momaster1",
  database: "employee_db"
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
                    viewEmployeesByDeptartment();
                    break;

                case "View departments":
                    viewDeptartment();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "Add department":
                    addDeptartment();
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

//function to view all Employees
function viewEmployees() {
    var query = `SELECT employees.id, employees.first_name, employees.last_name, role.title, departments.name AS department, 
    role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees LEFT JOIN role on employees.role_id = role.id 
    LEFT JOIN departments on role.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`;

    connection.query(query, function(err, query) {
        console.table(query);
        startCompany();
    });

}
