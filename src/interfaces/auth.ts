export interface IAuthResponse{
    messege:string,
    success:boolean,
    token:string,
    user:{
        username:string,
        email:string,
    }
}