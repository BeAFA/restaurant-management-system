import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useState, useContext } from "react";
CLIENT_ID_REMOVED
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import Style from '../../styles/UserStyles';
import UserContext from "../../contexts/UserContext";
import Footer from "../../components/Footer";

const Login = () => {
    const userInfo = [{
        field: 'username',
        title: 'Tên đăng nhập',
        icon: 'account',
    }, {
        field: 'password',
        title: 'Mật khẩu',
        icon: 'eye',
        secureTextEntry: true
    }];

    const [user, setUser] = useState({});
    const [err, setErr] = useState(null);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const { dispatchUser } = useContext(UserContext);

    const [hidePass, setHidePass] = useState({
        password: true,
    });

    const validate = () => {
        setErr(null);
        if (!user.username)
            setErr('Vui lòng nhập tên đăng nhập');
        else if (!user.password)
            setErr('Vui lòng nhập tên mật khẩu!');
        else
            return true;
    }

    const login = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const params = new URLSearchParams();
            params.append('username', user.username);
            params.append('password', user.password);
CLIENT_ID_REMOVED
CLIENT_SECRET_REMOVED
            params.append('grant_type', 'password');

            const res = await Apis.post(endpoints['login'], params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            await SecureStore.setItemAsync('token', res.data.access_token);

            const currentUser = await authApis(res.data.access_token)
                .get(endpoints['current_user']);


            dispatchUser({
                type: 'LOGIN',
                payload: currentUser.data,
            });


        } catch (ex) {
            if (ex.response) {
                console.log("LỖI SERVER - STATUS:", ex.response.status);
                console.log("LỖI SERVER - DATA:", JSON.stringify(ex.response.data));
            } else if (ex.request) {
                console.log("LỖI NETWORK - Không nhận được response");
                console.log("LỖI NETWORK - Message:", ex.message);
                console.log("LỖI NETWORK - Request:", JSON.stringify(ex.request));
                setErr("Không kết nối được server!");
            } else {
                console.log("LỖI CODE:", ex.message);
                setErr("Lỗi ứng dụng: " + ex.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[Style.container, { paddingTop: 80 }]}>

            <View style={Style.headerContainer}>
                <Text style={Style.titleText}>DK Restaurant</Text>
                <Text style={Style.subText}>Đăng nhập để đặt món ngay!</Text>
            </View>

            <View style={Style.formContainer}>
                <HelperText style={Style.margin} type="error" visible={!!err}>
                    {err}
                </HelperText>


                <TextInput
                    key={userInfo[0].field}
                    value={user.username}
                    onChangeText={(t) => setUser({ ...user, [userInfo[0].field]: t })}
                    style={Style.input}
                    label={userInfo[0].title}
                    placeholder={`Nhập ${userInfo[0].title.toLowerCase()}`}
                    secureTextEntry={userInfo.secureTextEntry}
                    mode="outlined" 
                    outlineColor="#E0E0E0" 
                    activeOutlineColor="#388f35" 

                    right={<TextInput.Icon icon="account" color="#FF6347" />}
                />
                

                <TextInput
                    key={userInfo[1].field}
                    label={userInfo[1].title}
                    mode="outlined"
                    style={Style.input}
                    activeOutlineColor="#FF6347"
                    secureTextEntry={hidePass.password}
                    value={user.password}
                    onChangeText={(t) => setUser({ ...user, [userInfo[1].field]: t })}
                    right={
                        <TextInput.Icon
                            icon={hidePass.password ? "eye-off" : "eye"}
                            color="#FF6347"
                            onPress={() => setHidePass({ ...hidePass, password: !hidePass.password })}
                        />
                    }
                />

                
                <TouchableOpacity>
                    <Text style={Style.forgotPassword}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                <Button
                    loading={loading}
                    disabled={loading}
                    mode="contained"
                    onPress={login}
                    style={Style.primaryButton}
                    labelStyle={Style.buttonLabel}
                >
                    Đăng nhập
                </Button>
            </View>
        </View>
    );
};
export default Login;