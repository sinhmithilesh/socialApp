const AuthReducer = (state, action) => {
    switch(action.type){

        case "LOGIN_START" : 
            return {
                user: null,
                isFetching: true,
                error :  false 
            };
         
        case "LOGIN_SUCCESS" : 
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };

        case "LOGIN_FAILURE" : 
            return {
                user: null,
                isFetching: false,
                error: action.payload,
            };

        case "FOLLOW" : 
            return {
                ...state,
                user : {...state.user , following : [...state.user.following , action.payload]} // all existing fried id will be there we are just adding new one
            }  ;
            
        case "FOLLOW" : 
            return {
                ...state,
                user : {...state.user , following : state.user.following.fileter(id => id !== action.payload) }
            }  
        
            default : 
                return state       
    }
}

export default AuthReducer