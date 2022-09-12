const express = require('express')
const cors = require('cors')

const app = express()

//config JSON response
app.use(express.json())

//solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))
app.use(express.static('public'))

//routes

app.listen(5000)