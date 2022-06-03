import orderRoute from '../../handlers/orderHandler'
import { Router } from 'express'
import verifyAuthToken from '../../middleware/authorization'
import dashboard from '../../handlers/dashboard'

const routes = Router()

routes.get('/complete', dashboard.completeOrders)
routes.get('/active', dashboard.activeOrders)

routes.get('/:id', orderRoute.show)
routes.get('/', orderRoute.index)

routes.post('/', orderRoute.create)

routes.post('/:orderID/addproduct', orderRoute.addProduct)
routes.put('/', orderRoute.complete)

routes.delete('/:id', orderRoute.del)

export default routes
