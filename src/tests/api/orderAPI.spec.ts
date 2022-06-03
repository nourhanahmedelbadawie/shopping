import supertest from 'supertest'
import app from '../../server'
import { product } from '../../models/productModel'
import { users } from '../../models/userModel'
import { orders } from '../../models/orderModel'
import db from '../../database'
const request = supertest(app)

describe('Test Orders API', () => {
  const product: product = {
    name: 'T-shirt',
    description: 'Machester united t-shirt',
    price: 5.0,
    unit: 'PCS',
    category: 'wear'
  }
  const user1: users = {
    id: 1,
    firstname: 'Leo',
    lastname: 'Messy',
    username: 'LeoMessy1',
    password: '10'
  }
  const user2: users = {
    id: 2,
    firstname: 'Christiano',
    lastname: 'Ronaldo',
    username: 'ChristianoRonaldo1',
    password: '7'
  }
  const order: orders = { username: '', status: 'active' }
  let token1: string
  let token2: string
  let orderID: number

  beforeAll(async () => {
    //create user 1
    await request
      .post('/api/users')
      .send(user1)
      .then((res) => {
        token1 = res.body.token
        user1.id = res.body.id
        order.username = res.body.username
      })

    await request
      .post('/api/products')
      .send(product)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200)
      .then((res) => {
        product.id = res.body.id
      })
  })

  afterAll(async () => {
    try {
      const dbCon = await db.connect()
      await dbCon.query('DELETE FROM order_prod cascade;')
      await dbCon.query('alter sequence order_prod_id_seq RESTART WITH 1;')
      await dbCon.query('DELETE FROM orders cascade;')
      await dbCon.query('alter sequence orders_id_seq RESTART WITH 1;')
      await dbCon.query('DELETE FROM product cascade;')
      await dbCon.query('alter sequence product_id_seq RESTART WITH 1;')
      await dbCon.query('DELETE FROM users cascade;')
      await dbCon.query('alter sequence users_id_seq RESTART WITH 1;')
      dbCon.release()
    } catch (err) {
      console.log('Error :: ' + err)
    }
  })

  it('Success create order', async () => {
    await request
      .post('/api/orders')
      .send({ username: user1.username })
      .set('Authorization', `Bearer ${token1}`)
      .expect(200)
      .then((res) => {
        orderID = res.body.id
      })
  })

  it('Success show user orders', async () => {
    await request
      .get(`/api/orders/${orderID}`)
      .send({ username: user1.username })
      .set('Authorization', `Bearer ${token1}`)
      .expect(200)
  })

  it('Success add product to order when using a valid token with valid user name', async () => {
    await request
      .post('/api/orders/' + orderID + '/addproduct')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        productID: product.id,
        quantity: 6,
        username: user1.username
      })
      .expect(200)
      .then((res) => expect(res.text).toContain(product.id as unknown as string))
  })

  it('Fail add product to order when using a Invalid token with valid user name', async () => {
    await request
      .post('/api/orders/' + orderID + '/addproduct')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        productID: product.id,
        quantity: 6,
        username: user1.username
      })
      .expect(401)
  })

  it('Fail add product to order when using a valid token with Invalid user name', async () => {
    await request
      .post('/api/orders/' + orderID + '/addproduct')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        productID: product.id,
        quantity: 6,
        username: user2.username
      })
      .expect(401)
  })

  it('Success update order status with valid token', async () => {
    await request
      .put('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({ id: orderID, username: user1.username })
      .expect(200)
      .then((res) => {
        expect(res.text).toContain('complete')
      })
  })
  it('Fail add product to order when order have a "complete" status', async () => {
    await request
      .post('/api/orders/' + orderID + '/addproduct')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        productID: product.id,
        quantity: 6,
        username: user2.username
      })
      .expect(401)
  })
  it('Fail create order when token is missing', async () => {
    await request.post('/api/orders').send(order).expect(401)
  })

  it('Faile update when using invalid token', async () => {
    await request
      .put('/api/orders')
      .send(order)
      .set('Authorization', `Bearer ${token1}`)
      .expect(401)
  })

  it('Fail delete order when using invalid token', async () => {
    await request
      .delete('/api/orders/' + orderID)
      .send({ username: user1.username })
      .set('Authorization', `Bearer ${token2}`)
      .expect(401)
  })

  it('Fail delete order when using invalid username', async () => {
    await request
      .delete('/api/orders/' + orderID)
      .send({ username: 'invalidUserName' })
      .set('Authorization', `Bearer ${token1}`)
      .expect(401)
  })
  it('Success delete order ', async () => {
    await request
      .delete('/api/orders/' + orderID)
      .send({ username: user1.username })
      .set('Authorization', `Bearer ${token1}`)
      .expect(200)
  })
})
