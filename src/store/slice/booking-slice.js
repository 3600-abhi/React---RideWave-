import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        bookingInfo: {}
    },
    reducers: {
        updateBookingInfo: (state, action) => {
            state.bookingInfo = action.payload;
        }
    }
});

export const { updateBookingInfo } = bookingSlice.actions;
export default bookingSlice.reducer;