import { Cookies } from "react-cookie";
import { post } from "./api";
import IGenericResponse from "../types/response";
import { IForgotPasswordState } from "../components/ForgotPassword/ForgotPassword";
const cookies = new Cookies();

export function reportBug(report:string){
    const username = cookies.get('username');
    return post<{report:string,username:string},IGenericResponse>({report,username},'/email/report-bug').then((res: any) => res.data);
}

export function resetForgottenPassword(state: IForgotPasswordState) {
    return post<IForgotPasswordState, IGenericResponse>(state, '/email/forgot-password').then((res: any) => res.data);
}