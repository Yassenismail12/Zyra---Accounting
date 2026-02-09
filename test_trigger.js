//----thisfile is to test database----//
import pkg from 'pg';
const { Pool } = pkg;

// Connection configuration based on docker-compose.yml
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'accounting_db',
    password: 'postgres',
    port: 5432,
});

async function runTest() {
    const client = await pool.connect();

    try {
        console.log('Connected to database');

        // Start transaction
        await client.query('BEGIN');

        // 1. Create a Dummy User (Required for Invoice)
        // Using ON CONFLICT DO NOTHING to avoid errors if re-run (requires unique constraints)
        // Since email is unique, we can use that.
        const userRes = await client.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ('Test Admin', 'admin@test.com', 'hashed_pass', 'ADMIN')
            ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
            RETURNING id;
        `);
        // If it existed, we need to fetch the ID.
        let userId = userRes.rows[0]?.id;
        if (!userId) {
            const u = await client.query("SELECT id FROM users WHERE email = 'admin@test.com'");
            userId = u.rows[0].id;
        }
        console.log(`User ID: ${userId}`);

        // 2. Create a Dummy Party (Customer)
        const partyRes = await client.query(`
            INSERT INTO parties (name, type, phone)
            VALUES ('Test Customer', 'CUSTOMER', '555-0199')
            RETURNING id;
        `);
        const partyId = partyRes.rows[0].id;
        console.log(`Party ID: ${partyId}`);

        // 3. Create a Dummy Product
        const initialStock = 100;
        const productRes = await client.query(`
            INSERT INTO products (name, sale_price, purchase_price, current_stock)
            VALUES ('Test Widget', 10.00, 5.00, $1)
            RETURNING id;
        `, [initialStock]);
        const productId = productRes.rows[0].id;
        console.log(`Product ID: ${productId} (Stock: ${initialStock})`);

        // 4. Create a Sale Invoice
        const invoiceRes = await client.query(`
            INSERT INTO invoices (type, status, party_id, created_by)
            VALUES ('SALE', 'UNPAID', $1, $2)
            RETURNING id;
        `, [partyId, userId]);
        const invoiceId = invoiceRes.rows[0].id;
        console.log(`Invoice ID: ${invoiceId} (Type: SALE)`);

        // 5. Add Invoice Item (This triggers the stock update)
        const qtySold = 5;
        await client.query(`
            INSERT INTO invoice_items (invoice_id, product_id, qty, price)
            VALUES ($1, $2, $3, 10.00);
        `, [invoiceId, productId, qtySold]);
        console.log(`Added Item: Sold ${qtySold} units`);

        // 6. Verify Stock Update
        const checkRes = await client.query(`SELECT current_stock FROM products WHERE id = $1`, [productId]);
        const newStock = checkRes.rows[0].current_stock;

        console.log('------------------------------------------------');
        if (newStock === initialStock - qtySold) {
            console.log(`TEST PASSED: Stock updated from ${initialStock} to ${newStock}`);
        } else {
            console.error(`TEST FAILED: Stock is ${newStock}, expected ${initialStock - qtySold}`);
        }
        console.log('------------------------------------------------');

        // Rollback transaction to keep DB clean (optional - set to COMMIT to keep data)
        await client.query('COMMIT');

    } catch (e) {
        console.error('Error during test:');
        console.error(e);
        if (e.code) console.error(`Error Code: ${e.code}`);
        if (e.detail) console.error(`Detail: ${e.detail}`);
        try {
            await client.query('COMMIT');
        } catch (Error) {
            console.error('Error during COMMIT:', Error);
        }
    } finally {
        client.release();
        await pool.end();
    }
}

runTest();