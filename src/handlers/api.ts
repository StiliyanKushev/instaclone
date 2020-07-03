import { settings } from "../settings";

import axios from 'axios';

export async function post<IData, IResponse>(data: IData, url: string): Promise<IResponse> {
    return axios({
        method:'POST',
        url:settings.BASE_URL + url,
        data: JSON.stringify({...data,token:undefined}),
        headers: {
            'Content-Type': 'application/json',
            'token': (data as any).token
        },
    }) as any;
}

export async function postFormData<IData, IResponse>(data:IData, url: string): Promise<IResponse> {
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