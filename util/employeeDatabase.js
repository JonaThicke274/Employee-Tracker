const inquirer = require(`inquirer`);
const db = require(`../db/connection.js`);

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

const employeePrompt = function() {
    inquirer.prompt(questions.decision)
        .then(answer => {
            switch (answer.decision) {
                case `View All Departments`:
                    console.log(`View All Departments chosen`);
                    break;
                case `View All Roles`:
                    console.log(`View All Roles selected`);
                    break;
                case `View All Employees`:
                    console.log(`View All Employees selected`);
                    break;
                case `View Employees by Manager`:
                    console.log(`View Employees by Manager selected`);
                    break;
                case `View Employees by Department`:
                    console.log(`View Employees by Department selected`);
                    break;
                case `View Total Utilized Budget of a Department`:
                    console.log(`View Total Utilized Budget of a Department selected`);
                    break;
                case `Add a Department`:
                    console.log(`Add a Department selected`);
                    break;
                case `Add a Role`:
                    console.log(`Add a Role selected`);
                    break;
                case `Add an Employee`:
                    console.log(`Add an Employee selected`);
                    break;
                case `Update Employee's Role`:
                    console.log(`Update Employee's Role selected`);
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