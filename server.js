const inquirer = require("inquirer")
const mysql = require("mysql")
let depArr, roleArr, employeeArr;

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_db"
})

connection.connect(err => {
    if(err) throw err;
    // console.log("Welcome to my Company!")
    loadDep();
})

function init () {
    inquirer.prompt([
        {
            type: "list",
            name: "initialChoice",
            message: "What would you like to do?",
            choices: ["View Departments", "Add Role"]
        }
    ]).then(initialResponse => {
        if(initialResponse.initialChoice == "View Departments"){
            displayDep()
            init()
        } else if(initialResponse.initialChoice == "Add Role"){
            addRole()
        }
    })
}

// View Functions
function displayDep(){
    let query =`
    SELECT * FROM department`
    connection.query(query, (err, res) =>{
        if(err) throw err;
        console.log("\n\n")
        console.table(res);
        console.log("\n\n\n")
    })
}

//Load Table data
function loadDep() {
    let query =`
    SELECT * FROM department`
    depArr = [];
    connection.query(query, (err, res) => {
        if(err) throw err;
        res.forEach(element => {
            depArr.push(element.dep_name)
        });
    })
}

// Add Functions
function addRole() {
    inquirer
     .prompt([
        {
            name: "newRole",
            message: "What is the name of the Role?"
        },
        {
            name: "salary",
            message: "What is this role's Salary"
        },
        {
            type: "list",
            name: "depId",
            message: "Which department does this role belong to?",
            choices: depArr
        }
    ]).then(roleResponse => {
        let query=`
        INSERT INTO roles (title, salary, department_id)
        VALUES (?,?,?)`
        let depIndex = depArr.indexOf(roleResponse.depId) + 1;
        connection.query(query, [roleResponse.newRole, roleResponse.salary, depIndex], (err, res) => {
            if(err) throw err;
            console.log("done")
            init()
        })
    })
}

init()