import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    firstToken: ""
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
        }
    }
})
export const { setUser, setFirstToken } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
