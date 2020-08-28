import Cookies from 'universal-cookie';
const cookies = new Cookies();

export function saveUser(email:string,username:string,token:string, userId: string){
    //save user data in cookies
    cookies.set('userId',userId);
    cookies.set('username',username);
    cookies.set('email',email);
    cookies.set('token',token);
    cookies.set('isLogged',true);
}

export function clearUser(){
    //save user data in cookies
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('email');
    cookies.remove('token');
    cookies.remove('isLogged');
}