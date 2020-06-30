import IGenericResponse from "./response";

export interface IAuthResponse extends IGenericResponse{
    token:string,
    user:{
        username:string,
        email:string,
    }
}

export interface IEditProfileResponse extends IGenericResponse{
    user:{
        username:string,
        email:string
    }
}