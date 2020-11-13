import IGenericResponse from '../types/response';
import { post, get } from './api';
import { IMessageDB } from '../types/response';


export function saveUserToDirect(username:string,userId:string,token:string){
    let data = {
        userId,
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/inbox/add/${username}`,token).then((res:any) => res.data);
}


export function saveMessageToDb(msg:IMessageDB,userId:string,token:string){
    let data = {
        msg,
        userId,
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/inbox/save-message/`,token).then((res:any) => res.data);
}

export function getNewDirectsChunk(startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/directs/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}

export function deleteUserFromDirect(username:string,userId:string,token:string){
    let data = {
        userId,
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/directs/delete/${username}`,token).then((res: any) => res.data);
}

export function getNewMessagesChunk(msgName:string,startIndex:number,stopIndex:number,userId:string,token:string){
    return get<IGenericResponse>(`/feed/user/inbox/messages/${msgName}/${startIndex}/${stopIndex}/as/${userId}`,token).then((res: any) => res.data);
}



export function sendPrepareDataInbox(otherUsername: string,username:string,userId:string,token:string){
    let data = {
        userId,
        otherUsername,
    }

    return post<typeof data,IGenericResponse>(data,`/feed/user/inbox/prepare/${username}`,token).then((res:any) => res.data);
}