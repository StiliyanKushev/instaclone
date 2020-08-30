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

export function likePost(postId:string,userId:string,token:string){
    let data = {
        userId
    }

    return post<typeof data,IGenericResponse>(data,`/feed/posts/${postId}/like`,token).then((res:any) => res.data);
}

export function likeComment(commentId:string,userId:string,token:string){
    let data = {
        userId
    }

    return post<typeof data,IGenericResponse>(data,`/feed/comments/${commentId}/like`,token).then((res:any) => res.data);
}

export function commentPost(postId:string,comment:string,userId:string,token:string){
    let data = {
        description:comment,
        userId
    }

    return post<typeof data,IGenericResponse>(data,`/feed/posts/${postId}/comment`,token).then((res:any) => res.data);
}

export function getNewPostsChunk(startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/get/all/popular/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getUserLikesFromPost(startIndex:number,stopIndex:number,userId:string,postId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/${postId}/likes/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getNewCommentsChunk(startIndex:number,stopIndex:number,id:string,userId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/${id}/comments/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}