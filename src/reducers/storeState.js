import { reducerType } from '@constants';

var initialState = {
    filterData:[],
}

export default function reducer(state = initialState, action) {
    console.log("filterData action :",action);
    switch (action.type) {
        case reducerType.filterData:
            
            return { ...state, filterData:action.data }
        default:
            return { ...state }
    }

}