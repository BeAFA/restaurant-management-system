import { useEffect, useState, useReducer } from "react";

import * as SecureStore from "expo-secure-store";

import UserContext from "../contexts/UserContext";
import FoodContext from "../contexts/FoodContext";
import CategoryContext from "../contexts/CategoryContext";
import CartContext from "../contexts/CartContext";
import FoodCompareContext from "../contexts/FoodCompareContext";

import CartReducer, { initialCart } from "../reducers/CartReducer";
import UserReducer from "../reducers/UserReducer";
import FoodCompareReducer, { initialFoodsToCompare } from "../reducers/FoodCompareReducer";

import Apis, { endpoints, authApis } from "../configs/Apis";
import TableContext from "../contexts/TableContext";
import { Alert } from "react-native";

export default function AppProvider({ children }) {

    

    const [user, dispatchUser] = useReducer(
        UserReducer,
        null
    );

    const [foods, setFoods] = useState([]);

    const [categories, setCategories] = useState([]);

    const [cart, dispatchCart] = useReducer(
        CartReducer,
        initialCart
    );

    const [table, setTable] = useState(null);
    const [tableSource, setTableSource] = useState(null);
    const [reservationId, setReservationId] = useState(null);
    const [foodsToCompare, dispatchFoodsToCompare] = useReducer(
        FoodCompareReducer,
        initialFoodsToCompare
    );

    const loadCategories = async () => {
            try {
                const res = await Apis.get(endpoints['categories']);

                const categoryData = res.data.results || res.data;

                setCategories([{ id: '', name: 'Tất cả' }, ...categoryData]);
            } catch (ex) {
                console.log("Lỗi tải danh mục:", ex.message);
            }
        };


    const loadUser = async () => {
        try {

            let token = await SecureStore.getItemAsync("token");

            if (!token)
                return;

            let res = await authApis(token)
                .get(endpoints['current_user']);

            dispatchUser({
                type: "LOGIN",
                payload: res.data
            });

        } catch (err) {
            console.log(err);
            await SecureStore.deleteItemAsync("token");

            dispatchUser({
                type: "LOGOUT"
            });
        }
    };

    

    const loadCart = async () => {

        try {

            let data = await SecureStore.getItemAsync("cart");

            if (data)

                dispatchCart({
                    type: "LOAD_CART",
                    payload: JSON.parse(data)
                });

        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {

        loadCategories();

        loadUser();

        loadCart();

    }, []);


    const login = async (userData, token) => {

        await SecureStore.setItemAsync(
            "token",
            token
        );

        dispatchUser({
            type: "LOGIN",
            payload: userData
        });
    };

    const logout = async () => {

        await SecureStore.deleteItemAsync("token");

        dispatchUser({
            type: "LOGOUT"
        });
    };

    const addToCart = async (food) => {

        let updatedCart = CartReducer(cart, {
            type: "ADD_TO_CART",
            payload: food
        });

        dispatchCart({
            type: "ADD_TO_CART",
            payload: food
        });

        await SecureStore.setItemAsync(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    const removeFromCart = async (foodId) => {

        let updatedCart = CartReducer(cart, {
            type: "REMOVE_FROM_CART",
            payload: foodId
        });

        dispatchCart({
            type: "REMOVE_FROM_CART",
            payload: foodId
        });

        await SecureStore.setItemAsync(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    const clearCart = async () => {

        dispatchCart({
            type: "CLEAR_CART"
        });

        await SecureStore.deleteItemAsync("cart");
    };

    const addFoodToCompare = async (food) => {
        if (foodsToCompare.length >= 3) {
            Alert.alert("Thông báo", "Bạn chỉ có thể so sánh tối đa 3 món ăn. Vui lòng xóa danh sách so sánh để thêm món mới.");
            return;
        }
        if (foodsToCompare.find(item => item.id === food.id)) {
            Alert.alert("Thông báo", "Món ăn này đã có trong danh sách so sánh.");
            return;
        }
        dispatchFoodsToCompare({
            type: "ADD_FOOD_TO_COMPARE",
            payload: food
        });
    };

    const removeFromFoodsToCompare = async (foodId) => {
        dispatchFoodsToCompare({
            type: "REMOVE_FOOD_FROM_COMPARE",
            payload: foodId
        });
    };

    const clearFoodsToCompare = async () => {
        dispatchFoodsToCompare({
            type: "CLEAR_FOODS_TO_COMPARE"
        });
    };


    const selectTable = (tableData, source = "walk_in") => {
        setTable(tableData);
        setTableSource(source);
    };

    const selectTableFromReservation = (tableData, resId) => {
        setTable(tableData);
        setTableSource("reservation");
        setReservationId(resId);
    };

    const clearTable = () => {
        setTable(null);
        setTableSource(null);
        setReservationId(null);
    };

    return (
        <FoodCompareContext.Provider value={{
            foodsToCompare,
            dispatchFoodsToCompare,
            addFoodToCompare,
            removeFromFoodsToCompare,
            clearFoodsToCompare
        }}>
            <UserContext.Provider value={{
                user,
                dispatchUser,
                login,
                logout
            }}>

                <FoodContext.Provider value={{
                    foods,
                    setFoods
                }}>

                    <CategoryContext.Provider value={{
                        categories,
                        setCategories
                    }}>

                        <CartContext.Provider value={{
                            cart,
                            dispatchCart,
                            addToCart,
                            removeFromCart,
                            clearCart
                        }}>

                            <TableContext.Provider value={{
                                table,
                                tableSource,
                                reservationId,
                                selectTable,
                                selectTableFromReservation,
                                clearTable,
                            }}>

                                {children}

                            </TableContext.Provider>

                        </CartContext.Provider>

                    </CategoryContext.Provider>

                </FoodContext.Provider>

            </UserContext.Provider >
        </FoodCompareContext.Provider>
    );
}