require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let url = process.env.MONGODB_URI
const password = process.env.MONGODB_PASSWORD

url = url.replace('<password>', password)

console.log('connecting to MongoDB')
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {    
        console.log('error connecting to MongoDB:', error.message)  
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true,
    uniqueCaseInsensitive: true,
    required: true
  },
  number: {
    type:String,
    minlength: 8,
    required:true
  }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema)