import pool from "../../db";
import { StatusCode } from "../../Shared/enums/statusCode.enum";
import { AppError } from "../../Shared/errors/app.error";
import { ProductsError, ProductsSuccess } from "../../Shared/utils/constant";
import { addProductDTO } from "./dto/addProduct.dto";

export class ProductService {

    public async createProduct(dto: addProductDTO) {

        const { name, sale_price, purchase_price, current_stock } = dto

        const result = await pool.query(
            `SELECT * FROM products WHERE name = $1`,
            [name]
        );

        if (result.rows.length > 0)
            throw new AppError(ProductsError.PRODUCTS_ALREADY_EXSITS, StatusCode.CONFLICT, result.rows)

        await pool.query(
            `INSERT INTO products (name, sale_price, purchase_price, current_stock)
            VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, sale_price, purchase_price, current_stock]
        )

        return { message: ProductsSuccess.CREATE_PRODUCTS_SUCCESS }

    }

    public async getAllProducts() {
        const result = await pool.query("select * from products ")

        return { products: result.rows }
    }

    public async getProductById(id: number) {

        const result = await pool.query("select * from products where id = $1", [id])

        const product = result.rows[0];

        if (!product)
            throw new AppError(ProductsError.PRODUCT_NOT_FOUND, StatusCode.NOT_FOUND)

        return { product }
    }
} 