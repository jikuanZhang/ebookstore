CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(120),
    nickname VARCHAR(80),
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS books (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(120) NOT NULL,
    author VARCHAR(120) NOT NULL,
    publisher VARCHAR(120),
    isbn VARCHAR(40) UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    cover VARCHAR(255),
    description VARCHAR(1000),
    category VARCHAR(80),
    intro VARCHAR(1000),
    audience VARCHAR(500),
    reason VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT uk_cart_user_book UNIQUE (user_id, book_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_cart_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    number VARCHAR(40) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    book_title VARCHAR(120) NOT NULL,
    book_author VARCHAR(120) NOT NULL,
    book_cover VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_item_book FOREIGN KEY (book_id) REFERENCES books(id)
);
