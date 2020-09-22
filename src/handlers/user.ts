import IGenericResponse from "../types/response";
import { postFormData, get, post } from './api';

export function sendUserAvatar(form: FormData,username:string,token:string) {
    let data = {
        form,
        username,
        token
    }
    return postFormData<typeof data, IGenericResponse>(data, '/feed/user/send/avatar').then((res: any) => res.data);
}

export function followUser(username:string,userId:string,token:string) {
    let data = {
        userId,
        token
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/follow/${username}`,token).then((res:any) => res.data);
}

export function unfollowUser(username:string,userId:string,token:string) {
    let data = {
        userId,
        token
    }
    
    return post<typeof data,IGenericResponse>(data,`/feed/user/unfollow/${username}`,token).then((res:any) => res.data);
}


export function getSuggestedUsers(userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/suggested/${userId}`,token).then((res: any) => res.data);
}

export function getCurrentUserData(username:string,userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/${username}/data/as/${userId}`,token).then((res: any) => res.data);
}

export function getUserPostsRecent(startIndex:number,stopIndex:number,username:string,token:string){
    return get<IGenericResponse>(`/feed/user/posts/recent/${startIndex}/${stopIndex}/as/${username}`,token).then((res: any) => res.data);
}

export function getUserPostsPopular(startIndex:number,stopIndex:number,username:string,token:string){
    return get<IGenericResponse>(`/feed/user/posts/popular/${startIndex}/${stopIndex}/as/${username}`,token).then((res: any) => res.data);
}

export function getUserPostsSaved(startIndex:number,stopIndex:number,username:string,token:string){
    return get<IGenericResponse>(`/feed/user/posts/saved/${startIndex}/${stopIndex}/as/${username}`,token).then((res: any) => res.data);
}