export const LoginStart = (userCredentials) => ({
    type : "LOGIN_START"
});

export const LoginSuccess = (userCredentials) => ({
    type : "LOGIN_SUCCESS",
    payload : user,
});

export const LoginFailure = (error) => ({
    type : "LOGIN_FAILURE",
    payload : error
})


export const Follow = (userId) => ({
    type: "FOLLOW",
    payload : userId, 
})


export const unFollow = (userId) => ({
    type: "UNFOLLOW",
    payload : userId, 
})