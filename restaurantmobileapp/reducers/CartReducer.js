export const initialCart = [];

export default function CartReducer(state, action) {

    switch (action.type) {

        case "LOAD_CART":

            return action.payload;

        case "ADD_TO_CART":

            let existing = state.find(
                item => item.id === action.payload.id
            );

            if (existing) {

                return state.map(item =>
                    item.id === action.payload.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...state,
                {
                    ...action.payload,
                    quantity: 1
                }
            ];

        case "REMOVE_FROM_CART":

            return state.filter(
                item => item.id !== action.payload
            );

        case "CLEAR_CART":

            return [];

        default:
            return state;
    }
}