import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { authApis, endpoints } from "../../configs/Apis";
import styles from "../../styles/PaymentQRStyle";

const PaymentQRScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();

    const { order } = route.params || {};

    const formatCurrency = (amount) => {
        if (!amount) return "0 ₫";
        return Number(amount).toLocaleString("vi-VN") + " ₫";
    };

    const qrValue = `Bạn đã thanh toán thành công ${formatCurrency(order?.total)}`;

    const handleCheck = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");

            
            await authApis(token).post(endpoints["payment"](order?.id));

            
            Alert.alert(
                "Xác nhận thanh toán",
                qrValue,
                [
                    {
                        text: "Về trang chủ",
                        onPress: () =>
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: "CustomerTabs",
                                            state: {
                                                routes: [{ name: "menu" }],
                                            },
                                        },
                                    ],
                                })
                            ),
                    },
                ]
            );
        } catch (error) {
            const data = error?.response?.data;
            const msg =
                data?.error ||
                (typeof data === "string" ? data : "Thanh toán thất bại!");
            Alert.alert("Lỗi", msg);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="payment" size={28} color="#1976D2" />
                <Text style={styles.headerTitle}>Thanh toán</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Quét mã để xác nhận</Text>
                <Text style={styles.cardSubtitle}>
                    Dùng camera hoặc nhấn{" "}
                    <Text style={{ fontWeight: "700", color: "#1976D2" }}>
                        Kiểm tra
                    </Text>{" "}
                    để hoàn tất thanh toán
                </Text>

                <View style={styles.qrWrapper}>
                    <QRCode
                        value={qrValue}
                        size={220}
                        color="#1a1a2e"
                        backgroundColor="white"
                    />
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đơn hàng</Text>
                        <Text style={styles.infoValue}>#{order?.id}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Bàn số</Text>
                        <Text style={styles.infoValue}>
                            {order?.table ?? "—"}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tổng tiền</Text>
                        <Text style={styles.infoTotal}>
                            {formatCurrency(order?.total)}
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
                <MaterialIcons name="check-circle" size={20} color="white" />
                <Text style={styles.checkButtonText}>Kiểm tra</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: "CustomerTabs",
                                    state: {
                                        routes: [{ name: "menu" }],
                                    },
                                },
                            ],
                        })
                    )
                }
            >
                <Text style={styles.backButtonText}>Tiếp tục gọi thêm món</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default PaymentQRScreen;