import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
}
const generalSlice = createSlice({
    name: 'SET_USER_INTERFACE',
    initialState,
    reducers: {
        setLoading: (state: any, action) => {
            state.isLoading = action.payload
        }
       
    }
})
export const { setLoading } = generalSlice.actions;

const uiReducer = generalSlice.reducer;
export default uiReducer