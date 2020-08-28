import IGenericResponse from "./response";

export interface IAuthResponse extends IGenericResponse{
    token:string,
    user:{
        username:string,
        email:string,
        userId:string
    }
}

export interface ICreator {
    id:string,
    username:string,
}

export interface IEditProfileResponse extends IGenericResponse{
    user:{
        username:string,
        email:string
    }
}