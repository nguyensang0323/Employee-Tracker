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

async function addRole() {
  const department = await db.query("SELECT id as value, name FROM department");
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "role",
      message: "What is the name of the new role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary?",
    },
    {
      type: "list",
      name: "departmentId",
      message: "What department?",
      choices: department,
    },
  ]);

  await db.query(
    "INSERT into role (title, salary, department_id) values (?,?,?)",
    [answer.role, answer.salary, answer.departmentId]
  );

  console.log("Success, added role!");
  startApp();
}

async function addEmployee() {
  const role = await db.query("SELECT id as value, title as name FROM role");
  const manager = await db.query(
    "SELECT id as value, concat(first_name, ' ', last_name) as name from employee"
  );
  const answer = await inquirer.prompt([
    {
      type: "input",
      name: "first",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "roleId",
      message: "What is the new role?",
      choices: role,
    },
    {
      type: "list",
      name: "managerID",
      message: "Who is the manager?",
      choices: manager,
    },
  ]);

  await db.query(
    "INSERT into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)",
    [answer.first, answer.last, answer.roleId, answer.managerId]
  );

  console.log("Success, added new Employee!");
  startApp();
}

async function updateEmployee() {
  const role = await db.query("SELECT id as value, title as name FROM role");
  const employee = await db.query(
    "SELECT id as value, concat(first_name, ' ', last_name) as name from employee"
  );
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Who is the employee?",
      choices: employee,
    },
    {
      type: "list",
      name: "roleId",
      message: "What is the new role?",
      choices: role,
    },
  ]);

  await db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
    answer.roleId,
    answer.employeeId,
  ]);

  console.log("Success, updated Employee!");
  startApp();
}

// async function

// const roleResult = await db.query('select id as value, title as name from role')
