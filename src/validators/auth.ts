import { IValidationResult } from "../types/form-validation";
import { IRegisterState } from "../components/RegisterView/RegisterView";
import { ILoginState } from "../components/LoginView/LoginView";
import { IChangePasswordState } from "../components/ChangePassword/ChangePassword";
import { IEditProfileState } from "../components/EditProfile/EditProfile";
import { IForgotPasswordState } from "../components/ForgotPassword/ForgotPassword";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

export function validateChangePassword(state:IChangePasswordState){
    let result:IValidationResult = {
        success:false,
        errors:{}
    }

    // CURRENT PASSWORD
    if(state.currentPassword.length < 8){
        result.errors.currentPassword = {content:'Password must be at least 8 charachters long.'}
    }
    // NEW PASSWORD
    if(state.newPassword.length < 8){
        result.errors.newPassword = {content:'New password must be at least 8 charachters long.'}
    }
    // REPEAT PASSWORD
    if((state.newPassword.length === 0 && state.repeatNewPassword.length === 0) || (state.repeatNewPassword !== state.newPassword)){
        result.errors.repeatNewPassword = {content:'Password don\'t match.'}
    }
    //  NO ERROS
    if(Object.keys(result.errors).length === 0){
        result.success = true;
    }

    return result;
}

export function validateEditProfile(state:IEditProfileState){
    let result:IValidationResult = {
        success:false,
        errors:{}
    }

    // PASSWORD
    if(state.password.length < 8){
        result.errors.password = {content:'Password must be at least 8 charachters long.'}
    }
    //  EMAIL
    if(!isEmail(state.email)){
        result.errors.email = {content:'Invalid Email'} 
    }
    //  USERNAME
    if(state.username.length < 5 || state.username.length > 20){
        result.errors.username = {content:'Username must be between 5 and 20 characters long.'}
    }
    //  NO ERROS
    if(Object.keys(result.errors).length === 0){
        result.success = true;
    }

    return result;
}

export function validateForgotPassword(state:IForgotPasswordState){
    let result:IValidationResult = {
        success:false,
        errors:{}
    }

    //  EMAIL
    if(!isEmail(state.email)){
        result.errors.email = {content:'Invalid Email'} 
    }
    //  NO ERROS
    if(Object.keys(result.errors).length === 0){
        result.success = true;
    }

    return result;
}