import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserContext } from "../../configs/Contexts";
import Style from './Style'; // Nhớ trỏ đúng đường dẫn của bạn

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
    const [, dispatch] = useContext(MyUserContext);



    const validate = () => {
        if (!user.username)
            setErr('Vui lòng nhập tên đăng nhập');
        else if (!user.password)
            setErr('Vui lòng nhập tên mật khẩu!');
        else
            return true;
    }
    // const login = async () => {
    // if (validate()) {
    //     try {
    //         setLoading(true);

    //         // THAY 2 BIẾN NÀY BẰNG MÃ THẬT BẠN COPY Ở BƯỚC 1
    //         const clientId = 'L3eugdz7Hbmtoz5NQS4foy2wE9YML1ekrnG3Wg6G';
    //         const clientSecret = 'vufr8kfJ8bbzVPH82x21KYgpdi03GYItM6hGqulql9rntYHIl0102wsfpBbeCLn2Ihdq4DoBixBcmIig1kxb4o6wPILwL4pVdm1U5SKu3DfVXzAU5Xm0BHOPawQH9ydu';

    //         // Cách an toàn nhất trong React Native: Tự ghép chuỗi (URL encoded string)
    //         // Dùng encodeURIComponent để tránh lỗi nếu pass/user có ký tự đặc biệt (@, #, khoảng trắng...)
    //         const payload = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=password&username=${encodeURIComponent(user.username)}&password=${encodeURIComponent(user.password)}`;

    //         // Gửi API
    //         let res = await Apis.post(endpoints['login'], payload, {
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded'
    //             }
    //         });

    //         // Nếu qua được đoạn trên là thành công!
    //         await AsyncStorage.setItem('token', res.data.access_token);

    //         setTimeout(async () => {
    //             let u = await authApis(res.data.access_token).get(endpoints['current-user']);
    //             dispatch({
    //                 "type": "LOGIN",
    //                 "payload": u.data
    //             });
    //         }, 500);

    //     } catch (ex) {
    //         console.error("Lỗi chi tiết từ Server:", ex.response?.data || ex.message);
    //         if (ex.response?.data?.error === 'invalid_grant') {
    //             setErr("Sai tên đăng nhập hoặc mật khẩu!");
    //         } else {
    //             setErr("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    const login = async () => {
        if (validate()) {
            try {
                setLoading(true);

                // KHÔNG dùng new FormData() ở đây nữa
                // Tạo một object thuần túy
                const payload = {
                    username: user.username,
                    password: user.password,
                    client_id: 'L3eugdz7Hbmtoz5NQS4foy2wE9YML1ekrnG3Wg6G', // Nhớ thay bằng client_id thật nếu có
                    client_secret: 'vufr8kfJ8bbzVPH82x21KYgpdi03GYItM6hGqulql9rntYHIl0102wsfpBbeCLn2Ihdq4DoBixBcmIig1kxb4o6wPILwL4pVdm1U5SKu3DfVXzAU5Xm0BHOPawQH9ydu', // Nhớ thay bằng client_secret thật nếu có
                    grant_type: 'password'
                };

                let res = await Apis.post(endpoints['login'], payload, {
                    headers: {
                        // Ép kiểu dữ liệu về form-urlencoded chuẩn OAuth2
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                await AsyncStorage.setItem('token', res.data.access_token);

                // ... Phần code còn lại của bạn giữ nguyên ...
                let u = await authApis(res.data.access_token).get(endpoints['current-user']);

                dispatch({
                    "type": "LOGIN",
                    "payload": u.data
                });

            } catch (ex) {
                console.error("Lỗi chi tiết:", ex.response?.data || ex.message);
                setErr("Đăng nhập thất bại!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={[Style.container, {paddingTop: 80}]}>

            {/* Khu vực Logo và Lời chào */}
            <View style={Style.headerContainer}>
                <Text style={Style.titleText}>DK Restaurant</Text>
                <Text style={Style.subText}>Đăng nhập để đặt món ngay!</Text>
            </View>

            {/* Khu vực Form nhập liệu */}
            <View style={Style.formContainer}>
                <HelperText style={Style.margin} type="error" visible={!!err}>
                    {err}
                </HelperText>

                {userInfo.map(u => (
                    <TextInput
                        key={u.field}
                        value={user[u.field]}
                        onChangeText={(t) => setUser({ ...user, [u.field]: t })}
                        style={Style.input}
                        label={u.title}
                        placeholder={`Nhập ${u.title.toLowerCase()}`}
                        secureTextEntry={u.secureTextEntry}
                        mode="outlined" // Chuyển sang dạng có viền bao quanh
                        outlineColor="#E0E0E0" // Viền xám nhạt khi không focus
                        activeOutlineColor="#388f35" // Đổi viền sang màu cam khi bấm vào
                        right={<TextInput.Icon icon={u.icon} color="#FF6347" />}
                    />
                ))}

                {/* Thêm nút Quên mật khẩu cho thực tế */}
                <TouchableOpacity>
                    <Text style={Style.forgotPassword}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                {/* Nút Đăng nhập */}
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