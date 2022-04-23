/* Replace with your SQL commands */
CREATE TABLE orders(
    id SERIAL PRIMARY KEY ,
    order_status VARCHAR(50),
    total_price double precision,
    user_id int,
    FOREIGN KEY (user_id) REFERENCES users(id)
)