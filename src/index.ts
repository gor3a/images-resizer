import express, { Application, Request, Response } from 'express'
import * as dotenv from 'dotenv'
import routes from './routes/api'

dotenv.config()

const PORT = process.env.PORT || 3000
const app: Application = express()

app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is starting at Port:${PORT}`)
})

export default app
