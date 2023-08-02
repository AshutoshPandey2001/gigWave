import { createSlice } from '@reduxjs/toolkit'

const initialState={
    user:null
}
const userSlice = createSlice({
    name: 'SET_USER',
    initialState,
    reducers: {
        setUser: (state: any, action) => {
            state.user = action.payload
        }
    }
})
export const { setUser } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
