import { IRegisterState, ILoginState } from "../interfaces/auth";
import { IValidationResult } from "../interfaces/validation";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isEmail = (str:string) => str.match(emailRegex) !== null;


export function validateRegister(state:IRegisterState){
    let result:IValidationResult = {
        success:false,
        errors:{}
    }

    //  EMAIL
    if(!isEmail(state.email)){
        result.errors.email = {content:'Invalid Email'} 
    }
    //  USERNAME
    if(state.username.length < 5 || state.username.length > 20){
        result.errors.username = {content:'Username must be between 5 and 20 characters long.'}
    }
    // PASSWORD
    if(state.password.length < 8){
        result.errors.password = {content:'Password must be at least 8 charachters long.'}
    }
    // REPEAT PASSWORD
    if((state.password.length === 0 && state.r_password.length === 0) || (state.r_password !== state.password)){
        result.errors.r_password = {content:'Password don\'t match.'}
    }
    //  NO ERROS
    if(Object.keys(result.errors).length === 0){
        result.success = true;
    }

    return result;
}

export function validateLogin(state:ILoginState){
    let result:IValidationResult = {
        success:false,
        errors:{}
    }

    //  EMAIL
    if(!isEmail(state.email)){
        result.errors.email = {content:'Invalid Email'} 
    }
    // PASSWORD
    if(state.password.length < 8){
        result.errors.password = {content:'Password must be at least 8 charachters long.'}
    }
    //  NO ERROS
    if(Object.keys(result.errors).length === 0){
        result.success = true;
    }

    return result;
}