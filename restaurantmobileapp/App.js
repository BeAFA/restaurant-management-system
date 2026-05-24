import Home from "./screens/Main/Home";
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import Profile from "./screens/Main/Profile";
import FoodDetail from "./screens/Foods/FoodDetail";
import Cart from "./screens/Main/Cart";
import Menu from "./screens/Main/Menu";
import Reservation from "./screens/Services/Reservation";
import Account from "./screens/User/Account";

import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Icon } from "react-native-paper";

import { useContext } from "react";

import AppProvider from "./providers/AppProvider";

import UserContext from "./contexts/UserContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="index"
                component={Home}
                options={{
                    title: "Màn hình chính",
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="food_detail"
                component={FoodDetail}
                options={{
                    title: "Chi tiết món ăn",
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="login"
                component={Login}
                options={{
                    title: "Đăng nhập",
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
};

const MenuStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="menu_index" component={Menu} options={{ title: 'Thực đơn', headerShown: false }} />
            <Stack.Screen name="food_detail" component={FoodDetail} options={{ title: 'Chi tiết món ăn', headerShown: false }} />
        </Stack.Navigator>
    );
}

const AccountStackNavigator = () => {
    return (
        <Stack.Navigator>
            {/* Màn hình mặc định khi ấn vào Tab Tài khoản */}
            <Stack.Screen
                name="account_index"
                component={Account}
                options={{ title: 'Tài khoản', headerShown: false }}
            />
            {/* Các màn hình con */}
            <Stack.Screen
                name="login"
                component={Login}
                options={{ title: 'Đăng nhập' }}
            />
            <Stack.Screen
                name="register"
                component={Register}
                options={{ title: 'Đăng ký' }}
            />
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
        >

            <Tab.Screen name="home" component={StackNavigator} options={{ title: 'Màn hình chính', tabBarIcon: () => <Icon source="home" size={20} /> }} />

            <Tab.Screen name="menu" component={MenuStackNavigator} options={{ headerShown: false, tabBarIcon: () => <Icon source="menu" size={20} /> }} />
            <Tab.Screen name="reservation" component={Reservation} options={{ headerShown: false, title: 'Đặt bàn', tabBarIcon: () => <Icon source="calendar" size={20} /> }} />


            {user === null ? (
                <Tab.Screen
                    name="account_tab"
                    component={AccountStackNavigator}
                    options={{
                        title: 'Tài khoản',
                        headerShown: false,
                        tabBarIcon: () => <Icon source="account" size={20} />
                    }}
                />
            ) : (
                <>
                    <Tab.Screen
                        name="cart"
                        component={Cart}
                        options={{
                            tabBarIcon: () =>
                                <Icon source="cart" size={20} />
                        }}
                    />
                    <Tab.Screen
                        name="profile"
                        component={Profile}
                        options={{
                            tabBarIcon: () =>
                                <Icon source="account" size={20} />
                        }}
                    />
                </>
            )}

        </Tab.Navigator>
    );
};

export default function App() {

    return (
        <SafeAreaProvider>
            <AppProvider>

                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>

            </AppProvider>
        </SafeAreaProvider>
    );
}
