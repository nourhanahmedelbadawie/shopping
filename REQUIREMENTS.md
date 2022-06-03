# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

# API Endpoints

### **Products**


| End Point	| Description | Method | Parameters | Token Requird |Example |Request Body |
| --------- | ----------- | ------ | ---------- | ------------- | ------ | ----------- |
| Index | Index of all products | GET | none | no | ***/api/products |
| Show | Shows a single product based on product's id | GET | :id |no | ***/api/products/1 |
| Create | Creates new product |POST |none |yes | ***/api/products |{"name","description","price","unit",category"}
| Update    |Updates existing product information |PUT |none |yes |***/api/products		|{"name","description","price","unit","category","id"}
| Delete    |Deletes Product |DELETE |none |yes |***/api/products |{"id"}         


### **Users**

| End Point | Description | Method |Parameters |Token Requird |Example |Request Body |
|--------- | ----------- | ------ | ---------- | ------------- | ------ | ----------- |
| Index     | Index of all users       				|GET        |none       |yes             |***/api/users 		|
| Show      | Shows current user info |GET |:username  |yes |***/api/users/1	    |
| Create    |Creates new user and generate token	|POST       |none       |no              |***/api/users		    |{"firstname","lastname","username","password"}
| Login    |Login user and generate token           |POST       |none       |no              |***/api/users/login	|{"username","password"}

### **Orders**

| End Point	| Description | Method    |Parameters	|Token_Requird	|Example    						|Request Body
| --------- | ----------- | ---------- | ---------- | ------------- | ------ | ----------- |
| Index     |index of all order for current signed user	|GET        |none       |yes             |***/api/orders		        |{"username"}
| Show      |show one user's order include products |GET        |:id        |yes             |***/api/orders/1	            |{"username"}
| Create    |Creates new order       				|POST       |none       |yes             |***/api/orders		        |{"username"}
| Update    |Updates existing order status to 'complete'   |PUT        |none       |yes             |***/api/orders		        |{"id","username"}
| Delete    |Deletes order and children products	|DELETE     |:id        |yes              |***/api/orders/1		        |{"username}
| Add prod  |Add child product to 'active' order where :id is order id 			|POST	    |:id        |yes              |***/api/orders/1/addproduct	|{"productID","quantity","username"}    


## **specail endpoints**

| End Point	|	Description            				| Method    |Parameters	|Token_Requird	|Example    						|Request Body
| --------- | ----------- | ---------- | ---------- | ------------- | ------ | ----------- |
| Top5		|Gets most 5 requested products			|GET	    |none       |yes            |***/api/products/top5	|       
| Category	|lists products in certain category		|POST	    |:category  |yes            |***/api/products/it	| 
| Complete	|lists user's completed orders  		|GET	    |none       |yes             |***/api/orders/complete	    |{"username}
| Active	|lists user's active orders     		|GET	    |none       |yes             |***/api/orders/active	        |{"username}

## Data Shapes
#### **Product**

|Name |Type 
|:----|:----        
|id |integer |Primary key 
|name |varchar | 
|description |varchar |
|price |numeric |
|unit |varchar |
|category |varchar |

#### **Users**

|Name            |Type | info.        
| ---------------| ----|:-------------        
|id              |integer          |Primary key 
|firstname       |varchar          |UNIQUE
|lastname        |varchar          |
|username        |varchar          |
|password        |varchar          |NOT NULL

#### **Orders**

|Name            |Type | info.       
| ---------------| ----|:-------------        
|id              |integer          |Primary key 
|username         |integer          |NOT NULL - Foriegn KEy (users.username)
|status          |varchar          |

#### **order_prod**

|Name            |Type | info.         
|:---------------|:--- |:-------------      
|id              |integer          |Primary key 
|order_id        |integer          |Foriegn KEy (orders.id)
|product_id      |integer          |Foriegn KEy (product.id)
|quantity        |integer          |NOT NULL

