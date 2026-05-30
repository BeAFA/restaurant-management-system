import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Style from '../../styles/UserStyles';

export default function Account() {
    const nav = useNavigation();

    return (
        <View style={Style.accountContainer}>
            <Text style={Style.accountTitle}>Chào mừng bạn!</Text>
            <Text style={Style.accountSubtitle}>
                Vui lòng đăng nhập hoặc tạo tài khoản mới để tiếp tục.
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
    );
}