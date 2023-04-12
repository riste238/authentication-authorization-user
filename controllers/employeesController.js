// const data = {}
// data.employees = require('../model/employees.json');

const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const createNewEmployees = (req, res) => {

    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ "message": "First and last nams are required!" })
    }
    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees)
}


const updateEmployee = (req, res) => {

    const employee = data.employees.find(employee => employee.id === parseInt(req.body.id))
    if (!employee) { res.status(400).json({ "message": `Employee ID ${req.body.id} is not exist in the database` }) }

    if (req.body.firstname) { employee.firstname = req.body.firstname }
    if (req.body.lastname) { employee.lastname = req.body.lastname }

    const filteredArray = data.employees.filter(item => item.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee]
    // data.setEmployees(unsortedArray.sort((a,b) => { a.id > b.id ? -1 : 1})) look at your version and compare with him version

    data.setEmployees(unsortedArray.sort((a, b) =>  a.id > b.id ? 1 : a.id < b.id ? -1 : 0 ))
    // console.log(data.employees);
    res.json(data.employees)

}


const deleteEmployee = (req, res) => {

    const deleteEmployee = req.body.id;
    const employee = data.employees.find(item => item.id === parseInt(deleteEmployee));
    if (!employee) { res.status(400).json({ "message": `Employee ${deleteEmployee} is not found.` }) }
    const filteredArray = data.employees.filter(items => items.id !== parseInt(deleteEmployee));
    data.setEmployees([...filteredArray])
    res.json(data.employees)
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(item => item.id === parseInt(req.params.id));
    if (!employee) { res.status(400).json({ "message": `Employee ${req.params.id}is not found.` }) }
    res.json(employee)

}

module.exports = {
    getAllEmployees,
    createNewEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployee

}