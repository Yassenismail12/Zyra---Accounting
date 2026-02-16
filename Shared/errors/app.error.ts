
export class AppError extends Error{
    status:number
    errors: object

    constructor(msg:string,status:number,errors?:object){
        super(msg)
        this.status=status || 500
        this.errors=errors || {}
    }
}