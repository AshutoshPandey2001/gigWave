import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isGigCreated: false,
}
const gigSlice = createSlice({
    name: 'SET_GIG_CREATED',
    initialState,
    reducers: {
        setGigCreated: (state: any) => {
            state.isGigCreated = !state.isGigCreated
        }

    }
})
export const { setGigCreated } = gigSlice.actions;

const gigReducer = gigSlice.reducer;
export default gigReducer