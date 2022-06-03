import productRoute from '../../handlers/productHandler'
import { Router } from 'express'
import dashboard from '../../handlers/dashboard'

const routes = Router()

routes.get('/top5', dashboard.topfive)

routes.post('/:category', dashboard.productByCategory)

routes.get('/', productRoute.index)

routes.get('/:id', productRoute.show)

routes.post('/', productRoute.create)

routes.put('/', productRoute.update)

routes.delete('/', productRoute.del)

export default routes
