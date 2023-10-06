import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    firstToken: "",
    fcm_token:""
}
const userSlice = createSlice({
    name: 'SET_USER',
    initialState,
    reducers: {
        setUser: (state: any, action) => {
            state.user = action.payload
        },
        setFirstToken: (state: any, action) => {
            state.firstToken = action.payload
        },
        setFCMToken: (state: any, action) => {
            state.fcm_token = action.payload
        },
    }
})
export const { setUser, setFirstToken,setFCMToken } = userSlice.actions;

const userReducer =userSlice.reducer;
export default userReducer;
