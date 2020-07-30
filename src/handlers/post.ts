import IGenericResponse from "../types/response";
import { postFormData, get, post } from "./api";

export function uploadPost(form: FormData,username:string,token:string) {
    let data = {
        form,
        username,
        token
    }
    return postFormData<typeof data, IGenericResponse>(data, '/feed/posts/create').then((res: any) => res.data);
}

export function likePost(postId:string,username:string,token:string){
    let data = {
        username
    }

    return post<typeof data,IGenericResponse>(data,`/feed/posts/${postId}/like`,token).then((res:any) => res.data);
}

export function commentPost(postId:string,comment:string,username:string,token:string){
    let data = {
        description:comment,
        username
    }

    return post<typeof data,IGenericResponse>(data,`/feed/posts/${postId}/comment`,token).then((res:any) => res.data);
}

export function getNewPostsChunk(startIndex:number,stopIndex:number,username:string,token:string){
    return get<IGenericResponse>(`/feed/posts/get/all/popular/${startIndex}/${stopIndex}/as/${username}`,token).then((res: any) => res.data);
}