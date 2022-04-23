import { Router , Request , Response } from 'express'
import userRoutes from './api/user.routes'

const routes = Router()

routes.use('/users', userRoutes)

export default routes
