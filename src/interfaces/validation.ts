export interface IValidationResultErrors{
    [key:string]:{content:string}
}

export interface IValidationResult{
    success:boolean,
    messege:string,
    errors: IValidationResultErrors // key - error
}