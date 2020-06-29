import { Cookies } from "react-cookie";
import { post } from "./api";
import IGenericResponse from "../interfaces/response";
const cookies = new Cookies();

export function reportBug(report:string){
    const username = cookies.get('username');
    return post<{report:string,username:string},IGenericResponse>({report,username},'/email/report-bug');
}