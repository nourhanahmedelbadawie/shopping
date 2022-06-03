import supertest from 'supertest'
import app from '../../server'
import { product, productModel } from '../../models/productModel'
import { userModel, users } from '../../models/userModel'
import { orderModel, orders } from '../../models/orderModel'
import db from '../../database'
import dashboard from '../../service/dashboard'

const request = supertest(app)
const prod1: product = {
  name: 'book',
  description: 'book',
  price: 5.0,
  unit: 'PCS',
  category: 'book'
}
const prod2: product = { name: 'pen', description: 'pen', price: 5.0, unit: 'PCS', category: 'pen' }
const prod3: product = {
  name: 'calculator',
  description: 'calculator',
  price: 5.0,
  unit: 'PCS',
  category: 'calculator'
}
const prod4: product = {
  name: 'envelop',
  description: 'envelop',
  price: 5.0,
  unit: 'PCS',
  category: 'envelop'
}
const prod5: product = {
  name: 'eraser',
  description: 'eraser',
  price: 5.0,
  unit: 'PCS',
  category: 'eraser'
}
const prod6: product = {
  name: 'binder',
  description: 'binder',
  price: 5.0,
  unit: 'PCS',
  category: 'envelop'
}
const userone: users = {
  username: 'userone',
  password: 'userone',
  firstname: 'user',
  lastname: 'one'
}
const order1: orders = { username: userone.username, status: 'active' }
const order2: orders = { username: userone.username, status: 'active' }
const dashboardService = new dashboard()
const Product = new productModel()
const Order = new orderModel()
//const User = new userModel()
let token: string

describe('Test Dashboard Service', () => {
  beforeAll(async () => {
    await request
      .post('/api/users')
      .send(userone)
      .then((res) => {
        token = res.body.token
        userone.id = res.body.id
      })
    const dbCon = await db.connect()
    //const user1 = await User.create(userone)
    const book = await Product.create(prod1)
    const pen = await Product.create(prod2)
    const calculator = await Product.create(prod3)
    const envelop = await Product.create(prod4)
    const eraser = await Product.create(prod5)
    const binder = await Product.create(prod6)
    const orderone = await Order.create(order1.username)
    const ordertow = await Order.create(order2.username)
    await Order.addProduct(book.id as number, orderone.id as number, 2)
    await Order.addProduct(pen.id as number, orderone.id as number, 2)
    await Order.addProduct(calculator.id as number, orderone.id as number, 2)
    await Order.addProduct(book.id as number, ordertow.id as number, 3)
    await Order.addProduct(binder.id as number, ordertow.id as number, 3)
    await Order.addProduct(envelop.id as number, ordertow.id as number, 3)
    await Order.addProduct(eraser.id as number, ordertow.id as number, 3)
    await Order.update(orderone)
    dbCon.release()
  })

  afterAll(async () => {
    const dbCon = await db.connect()
    await dbCon.query('truncate table users cascade')
    await dbCon.query('truncate table product cascade')
    await dbCon.query('truncate table orders cascade')
    dbCon.release()
  })

  it('Test user completed order method', async () => {
    await request
      .get('/api/orders/complete')
      .send({ username: userone.username })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('Test user active order method', async () => {
    await request
      .get('/api/orders/active')
      .send({ username: userone.username })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('Test top 5 products end point method', async () => {
    await request.get('/api/products/top5').expect(200)
  })

  it('Test index product by category end point', async () => {
    await request.post('/api/products/envelop').expect(200)
  })

  it('Fail index product by category end point when missing category', async () => {
    await request.post('/api/products').expect(400)
  })
})
