import IGenericResponse from "../types/response";
import { postFormData, get } from "./api";

export function uploadPost(form: FormData,username:string,token:string) {
    let data = {
        form,
        username,
        token
    }
    return postFormData<typeof data, IGenericResponse>(data, '/feed/posts/create').then((res: any) => res.data);
}

export function getNewPostsChunk(startIndex:number,length:number,token:string){
    return get<IGenericResponse>(`/feed/posts/get/all/popular/${startIndex}/${length}`,token).then((res: any) => res.data);
}