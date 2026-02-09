--user table
CREATE type user_role as ENUM ('ADMIN', 'USER');
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
--party table
CREATE type party_type as ENUM ('CUSTOMER', 'SUPPLIER');
CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type party_type NOT NULL,
    phone VARCHAR(30),
    address TEXT
);
--product table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sale_price NUMERIC(10, 2) NOT NULL,
    purchase_price NUMERIC(10, 2) NOT NULL,
    current_stock INTEGER DEFAULT 0 check (current_stock >= 0)
);
--invoice table
CREATE type invoice_type as ENUM ('SALE', 'PURCHASE');
CREATE type invoice_status as ENUM ('PAID', 'UNPAID');
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) CHECK (type IN ('SALE', 'PURCHASE')),
    invoice_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(30) NOT NULL,
    notes TEXT,
    party_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    CONSTRAINT fk_invoice_party FOREIGN KEY (party_id) REFERENCES parties(id),
    CONSTRAINT fk_invoice_user FOREIGN KEY (created_by) REFERENCES users(id)
);
--invoice items table
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    price NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_item_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id)
);
--payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_payment_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
--trigger function to update product stock
CREATE OR REPLACE FUNCTION update_stock_from_items() RETURNS TRIGGER AS $$
DECLARE invoice_type VARCHAR;
BEGIN
SELECT type INTO invoice_type
FROM invoices
WHERE id = NEW.invoice_id;
IF invoice_type = 'SALE' THEN
UPDATE products
SET current_stock = current_stock - NEW.qty
WHERE id = NEW.product_id;
ELSIF invoice_type = 'PURCHASE' THEN
UPDATE products
SET current_stock = current_stock + NEW.qty
WHERE id = NEW.product_id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--trigger
CREATE TRIGGER trg_update_stock
AFTER
INSERT ON invoice_items FOR EACH ROW EXECUTE FUNCTION update_stock_from_items();