const initialState = {
    accounts: {},
    useruid: "",
    error_msg: null,
    success_msg: null,
    loading: true,
    isSuccess: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case loginsuccess:
            return {
                ...state,
                accounts: action.payload,
                loading: false,
            }
        case uid:
            return {
                ...state,
                useruid: action.payload,
                loading: false,
            }
        default:
            return {
                ...state
            }
    }
}

export const loginsuccess = "ON_LOGIN_SUCCESS"
export const uid = "ON_GET_UID_SUCCESS"