const mongoose = require('mongoose')

// if ( process.argv.length<3 ) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]
console.log(process.env.MONGODB_URI)
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connected"))
.catch(err => console.log(err))


const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

// if(process.argv[4]){

// const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4]
// })

// person.save()
// .then(res => {
//     console.log(res)
//     mongoose.connection.close()
// })
// }
// else {
//     Person.find({})
//     .then(res => {
//         res.forEach(person => console.log(person))
//         mongoose.connection.close()
//     })
// }

module.exports = mongoose.model('Person', personSchema)