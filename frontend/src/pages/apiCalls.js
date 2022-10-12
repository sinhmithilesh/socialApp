import axios from "axios"

export const logiCall = async(userCredentials, dispatch) => {
    dispatch({type : "LOGIN_START"})
    try{
        const response = await axios.post(`http://localhost:8085/api/auth/login`, userCredentials)
        dispatch({type : "LOGIN_SUCCESS", payload : response.data})

    }
    catch(err){
        dispatch({type : "LOGIN_FAILURE", payload : err})

    }
}