
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
              "Delete Employee",
              "EXIT"
            ]
        }).then (function(answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees();
                    break;

                case "View All Employees By Department":
                    viewEmployeesByDepartment();
                    break;

                case "View departments":
                    viewDepartment();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Delete Employee":
                    deleteEmployee();
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

//Function to add a new employee
function addEmployee() {
    //arrays to display prompt choices from database items 
    var roles = [];
    connection.query("SELECT * FROM role", function(err, resRole) {
      if (err) throw err;
      for (var i = 0; i < resRole.length; i++) {
        var roleList = resRole[i].title;
        roles.push(roleList);
      };
  
      var departs = [];
      connection.query("SELECT * FROM departments", function(err, resDept) {
        if (err) throw err;
        for (var i = 0; i < resDept.length; i++) {
          var deptList = resDept[i].name;
          departs.push(deptList);
      }
      
    inquirer
      .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is employee's first name:"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is employee's last name:"
      },
      {
        name: "role_id",
        type: "rawlist",
        message: "Select employee role:",
        choices: roles
      },
      {
        name: "department_id",
        type: "rawlist",
        message: "Select employee's department:",
        choices: departs
      },
  
    ])
      .then(function(answer) {
        //for loop to retun 
        var roleChosen;
          for (var i = 0; i < resRole.length; i++) {
            if (resRole[i].title === answer.role_id) {
              roleChosen = resRole[i];
            }
          };
  
          var chosenDept;
          for (var i = 0; i < resDept.length; i++) {
            if (resDept[i].name === answer.department_id) {
              chosenDept = resDept[i];
            }
          };
        //connection to insert response into database  
        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleChosen.id,
            department_id: chosenDept.id
          },
          function(err) {
            if (err) throw err;
            console.log("Employee " + answer.firstName + " " + answer.lastName + " successfully added!");
            startApp();
          }
        );
      })
     });
    })
  };
  
//Function to view employees by department 
function viewEmployeesByDepartment() {
    var queryString =`SELECT departments.name AS department, employees.id, employees.first_name, employees.last_name, role.title FROM employees 
    LEFT JOIN role on employees.role_id = role.id LEFT JOIN departments departments on role.department_id = departments.id WHERE departments.id;`;

    connection.query(queryString, function(err, query){
      console.table(query);
      startCompany();
  });
};

//function to view all the departments
function viewDepartment() {
    var queryString = `SELECT id AS Dept_ID, name AS departments FROM departments;`;
    connection.query(queryString, function(err, query){
      console.table(query);
      startCompany();
    });
  };


//FUNCTION to view all roles
function viewRoles() {
    var queryString = "SELECT id AS Role_ID, title, salary AS Salaries FROM role;";
    connection.query(queryString, function(err, query) {
        console.table(query);
        startCompany();
    });
}


//function to add Departments
function addDepartment() {
    inquirer.prompt([
        {
            name: "dept",
            type: "input",
            message: "Enter new department's name:"
        }
    ])
    .then(function(answer) {
        connection.query("INSERT INTO departments SET ?",
            {
                name: answer.dept
            },
            function(err){
                if(err) throw err;
                console.log("Department " + answer.dept + " successfully added!");
                startCompany();
            }
        );
    });
}

//function to add Role
function addRole() {
    var departChoice = [];
    connection.query("SELECT * FROM departments", function(err, resDepart) {
        if(err) throw err;
        for(var i = 0; i < resDepart.length; i++) {
            var deptList = resDepart[i].name;
            departChoice.push(deptList);
        }

        inquirer
        .prompt([
        {
            name: "title",
            type: "input",
            message: "Enter new role:"
        },
        {
            name: "salary",
            type: "number",
            message: "Enter new role's salary:"
        },
        {
            name: "department_id",
            type: "rawlist",
            message: "Select employee's department:",
            choices: departChoice
        }
        ])
        .then(function(answer) {
            var chosenDept;
            for (var i = 0; i < resDepart.length; i++) {
              if (resDepart[i].name === answer.department_id) {
                chosenDept = resDepart[i];
              }
            }
            connection.query("INSERT INTO role SET ?",
                {
                  title: answer.title,
                  salary:answer.salary,
                  department_id: chosenDept.id
                },
                function(err) {
                  if (err) throw err;
                  console.log("New role " + answer.title + " successfully added!");
                  startCompany();
                }
            );
        });
    });
}

//function to delete Employee
function deleteEmployee() {
    var employeeChoice = [];
      connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
        if (err) throw err;
        for (var i = 0; i < resEmp.length; i++) {
          var empList = resEmp[i].name;
          employeeChoice.push(empList);
      };
  
    inquirer
      .prompt([
        {
          name: "employee_id",
          type: "rawlist",
          message: "Select the employee you would like to remove:",
          choices: employeeChoice
        },
    ])
    .then(function(answer) {
  
      var chosenEmp;
          for (var i = 0; i < resEmp.length; i++) {
            if (resEmp[i].name === answer.employee_id) {
              chosenEmp = resEmp[i];
          }
        };
  
      connection.query("DELETE FROM employees WHERE id=?",
        [chosenEmp.id],
  
        function(err) {
          if (err) throw err;
          console.log("Employee successfully removed!");
          startApp();
        }
      );
     });
    })
  };