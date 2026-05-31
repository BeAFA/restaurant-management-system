import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Style from "../../styles/UserStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImgPicker from 'expo-image-picker';
import { useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../components/Footer";

const ChefCreate = () => {

    const userInfo = [{
        field: 'first_name',
        title: 'Tên',
        icon: 'text',
    }, {
        field: 'last_name',
        title: 'Họ và tên lót',
        icon: 'text',
    }, {
        field: 'email',
        title: 'Email',
        icon: 'text',
    }, {
        field: 'phone',
        title: 'Số điện thoại',
        icon: 'phone',
    }, {
        field: 'username',
        title: 'Tên đăng nhập',
        icon: 'account',
    }];

    const userPassword = [{
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

    const [hidePass, setHidePass] = useState({
            confirm: true
        });

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
        setErr(null);
        if (!user.first_name) {
            setErr('Vui lòng nhập tên');
            return false;
        }
        if (!user.username) {
            setErr('Vui lòng nhập tên đăng nhập');
            return false;
        }
        if (!user.password) {
            setErr('Vui lòng nhập mật khẩu');
            return false;
        }
        if (user.password !== user.confirm) {
            setErr('Mật khẩu KHÔNG khớp!');
            return false;
        }
        return true;
    }

    const register = async () => {
        if (!validate()) return;

        const form = new FormData();

        try {
            setLoading(true);

            for (const key of Object.keys(user)) {
                if (key === 'confirm') continue;

                if (key === 'avatar') {
                    form.append('avatar', {
                        uri: user.avatar.uri,
                        name: user.avatar.fileName || 'avatar.jpg',
                        type: user.avatar.mimeType || 'image/jpeg',
                    });
                } else {
                    form.append(key, user[key]);
                }
                form.append('user_role', 'CHEF');
            }

            const res = await Apis.post(endpoints['register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                alert('Đăng ký đầu bếp thành công!');
                
            }

        } catch (ex) {
            const data = ex.response?.data;
            if (data) {
                const firstError = Object.values(data)[0];
                setErr(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setErr('Đăng ký thất bại, vui lòng thử lại!');
            }
            console.error(ex.response?.data);
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={[Style.container, { paddingLeft: 0, paddingRight: 0 }]}>
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
                            mode="outlined" 
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#FF6347" 
                            right={<TextInput.Icon icon={u.icon} color="#FF6347" />}
                        />
                    ))}
                    {userPassword.map(u => (
                        <TextInput
                            value={user[u.field]}
                            key={u.field}
                            onChangeText={(t) => setUser({ ...user, [u.field]: t })}
                            style={Style.input}
                            label={u.title}
                            placeholder={`Nhập ${u.title.toLowerCase()}`}
                            secureTextEntry={u.secureTextEntry && hidePass.confirm}
                            mode="outlined" 
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#FF6347" 
                            right={
                                <TextInput.Icon
                                    icon={hidePass.confirm ? "eye-off" : "eye"}
                                    color="#FF6347"
                                    onPress={() => setHidePass({ ...hidePass, confirm: !hidePass.confirm })}
                                />
                            }
                        />
                    ))}

                    <TouchableOpacity style={Style.avatarPickerBtn} onPress={picker}>
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

            <Footer />
        </View>

    );
}

export default ChefCreate;