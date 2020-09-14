import IGenericResponse from "../types/response";
import { postFormData, get } from './api';

export function sendUserAvatar(form: FormData,username:string,token:string) {
    let data = {
        form,
        username,
        token
    }
    return postFormData<typeof data, IGenericResponse>(data, '/feed/user/send/avatar').then((res: any) => res.data);
}

export function getSuggestedUsers(userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/suggested/${userId}`,token).then((res: any) => res.data);
}

export function getUserPostsRecent(startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/posts/recent/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getUserPostsPopular(startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/posts/popular/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getUserPostsSaved(startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/posts/saved/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}