export const initialFoodsToCompare = [];

export default function FoodCompareReducer(state, action) {

    switch (action.type) {

        case "LOAD_FOODS_TO_COMPARE":

            return action.payload;

        case "ADD_FOOD_TO_COMPARE":

            if (state.find(item => item.id === action.payload.id))
                return state;

            return [...state, action.payload];

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