const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(() => console.log('✔ Connected to MongoDB'))
  .catch(error => console.log('✘ Error connecting to MongoDB: ', error.message))

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: (v) => /^\d{2,3}-\d{6,}$/.test(v),
    required: true
  },
})

mongoose.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)