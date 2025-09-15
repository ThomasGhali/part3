require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/person')

// Parse incoming json requests
app.use(express.json());
// Show front-end static content (build) from 'dist' dir
app.use(express.static('dist'))

const generalLog = morgan('tiny', {
  skip: (req, res) => req.method === 'POST'
})

// :person custom token
morgan.token('person', (req, res) => JSON.stringify(req.body))
const postLog = morgan(':method :url :status :res[content-length] - :response-time[digits] ms :person');

app.use(generalLog)

app.get('/', (request, response) => {
  response.status(200).send(`
    <h1>Phonebook Backend Main Page</h1>
    <h2>
      Go to 
      <a href="https://carefree-abundance-production.up.railway.app/api/persons">persons</a> 
      list on server.
    </h2>
    <h2>
      Go to 
      <a href="https://carefree-abundance-production.up.railway.app/info">server info</a> 
      page.
    <h2>
  `);
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => response.json(result))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => response(person))
})

app.get('/info', (request, response) => {
  const time = new Date();
  Person.countDocuments().then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
    `)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id)

  if (!person) return response.status(404).json({ error: 'Person not found in the list' })

  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
})


app.post('/api/persons',postLog , (request, response) => {
  const body = request.body;
  
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Missing information: name and number are required' })
  }
  
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
    console.log(`(✓) ${savedPerson.name}'s contact info saved in data based`)
  })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port: ${PORT}`))