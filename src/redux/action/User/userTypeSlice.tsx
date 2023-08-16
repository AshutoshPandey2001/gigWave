import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userType: "CREATOR",
    isListView: true,
    isCreateButton: true
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
        },
        setIsCreateButton: (state: any, action) => {
            state.isCreateButton = action.payload
        }
    }
})
export const { setUserType, setView, setIsCreateButton } = userTypeSlice.actions;

const userTypeReducer = userTypeSlice.reducer;
export default userTypeReducer