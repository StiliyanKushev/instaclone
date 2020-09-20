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

export function savePost(postId:string,userId:string,token:string){
    let data = {
        userId
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/save-post/${postId}`,token).then((res:any) => res.data);
}

export function likeComment(commentId:string,userId:string,token:string){
    let data = {
        userId
    }

    return post<typeof data,IGenericResponse>(data,`/feed/comments/${commentId}/like`,token).then((res:any) => res.data);
}

export function commentPost(postId:string,comment:string,userId:string,token:string,replyCommentId?:string){
    let data = {
        description:comment,
        userId,
        replyCommentId
    }

    return post<typeof data,IGenericResponse>(data,`/feed/posts/${postId}/comment`,token).then((res:any) => res.data);
}

export function renewOtherPost(id:string,others:[{
    likesCount: number;
    source: {
        data: any;
        contentType: string;
    };
    _id: string;
}],userId:string,token:string){

    let othersArr = [];

    for(let p of others){
        othersArr.push({_id:p._id})
    }


    let data = {
        userId,
        others:othersArr
    }

    return post<typeof data,IGenericResponse>(data,`/feed/posts/other/renew/${id}`,token).then((res:any) => res.data);
}

export function getOtherPosts(otherId:string,userId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/other/${otherId}/get/as/${userId}`,token).then((res:any) => res.data);
}

export function getPostData(postId:string,userId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/${postId}/get/as/${userId}`,token).then((res:any) => res.data);
}

export function getSubComments(startIndex:number,stopIndex:number,commentId:string,userId:string,token:string){
    return get<IGenericResponse>(`/feed/comments/${commentId}/subcomments/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getNewPostsChunk(startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/get/all/popular/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getUserLikesFromComment(startIndex:number,stopIndex:number,userId:string,commentId:string,token:string){
    return get<IGenericResponse>(`/feed/comments/${commentId}/likes/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getUserLikesFromPost(startIndex:number,stopIndex:number,userId:string,postId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/${postId}/likes/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function getNewCommentsChunk(startIndex:number,stopIndex:number,id:string,userId:string,token:string){
    return get<IGenericResponse>(`/feed/posts/${id}/comments/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}