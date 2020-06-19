import { settings } from "../settings";

export async function post<IData,IResponse>(data:IData,url:string):Promise<IResponse>{
    let res = await fetch(settings.BASE_URL + url,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await res.json() as Promise<IResponse>;
}