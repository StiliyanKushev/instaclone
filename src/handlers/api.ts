import { settings } from "../settings";
import axios from 'axios';

export function post<IData, IResponse>(data: IData, url: string,token?:string): Promise<IResponse> {
    return axios({
        method:'POST',
        url:settings.BASE_URL + url,
        data: JSON.stringify({...data,token:undefined}),
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
    }) as any;
}

export function get<IResponse>(url:string,token?:string): Promise<IResponse> {
    return axios({
        method: "GET",
        url: settings.BASE_URL + url,
        headers: {
            'token': token
        },
    }) as any;
}

export function postFormData<IData, IResponse>(data:IData, url: string): Promise<IResponse> {
    return axios({
        method: "POST",
        url: settings.BASE_URL + url,
        data: (data as any).form,
        headers: {
            'token': (data as any).token,
            'username': (data as any).username
        },
    }) as any;
}