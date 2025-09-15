const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI;
mongoose.connect(url)
  .then(result => console.log('✔ Connected to MongoDB'))
  .catch(error => console.log('✘ Error connecting to MongoDB: ', error.message))

const personSchema = mongoose.Schema({
  name: String,
  number: String,
})

mongoose.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)