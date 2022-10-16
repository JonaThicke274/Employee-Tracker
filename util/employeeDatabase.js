const inquirer = require(`inquirer`);
const { default: RawListPrompt } = require("inquirer/lib/prompts/rawlist");
const db = require(`../db/connection.js`);
require(`console.table`);

// Base questions for user priompt that do not require mysql interaction
const questions = {
    decision: [
        {
            type: `list`,
            name: `decision`,
            message: `What would you like to do?`,
            choices: [
                `View All Departments`,
                `View All Roles`,
                `View All Employees`,
                `View Employees by Manager`,
                `View Employees by Department`,
                `View Total Utilized Budget of a Department`,
                `Add a Department`,
                `Add a Role`,
                `Add an Employee`,
                `Update Employee's Role`,
                `Update Employee's Manager`,
                `Delete a Department`,
                `Delete a Role`,
                `Delete an Employee`,
                `Exit Application`
            ]
        }
    ],
    addDepartment: [
        {
            type: `input`,
            name: `department`,
            message: `What is the name of the new department?`,
            validate: input => {
                if (!input) {
                    console.log(`Please enter a department name!`);
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ],
    addRole: [
        {
            type: `input`,
            name: `roleName`,
            message: `What is the name of the new role?`,
            validate: input => {
                if (!input) {
                    console.log(`Please enter the role's name!`);
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        {
            type: `input`,
            name: `roleSalary`,
            message: `What is this role's salary?`,
            validate: input => {
                if (isNaN(input)) {
                    console.log(`Please enter this role's salary (Must be a number)!`);
                    return false;
                }
                else if (!input) {
                    console.log(`Please enter this role's salary (Must be a number)!`);
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ],
    addEmployee: [
        {
            type: `input`,
            name: `employeeFirstName`,
            message: "What is the first name of the new employee?",
            validate: input => {
                if (!input) {
                    console.log(`Please enter the employee's first name!`);
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        {
            type: `input`,
            name: `employeeLastName`,
            message: "What is the last name of the new employee?",
            validate: input => {
                if (!input) {
                    console.log(`Please enter the employee's last name!`);
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ]
};

// MySQL Functions
const viewDepartments = function() {
    const sql = `SELECT * FROM departments;`;

    db.query(sql, (err, rows) => {
        if (err) return console.log(err.message);

        console.table(`\n`, rows, `\n`);
        employeePrompt();
    })
};

const viewRoles = function() {
    const sql = `
    SELECT roles.id, roles.name, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id;
    `;

    db.query(sql, (err, rows) => {
        if (err) return console.log(err.message);

        console.table(`\n`, rows, `\n`);
        employeePrompt();
    })
};

const viewEmployees = function() {
    const sql = `
    SELECT A.id,
    A.first_name,
    A.last_name,
    roles.name AS role,
    roles.salary AS salary,
    departments.name AS department,
    CONCAT (B.first_name, " ", B.last_name) AS manager
    FROM employees A
    LEFT JOIN roles
    ON A.role_id = roles.id
    LEFT JOIN departments
    ON roles.department_id = departments.id
    LEFT JOIN employees B
    ON B.id = A.manager_id;
    `

    db.query(sql, (err, rows) => {
        if (err) return console.log(err.message);

        console.table(`\n`, rows, `\n`);
        employeePrompt();
    })
};

const viewEmployeesByManager = function() {
    const sql = `SELECT * FROM employees;`;
    // Gets employees to choose from
    db.query(sql, (err, rows) => {
        if (err) return console.log(err.message);

        // Creates object of employee's to choose from
        let employees = rows.map (({ id, first_name, last_name }) => ({ name: first_name + ` ` + last_name, value: id }));

        inquirer.prompt([
            {
                type: `list`,
                name: `employeeId`,
                message: `Which manager's employee's would you like to see?`,
                choices: employees
            }
        ])
        .then(answer => {
            const sql = `
            SELECT A.id,
            A.first_name,
            A.last_name,
            roles.name AS role,
            roles.salary AS salary,
            departments.name AS department,
            CONCAT (B.first_name, " ", B.last_name) AS manager
            FROM employees A
            LEFT JOIN roles
            ON A.role_id = roles.id
            LEFT JOIN departments
            ON roles.department_id = departments.id
            LEFT JOIN employees B
            ON B.id = A.manager_id
            WHERE A.manager_id = ?;
            `
            const params = [answer.employeeId];

            db.query(sql, params, (err, rows) => {
                if (err) return console.log(err.message);

                console.table(`\n`, rows, `\n`);
                employeePrompt();
            })
        })
    })

};

const addDepartment = function() {
    inquirer.prompt(questions.addDepartment)
        .then(answer => {
            const sql = `INSERT INTO departments (name) VALUES (?)`
            const params = [answer.department]

            db.query(sql, params, (err, rows) => {
                if (err) return console.log(err.message);

                console.log(`\n`,
                `Department ${answer.department} added.`,
                `\n`)
                viewDepartments();
            })
        })
};

const addRole = function() {
    inquirer.prompt(questions.addRole)
        .then(answer => {
            const sql = `SELECT * FROM departments;`;
            const params = [answer.roleName, answer.roleSalary];

            // Gets departments from database to populate choices for which department the new role belongs to
            db.query(sql, params, (err, rows) => {
                if (err) return console.log(err.message);

                // Initializes the array of departments then pushes each department from the database
                let departments = []
                rows.forEach((department) => {
                    departments.push(department.name)
                });

                inquirer.prompt([ 
                    {
                        type: `list`,
                        name: `roleDepartment`,
                        message: `What is the new role's department?`,
                        choices: departments
                    }
                ])
                .then(answer => {
                    let departmentId;
                    rows.forEach(department => {
                        if (answer.roleDepartment === department.name) {
                            departmentId = department.id
                        }
                    });

                    // Pushes department_id into params array so role can properly be added with needed table values
                    params.push(departmentId);

                    const sql = `
                    INSERT INTO roles (name, salary, department_id) VALUes (?, ?, ?)
                    `;

                    db.query(sql, params, (err, rows) => {
                        if (err) return console.log(err.message);
        
                        console.log(`\n`,
                        `Role ${params[0]} added.`)
                        viewRoles();
                    })
                })
            })
        })
};

const addEmployee =  function() {
    inquirer.prompt(questions.addEmployee)
        .then(answer => {
            const sql = `SELECT * FROM roles;`;
            const params = [answer.employeeFirstName, answer.employeeLastName];

            // Gets roles from database to populate choices for roles
            db.query(sql, params, (err, rows) => {
                if (err) return console.log(err.message);
                else {
                    // Creates an array for choices for roles to select from
                    let roles = []
                    rows.forEach(role => { roles.push(role.name) });

                    inquirer.prompt([
                            {
                                type: `list`,
                                name: `employeeRole`,
                                message: `What is your new employee's role?`,
                                choices: roles
                            }
                        ])
                        .then(answer => {
                            let roleId;
                            rows.forEach((role) => {
                                if (answer.employeeRole === role.name) {
                                    roleId = role.id;
                                };
                            });
                            
                            // Pushes role_id into params
                            params.push(roleId);
                            
                            // Gets managers from database to populate choices for managers
                            const sql = `SELECT * FROM employees;`;
                            db.query(sql, params, (err, rows) => {
                                if (err) return console.log(err.message);
                                
                                // Creates an array for choices for managers to select from
                                let managers = rows.map(({ id, first_name, last_name }) => ({ name: first_name + ` ` + last_name, value: id}));
                                managers.push({ name: `N/A`, value: null})
                                
                                inquirer.prompt([
                                    {
                                        type: `list`,
                                        name: `employeeManager`,
                                        message: `Who is the new employee's manager?`,
                                        choices: managers 
                                    }
                                ])
                                .then(answer => {
                                    // Pushes answer for manager_id into params
                                    params.push(answer.employeeManager);
                                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                                    db.query(sql, params, (err, rows) => {
                                        if (err) return console.log(err.message);
                        
                                        console.log(`\n`,
                                        `Employee ${params[0] + ` ` + params[1]} added.`)
                                        viewEmployees();
                                    });
                                });
                                
                            });
                        });
                }
            });
        });
};

const updateEmployeeRole = function() {
    const sql = `SELECT * FROM employees;`;
    // Gets employees to choose from
    db.query(sql, (err, rows) => {
        if (err) return console.log(err.message);

        // Creates object of employee's to choose from
        let employees = rows.map (({ id, first_name, last_name }) => ({ name: first_name + ` ` + last_name, value: id }));

        inquirer.prompt([
            {
                type: `list`,
                name: `employeeId`,
                message: `Which employee's role needs to be updated?`,
                choices: employees
            }
        ])
        .then(answer => {
            const params = [answer.employeeId];
            const sql = `SELECT * FROM roles`
            // Gets roles to choose from
            db.query(sql, (err, rows) => {
                if (err) return console.log(err.message);
                
                // Creates an array for choices for managers to select from
                let roles = rows.map(({ id, name}) => ({ name: name, value: id}));
    
                inquirer.prompt([
                    {
                        type: `list`,
                        name: `employeeRole`,
                        message: `What is the employee's new role?`,
                        choices: roles
                    }
                ])
                .then(answer => {
                    const sql = `UPDATE employees SET role_id = ${answer.employeeRole} WHERE id = ?`
                    
                    db.query(sql, params, (err, rows) => {
                        if (err) return console.log(err.message);
        
                        console.log(`\n`,
                        `Employee role updated.`)
                        viewEmployees();
                    });
                })
            });
        });
    });

};

// Prompts for user interaction with employeeRoster database
const employeePrompt = function() {
    inquirer.prompt(questions.decision)
        .then(answer => {
            switch (answer.decision) {
                case `View All Departments`:
                    viewDepartments();
                    break;
                case `View All Roles`:
                    viewRoles();
                    break;
                case `View All Employees`:
                    viewEmployees();
                    break;
                case `View Employees by Manager`:
                    viewEmployeesByManager();
                    break;
                case `View Employees by Department`:
                    console.log(`View Employees by Department selected`);
                    break;
                case `View Total Utilized Budget of a Department`:
                    console.log(`View Total Utilized Budget of a Department selected`);
                    break;
                case `Add a Department`:
                    addDepartment();
                    break;
                case `Add a Role`:
                    addRole();
                    break;
                case `Add an Employee`:
                    addEmployee();
                    break;
                case `Update Employee's Role`:
                    updateEmployeeRole();
                    break;
                case `Update Employee's Manager`:
                    console.log(`Update Employee's Manager selected`);
                    break;
                case `Delete a Department`:
                    console.log(`Delete a Department selected`);
                    break;
                case `Delete a Role`:
                    console.log(`Delete a Role selected`);
                    break;
                case `Delete an Employee`:
                    console.log(`Delete an Employee selected`);
                    break;
                case `Exit Application`:
                    console.log(`Exiting application...`);
                    db.end();
                    return;

            }
        })
        .catch((error) => {
            console.log(error);
        });
}


module.exports = employeePrompt;