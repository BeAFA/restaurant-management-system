import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Style from '../../styles/UserStyles';
import Footer from '../../components/Footer';

export default function Account() {
    const nav = useNavigation();

    return (
        <View style={Style.accountWrapper}>
            <View style={Style.accountContent}>
                <Text style={Style.accountTitle}>Chào mừng đến DK Restaurant!</Text>
                <Text style={Style.accountSubtitle}>
                    Vui lòng đăng nhập hoặc đăng ký tài khoản mới để tiếp tục.
                </Text>

                <TouchableOpacity
                    style={Style.accountLoginBtn}
                    onPress={() => nav.navigate('login')}
                >
                    <Text style={Style.accountLoginText}>Đăng nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={Style.accountRegisterBtn}
                    onPress={() => nav.navigate('register')}
                >
                    <Text style={Style.accountRegisterText}>Đăng ký tài khoản</Text>
                </TouchableOpacity>
            </View>

            {/* Footer nằm ở cuối cùng */}
            <Footer />

        </View>
    );
}