import Home from "./screens/Main/Home";
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import Profile from "./screens/Main/Profile";
import FoodDetail from "./screens/Foods/FoodDetail";
import Cart from "./screens/Main/Cart";
import Menu from "./screens/Main/Menu";
import Reservation from "./screens/Services/Reservation";
import Account from "./screens/User/Account";
import TableSelection from "./screens/Services/TableSelection";
import QRScanner from "./screens/Services/CameraTableSelection";
import TableEntryScreen from "./screens/Services/TableEntryScreen";
import TableSelectionWalkIn from "./screens/Services/TableSelectionWalkIn";
import ReservationForm from "./screens/Services/Reservation";
import FoodCompare from "./screens/Foods/FoodCompare";

import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Icon } from "react-native-paper";

import { useContext } from "react";

import AppProvider from "./providers/AppProvider";

import UserContext from "./contexts/UserContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


const HomeStack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();

const tableScreens = (Stack) => (
    <>
        <Stack.Screen
            name="table_entry"
            component={TableEntryScreen}
            options={{ headerShown: false, title: "Chọn hình thức" }}
        />
        <Stack.Screen
            name="table_selection_walkin"
            component={TableSelectionWalkIn}
            options={{ headerShown: false, title: "Chọn bàn" }}
        />
        <Stack.Screen
            name="reservation_form"
            component={ReservationForm}
            options={{ headerShown: false, title: "Đặt bàn trước" }}
        />
        <Stack.Screen
            name="camera_table_selection"
            component={QRScanner}
            options={{ headerShown: false, title: "Quét QR bàn" }}
        />
    </>
);

const StackNavigator = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen
            name="index"
            component={Home}
            options={{ headerShown: false }}
        />
        <HomeStack.Screen
            name="cart"
            component={Cart}
            options={{ headerShown: false }}
        />
        <HomeStack.Screen
            name="login"
            component={Login}
            options={{ headerShown: false }}
        />
        {tableScreens(HomeStack)}
    </HomeStack.Navigator>
);

const MenuStackNavigator = () => (
    <MenuStack.Navigator>
        <MenuStack.Screen
            name="menu_index"
            component={Menu}
            options={{ headerShown: false }}
        />
        <MenuStack.Screen
            name="food_detail"
            component={FoodDetail}
            options={{ headerShown: false }}
        />
        <MenuStack.Screen
            name="food_compare"
            component={FoodCompare}
            options={{ headerShown: false, title: "So sánh món ăn" }}
        />
        {tableScreens(MenuStack)}
    </MenuStack.Navigator>
);

const CartStackNavigator = () => (
    <CartStack.Navigator>
        <CartStack.Screen
            name="cart_index"
            component={Cart}
            options={{ headerShown: false }}
        />
        {tableScreens(CartStack)}
    </CartStack.Navigator>
);

const AccountStackNavigator = () => (
    <AccountStack.Navigator>
        <AccountStack.Screen
            name="account_index"
            component={Account}
            options={{ headerShown: false }}
        />
        <AccountStack.Screen
            name="login"
            component={Login}
            options={{ title: "Đăng nhập" }}
        />
        <AccountStack.Screen
            name="register"
            component={Register}
            options={{ title: "Đăng ký" }}
        />
    </AccountStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
        >

            <Tab.Screen
                name="home"
                component={StackNavigator}
                options={{
                    title: "Trang chủ",
                    tabBarIcon: () => <Icon source="home" size={20} />,
                }}
            />
            <Tab.Screen
                name="menu"
                component={MenuStackNavigator}
                options={{
                    title: "Thực đơn",
                    tabBarIcon: () => <Icon source="menu" size={20} />,
                }}
            />


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
                        name="cart_tab"
                        component={CartStackNavigator}
                        options={{
                            title: "Giỏ hàng",
                            tabBarIcon: () => <Icon source="cart" size={20} />,
                        }}
                    />
                    <Tab.Screen
                        name="profile"
                        component={Profile}
                        options={{
                            title: "Hồ sơ",
                            tabBarIcon: () => <Icon source="account" size={20} />,
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
