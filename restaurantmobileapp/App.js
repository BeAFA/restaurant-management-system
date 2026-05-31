import Home from "./screens/Main/Home";
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import Profile from "./screens/Main/Profile";
import FoodDetail from "./screens/Foods/FoodDetail";
import Cart from "./screens/Main/Cart";
import Menu from "./screens/Main/Menu";
import ReservationForm from "./screens/Services/Reservation";
import Account from "./screens/User/Account";
import AccountSettings from "./screens/User/AccountSetting";
import ChangePassword from "./screens/User/PasswordSetting";
import TableSelection from "./screens/Services/TableSelection";
import TableEntryScreen from "./screens/Services/TableEntryScreen";
import TableSelectionWalkIn from "./screens/Services/TableSelectionWalkIn";
import FoodCompare from "./screens/Foods/FoodCompare";
import Dashboard from "./screens/Admin/Dashboard";
import CheckIn from "./screens/Admin/Checkin";
import ChefDashboard from "./screens/Admin/ChefDashboard";
import AdminManage from "./screens/Admin/AdminManage";
import OrderHistory from "./screens/User/OrderHistory";
import ChefManageFoods from "./screens/User/Chef/ChefManageFoods";
import UpdateFood from "./screens/User/Chef/UpdateFood";
import PaymentQRScreen from "./screens/Services/PaymentQRScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-paper";
import { useContext } from "react";
import AppProvider from "./providers/AppProvider";
import UserContext from "./contexts/UserContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CreateFood from "./screens/User/Chef/CreateFood";
import ChefCreate from "./screens/Admin/ChefCreate";


const HomeStack = createNativeStackNavigator();
const MenuStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();

const tableScreens = (Stack) => (
    <>
        <Stack.Screen
            name="table_entry"
            component={TableEntryScreen}
            options={{ title: "Chọn hình thức" }}
        />
        <Stack.Screen
            name="table_selection_walkin"
            component={TableSelectionWalkIn}
            options={{ title: "Chọn bàn" }}
        />
        <Stack.Screen
            name="reservation_form"
            component={ReservationForm}
            options={{ title: "Đặt bàn trước" }}
        />
    </>
);


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const HomeStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" component={Home} />
        <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
);

const MenuStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="menu_index" component={Menu} />
        <Stack.Screen name="food_detail" component={FoodDetail} />
        <Stack.Screen name="food_compare" component={FoodCompare} options={{ headerShown: false, title: "So sánh món ăn" }} />
    </Stack.Navigator>
);

const AccountStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="account_index" component={Account} />
        <Stack.Screen name="login" component={Login} options={{ headerShown: true, title: "Đăng nhập" }} />
        <Stack.Screen name="register" component={Register} options={{ headerShown: true, title: "Đăng ký" }} />
    </Stack.Navigator>
);

const ProfileStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profile_index" component={Profile} />
        <Stack.Screen name="account_settings" component={AccountSettings} options={{ headerShown: true, title: "Cài đặt tài khoản" }} />
        <Stack.Screen name="change_password" component={ChangePassword} options={{ headerShown: true, title: "Đổi mật khẩu" }} />
        <Stack.Screen name="order_history" component={OrderHistory} options={{ headerShown: true, title: "Lịch sử đơn hàng" }} />
    </Stack.Navigator>
);

const CustomerTabNavigator = () => {
    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator id="CustomerTabs" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="home" component={HomeStackNavigator} options={{ title: "Trang chủ", tabBarIcon: () => <Icon source="home" size={20} /> }} />
            <Tab.Screen name="menu" component={MenuStackNavigator} options={{ title: "Thực đơn", tabBarIcon: () => <Icon source="menu" size={20} /> }} />

            {user === null ? (
                <Tab.Screen name="account_tab" component={AccountStackNavigator} options={{ title: 'Tài khoản', tabBarIcon: () => <Icon source="account" size={20} /> }} />
            ) : (
                <>
                    <Tab.Screen name="cart_index" component={Cart} options={{ title: "Giỏ hàng", tabBarIcon: () => <Icon source="cart" size={20} /> }} />
                    <Tab.Screen name="profile" component={ProfileStackNavigator} options={{ title: "Hồ sơ", tabBarIcon: () => <Icon source="account" size={20} /> }} />
                </>
            )}
        </Tab.Navigator>
    );
};


const CustomerRootNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} options={{ headerShown: false }} />

        <Stack.Screen name="table_entry" component={TableEntryScreen} options={{ title: "Chọn hình thức" }} />
        <Stack.Screen name="table_selection_walkin" component={TableSelectionWalkIn} options={{ title: "Chọn bàn" }} />
        <Stack.Screen name="reservation_form" component={ReservationForm} options={{ title: "Đặt bàn trước" }} />
        <Stack.Screen name="payment_qr" component={PaymentQRScreen} options={{ headerShown: true, title: "Thanh toán" }} />
    </Stack.Navigator>
);

const AdminTabNavigator = () => {
    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="admin_dashboard"
                component={Dashboard}
                options={{
                    title: "Thống kê",
                    tabBarIcon: () => <Icon source="chart-line" size={20} />
                }}
            />
            <Tab.Screen
                name="admin_manage"
                component={AdminManage}
                options={{
                    title: "Quản lý",
                    tabBarIcon: () => <Icon source="account-cog" size={20} />
                }}
            />
            <Tab.Screen
                name="chef_create"
                component={ChefCreate}
                options={{
                    title: "Tạo đầu bếp",
                    tabBarIcon: () => <Icon source="account-plus" size={20} />
                }}
            />

            {user === null ? (
                <Tab.Screen name="account_tab" component={AccountStackNavigator} options={{ title: 'Tài khoản', tabBarIcon: () => <Icon source="account" size={20} /> }} />
            ) : (
                <>
                    <Tab.Screen name="profile" component={ProfileStackNavigator} options={{ title: "Hồ sơ", tabBarIcon: () => <Icon source="account" size={20} /> }} />
                </>
            )}
        </Tab.Navigator>
    );
};

const ChefFoodManage = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="chef_manage_foods" component={ChefManageFoods} />
            <Stack.Screen name="create_food" component={CreateFood} options={{ headerShown: true, title: "Tạo món ăn mới" }} />
            <Stack.Screen name="update_food" component={UpdateFood} options={{ headerShown: true, title: "Cập nhật món ăn" }} />
        </Stack.Navigator>
    );
}

const ChefTabNavigator = () => {
    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="chef_dashboard"
                component={ChefDashboard}
                options={{
                    title: "Thống kê",
                    tabBarIcon: () => <Icon source="chart-line" size={20} />
                }}
            />
            <Tab.Screen
                name="menu"
                component={Menu}
                options={{
                    title: "Thực đơn",
                    tabBarIcon: () => <Icon source="menu" size={20} />
                }}
            />
            <Tab.Screen
                name="chef_foods_manage"
                component={ChefFoodManage}
                options={{
                    title: "Quản lý món ăn",
                    tabBarIcon: () => <Icon source="silverware-fork-knife" size={20} />
                }}
            />
            {user === null ? (
                <Tab.Screen name="account_tab" component={AccountStackNavigator} options={{ title: 'Tài khoản', tabBarIcon: () => <Icon source="account" size={20} /> }} />
            ) : (
                <>
                    <Tab.Screen name="profile" component={ProfileStackNavigator} options={{ title: "Hồ sơ", tabBarIcon: () => <Icon source="account" size={20} /> }} />
                </>
            )}
        </Tab.Navigator>
    );
};

const AppRouter = () => {
    
    const { user } = useContext(UserContext);

    
    if (user && user.user_role === 'ADMIN') {
        return <AdminTabNavigator />;
    }
    if (user && user.user_role === 'CHEF') {
        return <ChefTabNavigator />;
    }

    
    return <CustomerRootNavigator />;
};


export default function App() {
    return (
        <SafeAreaProvider>
            <AppProvider>
                <NavigationContainer>
                    <AppRouter />
                </NavigationContainer>
            </AppProvider>
        </SafeAreaProvider>
    );
}