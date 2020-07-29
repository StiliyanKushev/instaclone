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

export function commentPost(postId:string,comment:string,username:string,token:string){
    let data = {
        description:comment,
        username
    }
    console.log(postId,data);
    return post<typeof data,IGenericResponse>(data,`/feed/posts/${postId}/comment`,token).then((res:any) => res.data);
}

export function getNewPostsChunk(startIndex:number,stopIndex:number,token:string){
    return get<IGenericResponse>(`/feed/posts/get/all/popular/${startIndex}/${stopIndex}`,token).then((res: any) => res.data);
}