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
CREATE type invoice_type as ENUM ('SALE', 'PURCHASE', 'INTERNAL');
CREATE type invoice_status as ENUM ('PAID', 'UNPAID');
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    type invoice_type NOT NULL,
    invoice_date TIMESTAMP DEFAULT NOW(),
    status invoice_status,
    notes TEXT,
    party_id INTEGER,
    created_by INTEGER NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_invoice_party FOREIGN KEY (party_id) REFERENCES parties(id),
    CONSTRAINT fk_invoice_user FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT check_party_logic check (
        (
            type = 'INTERNAL'
            and party_id is null
            and status is null
        )
        or (
            type != 'INTERNAL'
            and party_id is not null
            and status is not null
        )
    )
);
--invoice items table
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    line_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
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
CREATE OR REPLACE FUNCTION manage_stock() RETURNS TRIGGER AS $$
DECLARE invoice_type_value invoice_type;
stock_change INTEGER;
BEGIN
SELECT type INTO invoice_type_value
FROM invoices
WHERE id = NEW.invoice_id;
IF invoice_type_value = 'PURCHASE' THEN stock_change := 1;
ELSIF invoice_type_value IN ('SALE', 'INTERNAL') THEN stock_change := -1;
ELSE RETURN NEW;
END IF;
UPDATE products
SET current_stock = current_stock + (stock_change * NEW.qty)
WHERE id = NEW.product_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_manage_stock
AFTER
INSERT ON invoice_items FOR EACH ROW EXECUTE FUNCTION manage_stock();