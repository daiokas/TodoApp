const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
 text: {
   type: String
 },
 completed: {
   type: Boolean
 },
})

module.exports = todoSchema