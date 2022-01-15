const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/note')
const app = express()

morgan.token('dataSent', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)    
    }
    return null
})

app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dataSent'))
app.use(express.json())

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id =request.params.id
    Person.findById(id)
        .then(person => person ? response.json(person) : response.status(404).end())
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(id)
        .then(result => {
            result ? response.status(204).end() : response.status(404).send({error: 'Person does not exists'})
        })
        .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
    Person.find({})
        .then(persons => {
            const numberOfRecords = persons.length
            const date = new Date()
            response.send(`<p>Phonebook has info for ${numberOfRecords} people</p><p>${date}</>`)
        })
        .catch(error => {next(error)
        }) 
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }
    
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({error: 'Name is missing'})
    }

    if (!person.number) {
        return response.status(400).json({error: 'Number is missing'})
    }

    const newPerson = new Person( {
        name: person.name,
        number: person.number
    })

    newPerson.save().then(result => {
        response.json(result)
    })  
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})