import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import Style from "../User/Style";
import { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";

const ChangePassword = () => {
    const nav = useNavigation();

    const [passwords, setPasswords] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [hidePass, setHidePass] = useState({
        old: true,
        new: true,
        confirm: true
    });

    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setErr(null);

        // 1. Validate ở Frontend
        if (!passwords.old_password || !passwords.new_password || !passwords.confirm_password) {
            setErr('Vui lòng điền đầy đủ các trường!');
            return;
        }
        if (passwords.new_password !== passwords.confirm_password) {
            setErr('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (passwords.new_password.length < 6) {
            setErr('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('token');

            const res = await authApis(token).patch(endpoints['change_password'], {
                old_password: passwords.old_password,
                new_password: passwords.new_password
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.status === 200) {
                Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi an toàn!", [
                    { text: "OK", onPress: () => nav.goBack() }
                ]);
            }
        } catch (ex) {
            const errorMsg = ex.response?.data?.error || "Đã có lỗi xảy ra, vui lòng thử lại!";
            console.error(ex.response?.data);
            setErr(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[Style.container, { paddingLeft: 0, paddingRight: 0 }]}>
            <View style={Style.headerContainer}>
                <Text style={Style.titleText}>Đổi mật khẩu</Text>
                <Text style={Style.subText}>Vui lòng tạo mật khẩu mạnh để bảo vệ tài khoản</Text>
            </View>

            <HelperText style={Style.errorText} type="error" visible={!!err}>
                {err}
            </HelperText>

            <ScrollView contentContainerStyle={Style.scrollContent}>
                <View style={Style.formContainer}>

                    <TextInput
                        label="Mật khẩu hiện tại"
                        mode="outlined"
                        style={Style.input}
                        activeOutlineColor="#FF6347"
                        secureTextEntry={hidePass.old}
                        value={passwords.old_password}
                        onChangeText={(t) => setPasswords({ ...passwords, old_password: t })}
                        right={
                            <TextInput.Icon
                                icon={hidePass.old ? "eye-off" : "eye"}
                                color="#FF6347"
                                onPress={() => setHidePass({ ...hidePass, old: !hidePass.old })}
                            />
                        }
                    />

                    <TextInput
                        label="Mật khẩu mới"
                        mode="outlined"
                        style={Style.input}
                        activeOutlineColor="#FF6347"
                        secureTextEntry={hidePass.new}
                        value={passwords.new_password}
                        onChangeText={(t) => setPasswords({ ...passwords, new_password: t })}
                        right={
                            <TextInput.Icon
                                icon={hidePass.new ? "eye-off" : "eye"}
                                color="#FF6347"
                                onPress={() => setHidePass({ ...hidePass, new: !hidePass.new })}
                            />
                        }
                    />

                    <TextInput
                        label="Xác nhận mật khẩu mới"
                        mode="outlined"
                        style={Style.input}
                        activeOutlineColor="#FF6347"
                        secureTextEntry={hidePass.confirm}
                        value={passwords.confirm_password}
                        onChangeText={(t) => setPasswords({ ...passwords, confirm_password: t })}
                        right={
                            <TextInput.Icon
                                icon={hidePass.confirm ? "eye-off" : "eye"}
                                color="#FF6347"
                                onPress={() => setHidePass({ ...hidePass, confirm: !hidePass.confirm })}
                            />
                        }
                    />

                    <Button
                        loading={loading}
                        disabled={loading}
                        mode="contained"
                        onPress={handleUpdate}
                        style={[Style.primaryButton, { marginTop: 20 }]}
                        labelStyle={Style.buttonLabel}
                    >
                        Cập nhật mật khẩu
                    </Button>

                </View>
            </ScrollView>
        </View>
    );
};

export default ChangePassword;