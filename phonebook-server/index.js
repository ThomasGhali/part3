const express = require('express');
const app = express();

const persons = [
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

app.use(express.json());

app.get('/', (request, response) => {
  response.status(200).send(`
    <h1>Phonebook Backend Main Page</h1>
    <h2>
      Go to 
      <a href="http://localhost:3001/api/persons">persons</a> 
      list on server.
    </h2>
    <h2>
      Go to 
      <a href="http://localhost:3001/info">server info</a> 
      page.
    <h2>
  `);
})

app.get('/api/persons', (request, response) => {
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

const PORT = 3001;
app.listen(PORT, () => console.log(`Server on port: ${PORT}`))