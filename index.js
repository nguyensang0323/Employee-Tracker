const db = require("./db/connection");
const inquirer = require("inquirer");
require("console.table");

const utils = require("util");
db.query = utils.promisify(db.query);

const startApp = async () => {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Quit",
      ],
    },
  ]);
  if (answer.choice === "View all departments") {
    viewDepartment();
  } else if (answer.choice === "View all roles") {
    viewRoles();
  } else if (answer.choice === "View all employees") {
    viewEmployees();
  } else if (answer.choice === "Add a department") {
    addDepartment();
  } else if (answer.choice === "Add a role") {
    addRole();
  } else if (answer.choice === "Add an employee") {
    addEmployee();
  } else if (answer.choice === "Update an employee role") {
    updateEmployee();
  } else {
    // db.close();
  }
};

async function viewDepartment() {
  const result = await db.query("SELECT * FROM department");
  console.table(result);
  startApp();
}

// const viewDepartment = async () => {
//   const result = await db.query("SELECT * FROM department");
//   console.table(result);
//   startApp();
// };

startApp();

async function viewRoles() {
  const result = await db.query(
    "SELECT role.id, role.title, role.salary, department.name FROM role left JOIN department ON role.department_id = department.id"
  );
  console.table(result);
  startApp();
}

async function viewEmployees() {
  const result =
    await db.query(`SELECT employee.id, employee.first_name AS "first name", employee.last_name 
    AS "last name", role.title, department.name AS department, role.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`);
  console.table(result);
  startApp();
}

async function addDepartment() {
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "What is the name of the new department?",
    },
  ]);

  await db.query("INSERT INTO department (name) values (?)", [
    answer.department,
  ]);
  console.log("Your department was added.");
  startApp();
}

// async function

// const roleResult = await db.query('select id as value, title as name from role')
