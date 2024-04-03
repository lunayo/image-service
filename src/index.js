const express = require('express')
const image = require('./routers/imageRouter')

const app = express()

app.use(express.json())
app.use(image)

app.listen(3000, () => {
  console.log(`Images service app listening`)
})