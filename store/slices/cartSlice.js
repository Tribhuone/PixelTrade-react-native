import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cart: [],
}

// Here we create slice to upload file then export it to use on other files...
export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        updateCart: (state, action) => {
            const item = action.payload;
            const isIsAlreadyInCart = state.cart.some(cartItem => cartItem._id === item._id);

            if (!isIsAlreadyInCart) {
                state.cart.push(item);
            }
        },

        clearCart: (state) => {
            state.cart = [];
        },

        removeCart: (state, action) => {
            state.cart = state.cart.filter((_, i) => i !== action.payload);
        }
    },
});


// Here Redux toolkit automatically generate action creators for each reducer function...
export const { updateCart, clearCart, removeCart } = cartSlice.actions;

export default cartSlice.reducer;
