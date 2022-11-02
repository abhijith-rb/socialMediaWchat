import axios from "axios";
// this loginCall function is actually apart of login page; written here to avoid complication
export const loginCall = async (userCredential, dispatch)=>{
    //calling LoginStart function in AuthActions
    dispatch({type: "LOGIN_START"});
    try {
        const res = await axios.post("/api/auth/login", userCredential)
        //calling LoginSuccess function in AuthActions
        dispatch({type: "LOGIN_SUCCESS", payload: res.data})
     
    } catch (err) {
        //calling LoginFailure function in AuthActions
        dispatch({type: "LOGIN_FAILURE", payload:err})
    }
}