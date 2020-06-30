import { IValidationResultErrors } from "./form-validation";

export default interface IGenericResponse {
    success: boolean,
    messege: string,
    errors?: IValidationResultErrors
}