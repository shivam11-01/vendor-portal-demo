import { auth } from '../../firebase.config';
import { getDocument } from '../../utils/api';
import { getusersuccess } from '../reducers/getterReducer';

// const uid = auth.currentUser.uid;

export const onGetData = async (collection) => {
    try {
        const _uid = auth?.currentUser?.uid
        if (_uid != "") {
            const _tmp = await getDocument(collection, _uid);
            return _tmp;
        }
    } catch (err) {
        console.log(err);
    }
}

const onGetDataSuccess = (data) => {
    return {
        type: getusersuccess,
        payload: data
    }
}
