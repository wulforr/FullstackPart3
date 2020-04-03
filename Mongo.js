const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

console.log(process.env.MONGODB_URI)
const url = process.env.MONGODB_URI
mongoose.set('useCreateIndex', true)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected'))
    .catch(err => console.log(err))


const personSchema = new mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:true,
        minlength:3
    },
    number: {
        type:Number,
        minlength:8,
        required:true
    }
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)