import { Image, Text, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import Style from "../../styles/UserStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImgPicker from 'expo-image-picker';
import { useState, useContext, useEffect } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import UserContext from "../../contexts/UserContext";

const AccountSettings = () => {
    
    const { user: currentUser, dispatchUser } = useContext(UserContext);
    const nav = useNavigation();

    
    const [user, setUser] = useState({
        first_name: currentUser?.first_name || '',
        last_name: currentUser?.last_name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        avatar: currentUser?.avatar || null, 
    });

    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    
    const userInfo = [
        { field: 'first_name', title: 'Tên', icon: 'text' },
        { field: 'last_name', title: 'Họ và tên lót', icon: 'text' },
        { field: 'email', title: 'Email', icon: 'email' },
        { field: 'phone', title: 'Số điện thoại', icon: 'phone' }
    ];

    const picker = async () => {
        let { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
        } else {
            const result = await ImgPicker.launchImageLibraryAsync({
                mediaTypes: ImgPicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });
            if (!result.canceled) {
                
                setUser({ ...user, 'avatar': result.assets[0] });
            }
        }
    }

    const updateProfile = async () => {
        setErr(null);
        if (!user.first_name) {
            setErr('Vui lòng không để trống Tên!');
            return;
        }

        const form = new FormData();

        try {
            setLoading(true);

            
            form.append('first_name', user.first_name);
            form.append('last_name', user.last_name);
            form.append('email', user.email);
            form.append('phone', user.phone);

            
            
            if (user.avatar && typeof user.avatar !== 'string') {
                form.append('avatar', {
                    uri: user.avatar.uri,
                    name: user.avatar.fileName || 'avatar.jpg',
                    type: user.avatar.mimeType || 'image/jpeg',
                });
            }

            const token = await SecureStore.getItemAsync('token');
            const res = await authApis(token).patch(endpoints['current_user'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
                
                
                dispatchUser({
                    type: 'LOGIN', 
                    payload: res.data,
                });

                
                nav.goBack();
            }

        } catch (ex) {
            console.error(ex.response?.data);
            setErr('Cập nhật thất bại, vui lòng kiểm tra lại!');
        } finally {
            setLoading(false);
        }
    }

    
    const getAvatarUri = () => {
        if (!user.avatar) return null;
        if (typeof user.avatar === 'string') return user.avatar; 
        return user.avatar.uri; 
    };

    return (
        <View style={[Style.container, { paddingLeft: 0, paddingRight: 0 }]}>
            <View style={Style.headerContainer}>
                <Text style={Style.titleText}>Thông tin cá nhân</Text>
                <Text style={Style.subText}>Cập nhật thông tin để chúng tôi phục vụ bạn tốt hơn</Text>
            </View>

            <HelperText style={Style.errorText} type="error" visible={!!err}>
                {err}
            </HelperText>

            <ScrollView contentContainerStyle={Style.scrollContent}>
                <View style={Style.formContainer}>
                    
                    <TextInput
                        value={currentUser?.username}
                        disabled={true}
                        style={Style.input}
                        label="Tên đăng nhập"
                        mode="outlined"
                        right={<TextInput.Icon icon="lock" color="#aaa" />}
                    />

                    {userInfo.map(u => (
                        <TextInput
                            key={u.field}
                            value={user[u.field]}
                            onChangeText={(t) => setUser({ ...user, [u.field]: t })}
                            style={Style.input}
                            label={u.title}
                            placeholder={`Nhập ${u.title.toLowerCase()}`}
                            mode="outlined"
                            activeOutlineColor="#FF6347"
                            right={<TextInput.Icon icon={u.icon} color="#FF6347" />}
                        />
                    ))}

                    <TouchableOpacity style={Style.avatarPickerBtn} onPress={picker}>
                        <Text style={Style.avatarPickerText}>📸 Thay đổi ảnh đại diện</Text>
                    </TouchableOpacity>

                    {getAvatarUri() && (
                        <Image source={{ uri: getAvatarUri() }} style={Style.avatarPreview} />
                    )}

                    <Button
                        loading={loading}
                        disabled={loading}
                        mode="contained"
                        onPress={updateProfile}
                        style={Style.primaryButton}
                        labelStyle={Style.buttonLabel}
                    >
                        Lưu thay đổi
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default AccountSettings;