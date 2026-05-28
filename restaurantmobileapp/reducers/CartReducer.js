import { Alert } from "react-native";

export const initialCart = [];

export default function CartReducer(state, action) {

    switch (action.type) {

        case "LOAD_CART":

            return action.payload;

        case "ADD_TO_CART":
            const existing = state.find(i => i.id === action.payload.id);
            if (existing && existing.quantity >= 10) {
                Alert.alert("Thông báo", "Số lượng món ăn đã đạt tối đa!");
                return state;
            }

            if (existing) {
                return state.map(i =>
                    i.id === action.payload.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [
                ...state,
                { ...action.payload, quantity: 1 }
            ];

        case "REMOVE_FROM_CART":
            return state
                .map(i =>
                    i.id === action.payload
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter(i => i.quantity > 0);

        case "CLEAR_CART":

            return [];

        default:
            return state;
    }
}