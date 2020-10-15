import IGenericResponse from '../types/response';
import { post } from './api';


export function saveUserToDirect(username:string,userId:string,token:string){
    let data = {
        userId,
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/inbox/add/${username}`,token).then((res:any) => res.data);
}