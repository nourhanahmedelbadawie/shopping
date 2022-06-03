import supertest from 'supertest'
import app from '../../server'
import { product } from '../../models/productModel'
import { users } from '../../models/userModel'
import db from '../../database'
const request = supertest(app)
const product: product = {
  name: 'KB',
  description: 'keyboard',
  price: 5.0,
  unit: 'PCS',
  category: 'IT'
}
const user: users = {
  id: 1,
  firstname: 'Leo',
  lastname: 'Messy',
  username: 'LeoMessy',
  password: '10'
}
let token: string
let prodID: string
beforeAll(async () => {
  await request
    .post('/api/users')
    .send(user)
    .expect(200)
    .then((res) => {
      token = res.body.token as string
    })
})
afterAll(async () => {
  await request
  const dbCon = await db.connect()
  await dbCon.query('truncate table users cascade;')
  await dbCon.query('alter sequence users_id_seq RESTART WITH 1')
  await dbCon.release()
})

describe('Test Product API', () => {
  it('Success create a product', async () => {
    await request
      .post('/api/products')
      .send(product)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        prodID = res.body.id
      })
  })

  it('Success update a product', async () => {
    const product = {
      name: 'Mouse',
      description: 'Mouse',
      price: 5.0,
      unit: 'PCS',
      category: 'IT',
      id: prodID
    }
    await request
      .put('/api/products')
      .send(product)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((res) => {
        expect(res.text).toContain('Mouse')
      })
  })

  it('Fail update a product with missing product ID', async () => {
    const product = { name: 'Mouse', description: 'Mouse', price: 5.0, unit: 'PCS', category: 'IT' }
    await request
      .put('/api/products')
      .send(product)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
  })

  it('Failed show a non exist product', async () => {
    await request
      .get('/api/products/xyz')
      .send()
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
  })

  it('Success show a product with valid data', async () => {
    await request
      .get('/api/products/' + prodID)
      .send()
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('Success product index', async () => {
    await request
      .get('/api/products')
      .send()
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((res) => {
        expect(res.text).toContain('Mouse')
      })
  })

  it('Success delete a product with complete data', async () => {
    await request
      .delete('/api/products')
      .send({ id: prodID })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })
  it('Fail delete a product with incomplete data', async () => {
    await request
      .delete('/api/products')
      .send()
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
  })
})
