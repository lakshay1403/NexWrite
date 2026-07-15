import axios from "axios"


export const GenerateContentAPI = async(prompt) => {
    const response = await axios.post("http://localhost:8000/api/v1/gemini/generate",{
        prompt: prompt,
    },{
        withCredentials: true,
    });
    return response.data;
}