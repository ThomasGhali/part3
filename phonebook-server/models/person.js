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
    required: [true, 'Phone number is required']
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{6,}$/.test(v),
      message: (props) => `${props.value} is not valid. Please follow the format: XX-XXXXXX or XXX-XXXXXX`
    },
    required: [true, 'Contact name is required']
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