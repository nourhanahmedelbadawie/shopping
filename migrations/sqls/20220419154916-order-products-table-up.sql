/* Replace with your SQL commands */
CREATE TABLE order_products(
    id SERIAL PRIMARY KEY ,
    items_count int,
    product_price double precision,
    order_id int,
    product_id int,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)