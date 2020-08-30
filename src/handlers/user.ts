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
