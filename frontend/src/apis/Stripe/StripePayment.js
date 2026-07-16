import axios from 'axios';


export const handleFreeSubscription = async() => {
    const response = await axios.post("http://localhost:8000/api/v1/stripe/free",
        {}, 
        {
        withCredentials: true,
    }
  );
   return response?.data;
};