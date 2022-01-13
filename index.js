const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('dataSent', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)    
    }
    return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dataSent'))
app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.get('/api/info', (request, response) => {
    const numberOfRecords = persons.length
    const date = new Date()

    response.send(`<p>Phonebook has info for ${numberOfRecords} people</p><p>${date}</>`)
    
})

const generateId = () => Math.round(Math.random() * 1e9) 

app.post('/api/persons', (request, response) => {
    const person = request.body
    const isNewName = persons.every((p) => (p.name !== person.name))

    if (!person.name) {
        return response.status(400).json({error: 'Name is missing'})
    }

    if (!person.number) {
        return response.status(400).json({error: 'Number is missing'})
    }

    if (!isNewName) {
        return response.status(400).json({error: 'name must be unique'})    
    }

    const newPerson = {
        id: generateId(),
        name: person.name,
        number: person.number
    }
    
    persons = persons.concat(newPerson)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})