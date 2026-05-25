export const initialFoodsToCompare = [];

export default function FoodCompareReducer(state, action) {

    switch (action.type) {

        case "LOAD_FOODS_TO_COMPARE":

            return action.payload;

        case "ADD_FOOD_TO_COMPARE":

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

        case "REMOVE_FOOD_FROM_COMPARE":

            return state.filter(
                item => item.id !== action.payload
            );

        case "CLEAR_FOODS_TO_COMPARE":

            return [];

        default:
            return state;
    }
}