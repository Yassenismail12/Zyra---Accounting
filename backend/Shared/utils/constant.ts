
export const ValidationError = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
}

export const UserError = {
    USER_NOT_FOUND: "User not found",
    PASSWORD_DO_NOT_MATCH: "Passwords don't match",
    USER_ALREADY_EXSITS: "User already exsits",

}

export const AuthErrors = {
    INVALID_TOKEN: 'Invalid Token',
    NO_TOKEN_PROVIDED: "No token provided",
    ACCESS_DENIED: "Access denied"
}

export const UserSuccess = {
    CREATE_USER_SUCCESS: 'Create User Successful'
}

export const PartiesError = {
    PARTIES_ALREADY_EXSITS: "Name of Party already exsits",
    PARTIES_NOT_FOUND: "Party not found",
    INVALID_ID: "Invalid Id"
}

export const PartiesSuccess = {
    CREATE_PARTIES_SUCCESS: 'Create Party Successful'
}

export const ProductsError = {
    PRODUCTS_ALREADY_EXSITS: "Name of Product already exsits",
    PRODUCT_NOT_FOUND: "Product not found",
    INVALID_ID: "Invalid Id"
}

export const ProductsSuccess = {
    CREATE_PRODUCTS_SUCCESS: 'Create Product Successful'
}

export const InvoicesError = {
    INVOICES_NOT_FOUND: "Invoices not found",
}

export const InvoicesSuccess = {
    CREATE_INVOICES_SUCCESS: 'Create Invoices Successful'
}

export const PaymentError = {
    PAYMENT_NOT_FOUND : 'Payment not found for this Invoice',
    INVOICE_OVERPAID: "Invoice has already been overpaid.",
    INVOICE_PAID : "Invoice is already fully paid.",
    PAY_MORE_REMAINING : "You cannot pay more than the remaining amount."
}
