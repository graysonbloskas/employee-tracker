const mysql = require('mysql');
const inquirer = require('inquirer');
const { star } = require('cli-spinners');
const { start } = require('repl');

// Connect to database 
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employee_db',
});

connection.connect((err => {
    if (err) throw err;
    console.log('Listening');
    startTracker()
}));

const startTracker = () => {
    inquirer
    .prompt({
        name: 'start',
        type: 'list',
        message: 'Choose an action',
        choices: [
            'View all employees',
            'View all departments',
            'View all roles',
            'Add employee',
            'Add Department',
            'Add Role',
            'Update Employee Role',
            'Delete Role',
            'Delete Employee',
            'Delete Department',
            'Exit',
        ],
    })
    .then((response) => {
        switch (response.start) {
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Exit':
                console.log('Goodbye');
                connection.end();
                default:
                    break;
        }
    });
};

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        console.table(res)
        startTracker();
    });
};

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        console.table(res);
        startTracker();
    });
};

function viewAllRoles() { 
    connection.query('SELECT * FROM role', (err, res) => {
        console.table(res);
        startTracker();
    });
};

function addEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstname',
            message: 'First Name of Employee',
        },
        {
            type: 'input',
            name: 'lastname',
            message: 'Last Name of Employee',
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select the employee role',
            choices: () => roles(),
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select the manager of this employee',
            choices: manager(),
        },

    ])
    .then((answers) => {
        let managerId = manager().indexOf(answers.manager) + 1;
        let newEmp = {
            first_name: answers.firstname,
            last_name: answers.lastname,
            manager_id: managerId,
            role_id: answers.role,
        };
        connection.query('INSERT INTO employee SET ?', newEmp, (err, res) => {
            if (err) throw err;
            viewAllEmployees();
        })
    })
}