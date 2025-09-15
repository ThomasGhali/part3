const express = require('express');
const morgan = require('morgan');
const app = express();

// Parse incoming json requests
app.use(express.json());
// Show front-end static content (build) from 'dist' dir
app.use(express.static('dist'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

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
  console.log(persons)
  response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);

  if (!person) {
    return response.status(404).json({ error: 'The person with that id is not found' })
  }

  response.json(person);

})

app.get('/info', (request, response) => {
  const time = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
  `)
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
  
  const nameExists = persons.some(p => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({ error: 'Name must be unique' })
  }

  const randomId = Math.ceil(Math.random() * 1000000000);

  const newPerson = {
    id: String(randomId),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson);
  response.status(201).json(newPerson);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port: ${PORT}`))