import Home from "./screens/Main/Home";
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import Profile from "./screens/Main/Profile";
import FoodDetail from "./screens/Foods/FoodDetail";
import Cart from "./screens/Main/Cart";
import Menu from "./screens/Main/Menu";
import ReservationForm from "./screens/Services/Reservation"; // Gộp dòng import trùng
import Account from "./screens/User/Account";
import TableSelection from "./screens/Services/TableSelection";
import QRScanner from "./screens/Services/CameraTableSelection";
import TableEntryScreen from "./screens/Services/TableEntryScreen";
import TableSelectionWalkIn from "./screens/Services/TableSelectionWalkIn";
import FoodCompare from "./screens/Foods/FoodCompare";
import Dashboard from "./screens/Admin/Dashboard";
import CheckIn from "./screens/Admin/Checkin";
import ChefDashboard from "./screens/Admin/ChefDashboard";
import AdminManage from "./screens/Admin/AdminManage";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-paper";
import { useContext } from "react";
import AppProvider from "./providers/AppProvider";
import UserContext from "./contexts/UserContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CreateFood from "./screens/User/Chef/CreateFood";
import StatisticChef from "./screens/User/Chef/StatisticChef";


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
            options={{  title: "Chọn bàn" }}
        />
        <Stack.Screen
            name="reservation_form"
            component={ReservationForm}
            options={{  title: "Đặt bàn trước" }}
        />
        <Stack.Screen
            name="camera_table_selection"
            component={QRScanner}
            options={{ headerShown: false, title: "Quét QR bàn" }}
        />
    </>
);

// Khởi tạo các bộ điều hướng
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. TỐI ƯU CÁC STACK CON (Chỉ chứa các màn hình thực sự thuộc về nó)
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
        <Stack.Screen name="food_compare" component={FoodCompare} options={{ headerShown: true, title: "So sánh món ăn" }} />
    </Stack.Navigator>
);

const CartStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="cart_index" component={Cart} />
    </Stack.Navigator>
);

const AccountStackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="account_index" component={Account} />
        <Stack.Screen name="login" component={Login} options={{ headerShown: true, title: "Đăng nhập" }} />
        <Stack.Screen name="register" component={Register} options={{ headerShown: true, title: "Đăng ký" }} />
    </Stack.Navigator>
);

// 2. TẠO TAB NAVIGATOR (Chỉ quản lý thanh điều hướng bên dưới)
const CustomerTabNavigator = () => {
    const { user } = useContext(UserContext);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="home" component={HomeStackNavigator} options={{ title: "Trang chủ", tabBarIcon: () => <Icon source="home" size={20} /> }} />
            <Tab.Screen name="menu" component={MenuStackNavigator} options={{ title: "Thực đơn", tabBarIcon: () => <Icon source="menu" size={20} /> }} />

            {user === null ? (
                <Tab.Screen name="account_tab" component={AccountStackNavigator} options={{ title: 'Tài khoản', tabBarIcon: () => <Icon source="account" size={20} /> }} />
            ) : (
                <>
                    <Tab.Screen name="cart_tab" component={CartStackNavigator} options={{ title: "Giỏ hàng", tabBarIcon: () => <Icon source="cart" size={20} /> }} />
                    <Tab.Screen name="profile" component={Profile} options={{ title: "Hồ sơ", tabBarIcon: () => <Icon source="account" size={20} /> }} />
                </>
            )}
        </Tab.Navigator>
    );
};

// 3. TẠO ROOT NAVIGATOR (Bọc TabNavigator và chứa các màn hình dùng chung)
const CustomerRootNavigator = () => (
    <Stack.Navigator>
        {/* Nhúng toàn bộ Tab vào làm 1 màn hình của Stack */}
        <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} options={{ headerShown: false }} />

        {/* ĐỊNH NGHĨA CÁC MÀN HÌNH DÙNG CHUNG Ở ĐÂY (Chỉ 1 lần duy nhất) */}
        <Stack.Screen name="table_entry" component={TableEntryScreen} options={{ title: "Chọn hình thức" }} />
        <Stack.Screen name="table_selection_walkin" component={TableSelectionWalkIn} options={{ title: "Chọn bàn" }} />
        <Stack.Screen name="reservation_form" component={ReservationForm} options={{ title: "Đặt bàn trước" }} />
        <Stack.Screen name="camera_table_selection" component={QRScanner} options={{ headerShown: false, title: "Quét QR bàn" }} />
    </Stack.Navigator>
);

const AdminTabNavigator = () => {
    // THÊM VÀO ĐÂY
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
                name="check_in"
                component={CheckIn}
                options={{
                    title: "Quản lý",
                    tabBarIcon: () => <Icon source="view-dashboard" size={20} />
                }}
            />
            {/* <Tab.Screen
                name="create_food"
                component={CreateFood}
                options={{
                    title: "Tạo món ăn",
                    tabBarIcon: () => <Icon source="plus" size={20} />,
                }}
            /> */}
            <Tab.Screen
                name="statistic_chef"
                component={StatisticChef}
                options={{
                    title: "Thống kê",
                    tabBarIcon: () => <Icon source="chart-bar" size={20} />,
                }}
            />
            {user === null ? (
                <Tab.Screen name="account_tab" component={AccountStackNavigator} options={{ title: 'Tài khoản', tabBarIcon: () => <Icon source="account" size={20} /> }} />
            ) : (
                <>
                    <Tab.Screen name="profile" component={Profile} options={{ title: "Hồ sơ", tabBarIcon: () => <Icon source="account" size={20} /> }} />
                </>
            )}
        </Tab.Navigator>
    );
};

const ChefTabNavigator = () => {
    // THÊM VÀO ĐÂY
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
            {user === null ? (
                <Tab.Screen name="account_tab" component={AccountStackNavigator} options={{ title: 'Tài khoản', tabBarIcon: () => <Icon source="account" size={20} /> }} />
            ) : (
                <>
                    <Tab.Screen name="profile" component={Profile} options={{ title: "Hồ sơ", tabBarIcon: () => <Icon source="account" size={20} /> }} />
                </>
            )}
        </Tab.Navigator>
    );
};

const AppRouter = () => {
    // THÊM VÀO ĐÂY Lấy thông tin user từ Context
    const { user } = useContext(UserContext);

    // 1. NẾU LÀ ADMIN ĐÃ ĐĂNG NHẬP
    if (user && user.user_role === 'ADMIN') {
        return <AdminTabNavigator />;
    }
    if (user && user.user_role === 'CHEF') {
        return <ChefTabNavigator />;
    }

    // 2. CÁC TRƯỜNG HỢP CÒN LẠI (Khách hàng hoặc Chưa đăng nhập)
    return <CustomerRootNavigator />;
};

// 4. APP CHÍNH
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