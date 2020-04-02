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

// let contacts = [
//       {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//       },
//       {
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523",
//         "id": 2
//       },
//       {
//         "name": "Dan Abramov",
//         "number": "12-43-234345",
//         "id": 3
//       },
//       {
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122",
//         "id": 4
//       },
//       {
//         "name": "asw",
//         "id": 7,
//         "number": "12"
//       }
//     ]

app.get('/api/persons',(req,res,next) => {
    Person.find({})
    .then(response => {
        res.json(response.map(ele => ele.toJSON()))
    })
    .catch(err => next(err))
})

app.get('/info',(req,res,next)=> {
    const date = new Date()
    Person.find({})
    .then(resp => res.send(`<p>Phonebook has ${resp.length} people</p><p>${date}</p>`))
    .catch(err => next(err))
})

app.get('/api/persons/:id',(req,res,next) => {
    const id = req.params.id
    // const person = contacts.find((ele) => ele.id === id)
    // console.log(person)
    // if(!person){
    // res.status(404).json({
    //     error: "person not found"
    // })
    // }
    // else{
        
    // }
    Person.find({_id:id})
    .then(resp => res.send(resp))
    .catch(err => next(err))

})

app.delete('/api/persons/:id', (req,res,next) => {
    const id = req.params.id
    
    Person.findByIdAndDelete(id)
    .then(resp => {console.log(resp)
        res.status(204).send('person deleted')})
    .catch(err => next(err))
})

app.post('/api/persons',(req,res,next) => {
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
    })
    newPerson.save()
    .then(response => res.json(response.toJSON()))
    .catch(err => next(err))
})


app.put('/api/persons/:id',(req,res,next) => {
    const id = req.params.id
    const body = req.body
    Person.findOneAndUpdate({_id: id} ,{$set: {number:body.number}} )
    .then(resp => {
        console.log(resp)
        res.send(resp)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const errorHandler = (error, req,res,next) => {
    console.log(error.message)

    if(error.name === 'CastError' && error.kind === 'ObjectId'){
        return res.status(400).send({err:'malformatted Id'})
    }

    next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001;
app.listen(port,() => {
    console.log(`listening at port ${port}`)
} )