const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('to display all of the entries, type:')
  console.log('node mongo.js <password>')
  console.log('=========================')
  console.log('to make a new entry, type:')
  console.log('node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-chdrg.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const listPersons = () => {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

const addPerson = () => {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  listPersons()
} else if (process.argv.length === 5) {
  addPerson()
} else {
  console.log('something wrong...')
  process.exit(1)
}