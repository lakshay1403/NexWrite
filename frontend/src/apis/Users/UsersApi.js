import axios from 'axios';
//Registering the user

export const RegisterApi = async(userData) => {
    const response = await axios.post('http://localhost:8000/api/v1/users/register',{
        email: userData?.email,
        username: userData?.username,
        password: userData?.password,
    },{
        withCredentials: true,
    });
    return response?.data;
};


//Logging in the user
export const LoginApi = async(userData) => {
    const response = await axios.post('http://localhost:8000/api/v1/users/login',{
        email: userData?.email,
        password: userData?.password,
    },{
        withCredentials: true,
    });
    return response.data;
}