import { IHomeState } from "../components/HomeView/HomeView";
import { IValidationResult } from "../types/form-validation";

export function validatePostCreate(state: IHomeState){
    let result:IValidationResult = {
        success:false,
        errors:{}
    }
    
    if(state.postDescription.trim().length < 5 || state.postDescription.trim().length > 300){
        result.errors.postDescription = {content:'Description should be between 5 and 300 charachters long.'}
    }

    //  NO ERROS
    if(Object.keys(result.errors).length === 0){
        result.success = true;
    }

    return result;
}