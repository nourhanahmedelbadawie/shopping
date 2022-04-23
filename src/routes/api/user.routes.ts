import { Router, Request, Response } from 'express'
import UserModel from '../../models/user.model'
import * as dotenv from 'dotenv'

dotenv.config()
const routes = Router()

routes.get('/', (req: Request, res: Response) => {
  res.json({ message: 'success' })
})
const jwt = require('jsonwebtoken')
const userModel = new UserModel()

// sign up
routes.post('/signup', (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { email, password, user_name, first_name, last_name } = req.body
    const userData = userModel.signUp({ email, password, user_name, first_name, last_name })
    const token = jwt.sign({ userData }, process.env.SECRET_TOKEN) as string

    if (userData)
      return res.json({
        status: 'success',
        data: { user: userData, token: token }
      })
    throw new Error(`Error`)
  } catch (err) {
    console.log(err)
  }
})

// Login
routes.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const userData = userModel.loginUser(email, password)
    const token = jwt.sign({ userData }, process.env.SECRET_TOKEN) as string
    if (userData)
      return res.json({
        status: 'success',
        data: { user: userData, token: token }
      })
    throw new Error(`Error  , ${email}not found `)
  } catch (err) {
    console.log(err)
  }
})

export default routes
