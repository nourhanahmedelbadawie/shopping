import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import errorMiddleWare from './middleWare/error.middleWare'
import db from './database'
import routes from './routes'
dotenv.config()

const PORT = process.env.PORT || 3000
// create an instance server
const app: Application = express()
// HTTP request logger middleware
app.use(morgan('short'))
app.use(express.json()) // for application/json

// add routing for / path
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World 🌍'
  })
})

db.connect().then((client) => {
  return client.query('SELECT NOW()').then((res) => {
    client.release()
    console.log(res.rows)
  })
})
// routes
app.use('/base', routes)

//Handel Error
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Error occure please check you request' })
})
// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at prot:${PORT}`)
})

app.use(errorMiddleWare)
export default app
