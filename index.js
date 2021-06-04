const mysql = require('mysql');
const inquirer = require('inquirer');


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
    connection.query('SELECT * FROM role', function (err, res) {
        const roles = res.map((role) => {
            return {
                name: role.title,
                value: role.id
            }
        })
    connection.query('SELECT * FROM manager', (err, res) => {
        const manArray = res.map((manager) => {
            return {
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id,
            }
        })
    
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
            name: 'roleId',
            message: 'Select the employee role',
            choices: roles,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select the manager of this employee',
            choices: manArray,
        },

    ])
    .then((answers) => {
        connection.query('INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES(?,?,?,?)',
        [answers.firstname, answers.lastname, answers.roleId, answers.manager],
        function (req, res) { 
            startTracker();
         }
        )
    })
})
})

}

function addDepartment() {
    inquirer
    .prompt([
        {
        type: 'input',
        name: 'departAdd',
        message: 'Name the new Department',
        }
    ]).then((answers) => {
        var newDepartment = {
            departmentName: answers.departAdd,
        }
        connection.query('INSERT INTO department SET ?',
        newDepartment,
         (err, res) => {
             if (err) throw err;
            startTracker();
        })
    })
}

function addRole() {
    connection.query('SELECT * FROM department', (err, res) => {
        let departmentArr = res.map((department) => {
            return {
                name: department.name,
                value: department.id
            }
        })
    
    inquirer
    .prompt([
        {
            name: 'roleAdd',
            type: 'input',
            message: 'Create a new role by giving it a name',
        },
        {
            name: 'departmentAdd',
            type: 'list',
            message: 'Select the department for this role',
            choices: departmentArr
        },
        {
            name: 'salaryRole',
            type: 'input',
            message: 'State the salary for this role'
        },
    ])
    .then((answers) => {
        var roleAdd = {
            title: answers.roleAdd,
            salary: answers.salaryRole,
            department_id: answers.departmentAdd,
        };
        
        connection.query('INSERT INTO role SET ?', roleAdd, (err, res) => {
            if (err) throw err;
            startTracker();
        })
    })
})
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, res) => {
        let employeeArr = res.map((employee) => { 
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }
        });
        connection.query('SELECT * FROM role', (err, data) => {
            let roles = data.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            })
            inquirer
            .prompt([
                {
                    name: 'employees',
                    message: 'Choose the employee',
                    type: 'list',
                    choices: employeeArr,
                },
                {
                    name: 'roleUp',
                    message: 'Select the new role for the employee',
                    type: 'list',
                    choices: roles,
                }
            ])
            .then((answers) => {
                connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.roleUp, answers.employees], (err, res) => {
                    console.table(res)
                    startTracker();
                })
            })
        })
    })
}

function deleteRole() {
    connection.query('SELECT * FROM role', (err, res) => {
        var roles = res.map((role) => {
            return {
                name: role.title,
                value: role.id
            }
        })
        inquirer
        .prompt([
            {
                name: 'roleDel',
                message: 'Choose the role for deletion',
                type: 'list',
                choices: roles
            }
        ])
        .then((answers) => {
            connection.query('DELETE FROM role WHERE ?', {id: `${answers.roleDel}`}, (err, res) => {
                console.table(res)
                startTracker();
            })
        })
    })
}

const deleteEmployee = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        var employeeArr = res.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }
        })
        inquirer
        .prompt([
            {
                name: 'employeeDel',
                message: 'Select the employee that got fired',
                type: 'list',
                choices: employeeArr
            }
        ])
        .then((answers) => {
            connection.query('DELETE FROM employee WHERE?', {id: `${answers.employeeDel}`}, (err, res) => {
                console.table(res);
                startTracker();
            })
        })
    })
}

const deleteDepartment = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        let departmentArr = res.map((department) => {
            return {
                name: department.name,
                value: department.id
            }
        })
        inquirer
        .prompt ([
            {
                name: 'deptDel',
                message: 'Select the department to delete',
                type: 'list',
                choices: departmentArr
            }
        ])
        .then((answers) => {
            connection.query('DELETE FROM department WHERE ?' , {id: `${answers.departmentDel}`}, (err, res) => {
                console.table(res);
                startTracker();
            })
        })
    })
}

