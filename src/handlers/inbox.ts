import IGenericResponse from '../types/response';
import { post, get } from './api';


export function saveUserToDirect(username:string,userId:string,token:string){
    let data = {
        userId,
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/inbox/add/${username}`,token).then((res:any) => res.data);
}

export function getNewDirectsChunk(startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/directs/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}