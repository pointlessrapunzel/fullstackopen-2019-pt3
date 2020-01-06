require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// log all request except POST
app.use(morgan('tiny', {
  skip: (req) => req.method === "POST"
}))

// log only POST requests
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body',
    { skip: (req) => req.method !== "POST" }
  )
)

let persons = [
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
  }
]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name and/or number missing'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})