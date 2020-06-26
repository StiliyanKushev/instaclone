import Cookies from 'universal-cookie';
const cookies = new Cookies();

export function saveUser(username:string,token:string){
    //save user data in cookies
    cookies.set('username',username);
    cookies.set('token',token);
    cookies.set('isLogged',true);
} 