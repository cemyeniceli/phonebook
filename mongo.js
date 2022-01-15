require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1)
}

let url = process.env.MONGODB_URI
const password = encodeURIComponent(process.argv[2])

url = url.replace('<password>', password)

console.log('connecting to', url)
mongoose.connect(url)
	.then(result => {
		result
		console.log('connected to MongoDB')
	})
	.catch((error) => {    
		console.log('error connecting to MongoDB:', error.message)  
	})

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    
	Person.find({}).then(result => {
		console.log('Phonebook:')
		result.forEach(person => console.log(person.name, person.number))
		mongoose.connection.close()
		process.exit(1)
	})     
} else if (process.argv.length < 5) {
	const inputName = process.argv[3]
	const inputNumber = process.argv[4]

	const newPerson = new Person({
		name: inputName,
		number: inputNumber
	})

	newPerson.save().then(result => {
		console.log(`added ${result.name} number ${result.number} to phonebook`)
		mongoose.connection.close()
	})
} else {
	console.log('Error in provided name, name with whits spaces should be between quotes')
	mongoose.connection.close()
}



