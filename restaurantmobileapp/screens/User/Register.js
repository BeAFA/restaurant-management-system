import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
// Nhớ đổi đường dẫn này trỏ tới file RegisterStyles.js bạn vừa tạo
import Style from "./Style";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImgPicker from 'expo-image-picker';
import { useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {

    const userInfo = [{
        field: 'first_name',
        title: 'Tên',
        icon: 'text',
    }, {
        field: 'last_name',
        title: 'Họ và tên lót',
        icon: 'text',
    },{
        field: 'email',
        title: 'Email',
        icon: 'text',
    },{
        field: 'phone',
        title: 'Số điện thoại',
        icon: 'phone',
    }, {
        field: 'username',
        title: 'Tên đăng nhập',
        icon: 'account',
    }, {
        field: 'password',
        title: 'Mật khẩu',
        icon: 'eye',
        secureTextEntry: true
    }, {
        field: 'confirm',
        title: 'Xác nhận mật khẩu',
        icon: 'eye',
        secureTextEntry: true
    }];

    const [user, setUser] = useState({});
    const [err, setErr] = useState(null);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const picker = async () => {
        let { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImgPicker.launchImageLibraryAsync();
            if (!result.canceled)
                setUser({ ...user, 'avatar': result.assets[0] })
        }
    }

    const validate = () => {
        if (!user.username)
            setErr('Vui lòng nhập tên đăng nhập');
        else if (!user.password || !user.confirm || user.password !== user.confirm)
            setErr('Mật khẩu KHÔNG khớp!');
        else {
            setErr(null); // Xóa lỗi nếu đã hợp lệ
            return true;
        }
    }

    const register = async () => {
        if (validate()) {
            let form = new FormData();

            try {
                setLoading(true);

                for (var key of Object.keys(user)) {
                    if (key !== 'confirm') {
                        if (key === 'avatar') {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: "image/jpeg" // user.avatar.type // 
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }

                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (res.status === 201)
                    nav.navigate('login');
                else
                    alert("Hệ thống đang có lỗi!");
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={[Style.container, {paddingLeft: 0, paddingRight: 0}]}>
            {/* Dùng ScrollView để chống tràn màn hình khi mở bàn phím */}
            <View style={Style.headerContainer}>
                    <Text style={Style.titleText}>Tham gia DK Restaurant</Text>
                    <Text style={Style.subText}>Tạo tài khoản để khám phá hàng ngàn món ngon</Text>
                </View>

                <HelperText style={Style.errorText} type="error" visible={!!err}>
                    {err}
                </HelperText>
            <ScrollView contentContainerStyle={Style.scrollContent}>

                

                <View style={Style.formContainer}>
                    {userInfo.map(u => (
                        <TextInput
                            value={user[u.field]}
                            key={u.field}
                            onChangeText={(t) => setUser({ ...user, [u.field]: t })}
                            style={Style.input}
                        label={u.title}
                        placeholder={`Nhập ${u.title.toLowerCase()}`}
                        secureTextEntry={u.secureTextEntry}
                        mode="outlined" // Kiểu viền bao quanh
                        outlineColor="#E0E0E0"
                        activeOutlineColor="#FF6347" // Màu viền cam khi gõ
                        right={<TextInput.Icon icon={u.icon} color="#FF6347" />}
                    />
                ))}

                {/* Khu vực chọn ảnh đại diện được thiết kế lại */}
                <TouchableOpacity style={Style.avatarPickerBtn} onPress={picker}>
                    {/* Dùng icon camera của react-native-paper nếu bạn muốn, ở đây dùng text cho đơn giản */}
                    <Text style={Style.avatarPickerText}>📸 Chọn ảnh đại diện</Text>
                </TouchableOpacity>

                {user.avatar && (
                    <Image source={{ uri: user.avatar.uri }} style={Style.avatarPreview} />
                )}

                <Button
                    loading={loading}
                    disabled={loading}
                    mode="contained"
                    onPress={register}
                    style={Style.primaryButton}
                    labelStyle={Style.buttonLabel}
                >
                    Đăng ký ngay
                </Button>
                </View>
            </ScrollView>
        </View>
        
    );
}

export default Register;