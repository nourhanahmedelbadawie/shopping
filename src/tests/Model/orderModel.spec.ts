import { orders, orderModel } from '../../models/orderModel'
import { userModel, users } from '../../models/userModel'
import { productModel, product } from '../../models/productModel'
import db from '../../database'

const Order = new orderModel()
const User = new userModel()
const Product = new productModel()
const testUser: users = {
  id: 1,
  firstname: 'test',
  lastname: 'test',
  username: 'test',
  password: 'test'
}
const testOrder: orders = { id: 1, username: testUser.username, status: 'active' }
const testProduct: product = {
  id: 1,
  name: 'test',
  description: 'test',
  price: 5.0,
  unit: 'PCS',
  category: 'test'
}

describe('Test Order Model', () => {
  beforeAll(async () => {
    const newUser = await User.create(testUser)
    testUser.id = newUser.id
    const newProduct = await Product.create(testProduct)
    testProduct.id = newProduct.id
    const newOrder = await Order.create(testUser.username)
    testOrder.id = newOrder.id
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
  //test create method
  it('Should have create order method', async () => {
    expect(Order.create).toBeDefined()
  })
  it('Should create order', async () => {
    const order = await Order.create(testUser.username)
    expect(order.username).toBe(testOrder.username)
    expect(order.status).toBe(testOrder.status)
  })

  //test index method
  it('Should have index order method', async () => {
    expect(Order.index).toBeDefined()
  })
  it('Test index order', async () => {
    const orders = await Order.index(testUser.username)
    expect(orders.length).toEqual(2)
  })
  //test get order status method
  it('Should have get order status method', async () => {
    expect(Order.GetOrderstatus).toBeDefined()
  })
  it('Test get order status', async () => {
    const status = await Order.GetOrderstatus(testOrder.id as unknown as number)
    expect(status).toBe(testOrder.status)
  })
  //test add product to order method
  it('Should have addProduct to order method ', async () => {
    expect(Order.addProduct).toBeDefined()
  })
  it('Should add product to order product list if status is active', async () => {
    const addedprod = await Order.addProduct(
      testProduct.id as unknown as number,
      testOrder.id as unknown as number,
      1
    )
    expect(addedprod?.product_id).toBe(testProduct.id)
  })
  //test update method
  it('Should have update order method', async () => {
    expect(Order.update).toBeDefined()
  })
  it('Should update order', async () => {
    const updatedOrder = await Order.update(testOrder)

    expect(updatedOrder.status).toBe('complete')
  })

  //tets show method
  it('Should have show order method', async () => {
    expect(Order.show).toBeDefined()
  })
  it('Should show order', async () => {
    const order = await Order.show(testUser.username, testOrder.id as unknown as number)
    expect(order).not.toBeNull()
  })
  //test delete method
  it('Should have delete order method', async () => {
    expect(Order.delete).toBeDefined()
  })
  it('Should delete order', async () => {
    const newOrder = await Order.create(testOrder.username)
    const deletedOrder = await Order.delete(newOrder.id as unknown as number, testUser.username)
    expect(deletedOrder).toEqual(newOrder)
  })
})
