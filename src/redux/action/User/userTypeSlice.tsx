import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userType: "CREATOR",
    isListView: true
}
const userTypeSlice = createSlice({
    name: 'SET_USERTYPE',
    initialState,
    reducers: {
        setUserType: (state: any, action) => {
            state.userType = action.payload
        },
        setView: (state: any, action) => {
            state.isListView = action.payload
        }
    }
})
export const { setUserType, setView } = userTypeSlice.actions;

const userTypeReducer = userTypeSlice.reducer;
export default userTypeReducer