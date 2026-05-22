import Home from "./screens/Home/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Account from "./screens/User/Acount";
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyUserContext } from "./configs/Contexts";
import { useContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Profile from "./screens/User/Profile";
import FoodDetail from "./screens/Home/FoodDetail";
import Menu from "./screens/Home/Menu";
import Reservation from "./screens/Services/Reservation";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={Home} options={{title: 'Màn hình chính', headerShown: false }} />
    </Stack.Navigator>
  );
}

const MenuStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="menu_index" component={Menu} options={{title: 'Thực đơn', headerShown: false }} />
      <Stack.Screen name="dish_detail" component={FoodDetail} options={{title: 'Chi tiết món ăn'}} />
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
  const [user, ] = useContext(MyUserContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={StackNavigator} options={{title: 'Màn hình chính', tabBarIcon: () => <Icon source="home" size={20} />}} />
      
      <Tab.Screen name="menu" component={MenuStackNavigator} options={{headerShown: false, tabBarIcon: () => <Icon source="menu" size={20} />}} />
      <Tab.Screen name="reservation" component={Reservation} options={{headerShown: false, title: 'Đặt bàn', tabBarIcon: () => <Icon source="calendar" size={20} />}} />


      {/* KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP Ở ĐÂY */}
      {user === null ? (
        // NẾU CHƯA ĐĂNG NHẬP: Hiển thị 1 Tab duy nhất là "Tài khoản"
        <Tab.Screen 
            name="account_tab" 
            component={AccountStackNavigator} 
            options={{ 
                title: 'Tài khoản', // Đổi tên hiển thị trên thanh Bottom Tab
                headerShown: false, 
                tabBarIcon: () => <Icon source="account" size={20} /> 
            }} 
        />
      ) : (
        // NẾU ĐÃ ĐĂNG NHẬP: Hiển thị Tab Profile
        <Tab.Screen 
            name="profile" 
            component={Profile} 
            options={{
                title: 'Cá nhân',
                headerShown: false, 
                tabBarIcon: () => <Icon source="account-check" size={20} /> 
            }} 
        />
      )}
      
    </Tab.Navigator>
  );
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </MyUserContext.Provider>
   
  );
  
}

export default App;