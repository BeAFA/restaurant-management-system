import { useEffect, useState, useReducer } from "react";

import * as SecureStore from "expo-secure-store";

import UserContext from "../contexts/UserContext";
import FoodContext from "../contexts/FoodContext";
import CategoryContext from "../contexts/CategoryContext";
import CartContext from "../contexts/CartContext";

import CartReducer, { initialCart } from "../reducers/CartReducer";
import UserReducer from "../reducers/UserReducer";

import Apis, { endpoints, authApis } from "../configs/Apis";

export default function AppProvider({ children }) {

    // ===== STATES =====

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

    // ===== LOAD FOODS =====

    const loadFoods = async () => {
        try {
            let res = await Apis.get(endpoints['foods']);

            setFoods(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ===== LOAD CATEGORIES =====

    const loadCategories = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);

            setCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ===== LOAD USER =====

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

    // ===== LOAD CART =====

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

    // ===== APP START =====

    useEffect(() => {

        loadFoods();

        loadCategories();

        loadUser();

        loadCart();

    }, []);

    // ===== USER FUNCTIONS =====

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

    // ===== CART FUNCTIONS =====

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

    return (
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

                        {children}

                    </CartContext.Provider>

                </CategoryContext.Provider>

            </FoodContext.Provider>

        </UserContext.Provider>
    );
}