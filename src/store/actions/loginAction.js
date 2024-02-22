import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { showToast } from "../../utils/toast";
import { loginsuccess, uid } from '../reducers/loginReducer';

export const onLogin = (setLoad, { email, password }) => {
    return async (dispatch) => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            dispatch(onGetUsersSuccess(user?.user?.auth?.currentUser))
            dispatch(setUID(user?.user?.auth?.currentUser?.uid))
            sessionStorage.setItem('accessToken', user?.user?.accessToken);
            setTimeout(() => {
                setLoad(false);
                window.location.href = "/profile";
            }, 1000);
        } catch (err) {
            if (err) {
                showToast("error", err.message);
                setLoad(false);
            }
        }
    }
}

const onGetUsersSuccess = (data) => {
    return {
        type: loginsuccess,
        payload: data
    }
}


const setUID = (data) => {
    return {
        type: uid,
        payload: data
    }
}


