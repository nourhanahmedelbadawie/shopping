import supertest from 'supertest'
import app from '../../server'
import { users } from '../../models/userModel'
import Jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import db from '../../database'

dotenv.config()
const request = supertest(app)

describe('Test User API', () => {
  const user1: users = {
    id: 1,
    firstname: 'Leo',
    lastname: 'Messy',
    username: 'LeoMessy1',
    password: '10'
  }
  const user2: users = {
    id: 1,
    firstname: 'Samer',
    lastname: 'Magdy',
    username: 'SamerMagdy',
    password: '10'
  }
  let token1: string
  let token2: string
  let user2id: string

  beforeAll(async () => {
    await request
      .post('/api/users')
      .send(user1)
      .then((res) => {
        user1.id = res.body.id
        token1 = res.body.token
      })
  })
  afterAll(async () => {
    const dbCon = await db.connect()
    await dbCon.query('truncate table users cascade;')
    await dbCon.query('alter sequence users_id_seq RESTART WITH 1')
    await dbCon.release()
  })

  it('Success create a user and validate token', async () => {
    await request
      .post('/api/users')
      .send(user2)
      .expect(200)
      .then((res) => {
        token2 = res.body.token
        user2id = res.body.id
        const isValid = Jwt.verify(token2, process.env.JWT_SECRET as string)
        expect(isValid).toBeTruthy()
      })
  })

  it('Success login user and validate token', async () => {
    await request
      .post('/api/users/login')
      .send({ username: 'SamerMagdy', password: '10' })
      .expect(200)
      .then((res) => {
        const vtoken = res.body.token
        const isValid = Jwt.verify(vtoken, process.env.JWT_SECRET as string)
        expect(isValid).toBeTruthy()
        user2id = res.body.id
      })
  })

  it('Failed show non exist user', async () => {
    await request
      .get('/api/users/oos')
      .set('Authorization', 'Bearer ' + token1)
      .send()
      .expect(400)
  })

  it('Success show a user with valid data', async () => {
    await request
      .get('/api/users/' + user1.username)
      .set('Authorization', 'Bearer ' + token1)
      .send()
      .expect(200)
  })

  it('Success user index', async () => {
    await request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token1)
      .send()
      .expect(200)
      .then((res) => {
        expect(res.text).toContain('Leo')
      })
  })
  it('Fail user index for missing token', async () => {
    await request.get('/api/users').send().expect(401)
  })

  it('Fail user index for invalid or fake token', async () => {
    await request
      .get('/api/users')
      .set('Authorization', 'Bearer 12344fakettoken43321')
      .send()
      .expect(401)
  })
})
