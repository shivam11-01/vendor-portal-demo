const initialState = {
    currentuser: {},
    error_msg: null,
    success_msg: null,
    loading: true,
    isSuccess: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case getusersuccess:
            return {
                ...state,
                currentuser: action.payload,
                loading: false,
            }
        default:
            return {
                ...state
            }
    }
}

export const getusersuccess = "ON_GET_USER_SUCCESS"