import { productModel, product } from '../../models/productModel'
import db from '../../database'

const testProduct: product = {
  name: 'product',
  description: 'product description',
  price: 5.0,
  unit: 'PCS',
  category: 'category'
}
const Product = new productModel()
beforeAll(async () => {
  const newProduct = await Product.create(testProduct)
  testProduct.id = newProduct.id
})

afterAll(async () => {
  const dbCon = await db.connect()
  await dbCon.query('DELETE FROM product')
  await dbCon.query('alter sequence product_id_seq RESTART WITH 1')
  await dbCon.release()
})

describe('Test Product Model', () => {
  //test create method
  it('Should have create product method', async () => {
    expect(Product.create).toBeDefined()
  })
  it('test Create with a product', async () => {
    const createdProduct = {
      name: 'product',
      description: 'product description',
      price: 5.0,
      unit: 'PCS',
      category: 'category'
    }
    const product = await Product.create(createdProduct)
    expect(product.category).toBe(testProduct.category)
    expect(product.description).toBe(testProduct.description)
    expect(product.name).toBe(testProduct.name)
    expect(product.unit).toBe(testProduct.unit)
  })

  //test index method
  it('Should have index product method', async () => {
    expect(Product.index).toBeDefined()
  })
  it('Test index with a product', async () => {
    const products = await Product.index()
    expect(products.length).toBe(1)
  })

  //test show method
  it('Should have show product method', async () => {
    expect(Product.show).toBeDefined()
  })
  it('test show with a product', async () => {
    const product = await Product.show(testProduct.id as unknown as number)
    expect(product.category).toEqual(testProduct.category)
    expect(product.description).toEqual(testProduct.description)
    expect(product.name).toEqual(testProduct.name)
    expect(product.unit).toEqual(testProduct.unit)
    expect(parseFloat(product.price as unknown as string)).toEqual(testProduct.price)
  })

  //test update method
  it('Should update a product', async () => {
    expect(Product.update).toBeDefined()
  })
  it('Test update with a product', async () => {
    const updatedProduct = {
      name: 'uproduct',
      description: 'uproduct description',
      price: 10,
      unit: 'PCS',
      category: 'category',
      id: testProduct.id as unknown as number
    }
    const product = await Product.update(updatedProduct)
    expect(product.category).toEqual(updatedProduct.category)
    expect(product.description).toEqual(updatedProduct.description)
    expect(product.name).toEqual(updatedProduct.name)
    expect(product.unit).toEqual(updatedProduct.unit)
    expect(parseFloat(product.price as unknown as string)).toEqual(updatedProduct.price)
  })
})
