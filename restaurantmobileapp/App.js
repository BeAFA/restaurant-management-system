import Home from "./screens/Home/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyUserContext } from "./configs/Contexts";
import { useContext, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Profile from "./screens/User/Profile";

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={Home} options={{title: 'Màn hình chính', headerShown: false }} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const [user, ] = useContext(MyUserContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={StackNavigator} options={{title: 'Màn hình chính', tabBarIcon: () => <Icon source="home" size={20} />}} />

      {user === null?<>
        <Tab.Screen name="register" component={Register} options={{headerShown: false, tabBarIcon: () => <Icon source="account-plus" size={20} />}} />
        <Tab.Screen name="login" component={Login} options={{headerShown: false, tabBarIcon: () => <Icon source="account" size={20} />}} />
      </>:<>
        <Tab.Screen name="profile" component={Profile} options={{headerShown: false, tabBarIcon: () => <Icon source="account-plus" size={20} />}} />
      </>}
      
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