import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { authApis, endpoints } from '../../configs/Apis';
import * as SecureStore from 'expo-secure-store';
import Style from '../../styles/AdminStyles';

const CheckIn = () => {
    const [reservationId, setReservationId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async (reservationId) => {
        try {
            const token = await SecureStore.getItemAsync('token');

            // Gọi API POST. 
            // Tham số 1: URL được render ra từ hàm
            // Tham số 2: Dữ liệu body (ở đây API không yêu cầu body nên để trống {})
            const res = await authApis(token).post(endpoints['check_in'](reservationId), {});

            console.log("Check-in thành công:", res.data);
            // Thông báo cho user...
        } catch (ex) {
            if (ex.response) {
                console.log("Lỗi từ server:", ex.response.data.error); // Ví dụ: "Chưa tới giờ check-in"
            }
        }
    }

    return (
        <View style={Style.checkinContainer}>
            <Title style={Style.checkinTitle}>Check-in Khách Hàng</Title>

            <TextInput
                label="Mã đặt bàn (Reservation ID)"
                value={reservationId}
                onChangeText={setReservationId}
                keyboardType="numeric"
                style={Style.checkinInput}
                mode="outlined"
            />

            <Button
                mode="contained"
                onPress={() => handleCheckIn(reservationId)}
                loading={loading}
                disabled={loading}
            >
                Xác nhận Check-in
            </Button>

            <Button icon="qrcode-scan" mode="outlined" style={Style.qrButtonMargin}>
                Quét QR Code
            </Button>
        </View>
    );
}

export default CheckIn;