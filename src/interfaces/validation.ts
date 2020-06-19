export interface IValidationResultErrors{
    [key:string]:{content:string}
}

export interface IValidationResult{
    success:boolean,
    errors: IValidationResultErrors // key - error
}