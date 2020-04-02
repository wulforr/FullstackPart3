const express = require('express');
const app = express()
require('dotenv').config()
// const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./Mongo')

app.use(cors())

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json())

// morgan.token('body1',function (req,res) { return req.body})
// app.use(morgan('tiny'))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body1'))

let contacts = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "asw",
        "id": 7,
        "number": "12"
      }
    ]

app.get('/api/persons',(req,res) => {
    Person.find({})
    .then(response => {
        res.json(response.map(ele => ele.toJSON()))
    })
    // res.send(contacts)
})

app.get('/info',(req,res)=> {
    const date = new Date()
    res.send(`<p>Phonebook has ${contacts.length} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    const person = contacts.find((ele) => ele.id === id)
    console.log(person)
    if(!person){
    res.status(404).json({
        error: "person not found"
    })
    }
    else{
        res.send(person)
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    // const person = contacts.find((ele) => ele.id === id)
    // if(person){
    // contacts = contacts.filter(contact => contact.id !== id)
    // res.status(204).send('person deleted')
    // }
    // else
    //     res.send('person not found').status(404)
    Person.find({id})
    .then(resp => console.log(resp))
})

app.post('/api/persons',(req,res) => {
    const body = req.body
    if(!body.name){
        return res.status(400).json({
            error:"name is required"
        })
    }
    if(!body.number){
        return res.status(400).json({
            error:"number is required"
        })
    }
    const newPerson = new Person({
        name: body.name,
        number:body.number
        // id: Math.floor(Math.random()*500000)
    })
    contacts = [...contacts,newPerson]
    // res.send(newPerson)
    newPerson.save()
    .then(response => res.json(response.toJSON()))
})

const port = process.env.PORT || 3001;
app.listen(port,() => {
    console.log(`listening at port ${port}`)
} )