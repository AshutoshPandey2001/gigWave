import { createSlice } from '@reduxjs/toolkit'
import { Constant } from "../types"

const initialState: Constant = {
    user: null,
}

const userSlice =createSlice({
name:'SET_USER',
initialState,
reducers:{
    setUser:(state:any,action)=>{
        state.user=action.payload
    }
}
})
export const { setUser} = userSlice.actions;

const userReducer=userSlice.reducer;
export default userReducer;
