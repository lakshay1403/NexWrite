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