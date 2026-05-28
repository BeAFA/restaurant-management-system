import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Title, ActivityIndicator, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import styles from './Style'; // Tái sử dụng file style chung hồi nãy

const AdminManage = () => {
    const [pendingChefs, setPendingChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Lưu ID của user đang bị bấm duyệt để hiện loading xoay xoay

    // Lấy danh sách chờ duyệt
    const fetchPendingChefs = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await authApis(token).get(endpoints['pending_chefs']);
            setPendingChefs(res.data);
            console.log("Danh sách đầu bếp chờ duyệt:", res.data);
        } catch (ex) {
            console.error("Lỗi lấy danh sách bếp chờ duyệt:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingChefs();
    }, []);

    // Hàm xử lý khi bấm nút "Duyệt"
    const handleApprove = async (userId, userName) => {
        // Hộp thoại xác nhận (Confirm) trước khi duyệt
        Alert.alert(
            "Xác nhận duyệt",
            `Bạn có chắc chắn muốn cấp quyền cho đầu bếp ${userName}?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Duyệt ngay",
                    onPress: async () => {
                        try {
                            setActionLoading(userId); // Bật loading cho riêng nút của user này
                            const token = await SecureStore.getItemAsync('token');

                            // Gọi API duyệt (Method PATCH)
                            await authApis(token).patch(endpoints['approve_chef'](userId), {
                                is_approved: true
                            }, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            Alert.alert("Thành công", `Tài khoản ${userName} đã được duyệt!`);

                            // Cập nhật lại UI: Lọc (xóa) user vừa duyệt khỏi mảng pendingChefs
                            setPendingChefs(currentList => currentList.filter(chef => chef.id !== userId));

                        } catch (ex) {
                            Alert.alert("Lỗi", "Không thể duyệt tài khoản này!");
                            console.error(ex.response ? ex.response.data : ex);
                        } finally {
                            setActionLoading(null);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView style={styles.container}>

                <Title style={styles.header}>Quản lý Đầu bếp chờ duyệt</Title>

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                ) : (
                    <>
                        {pendingChefs.length === 0 ? (
                            <View style={localStyles.emptyBox}>
                                <Text style={localStyles.emptyText}>Hiện không có đầu bếp nào cần duyệt.</Text>
                            </View>
                        ) : (
                            pendingChefs.map((chef) => (
                                <Card key={chef.id} style={localStyles.userCard}>
                                    <Card.Title
                                        title={chef.username}
                                        subtitle={chef.email || "Chưa cập nhật Email"}
                                        left={(props) =>
                                            chef.avatar ?
                                                <Avatar.Image {...props} source={{ uri: chef.avatar }} /> :
                                                <Avatar.Icon {...props} icon="account" />
                                        }
                                        right={(props) => (
                                            <Button
                                                mode="contained"
                                                buttonColor="#2e7d32" // Màu xanh lá
                                                style={{ marginRight: 10 }}
                                                loading={actionLoading === chef.id}
                                                disabled={actionLoading === chef.id}
                                                onPress={() => handleApprove(chef.id, chef.username)}
                                            >
                                                Duyệt
                                            </Button>
                                        )}
                                    />
                                </Card>
                            ))
                        )}
                    </>
                )}

                {/* KHU VỰC DÀNH CHO YÊU CẦU 2 (Quản lý User chung) SẼ ĐƯỢC THÊM VÀO ĐÂY SAU */}

            </ScrollView>
        </SafeAreaView>
    );
};

// Vài style phụ trợ dành riêng cho màn hình này
const localStyles = StyleSheet.create({
    userCard: {
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 2
    },
    emptyBox: {
        padding: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        alignItems: 'center'
    },
    emptyText: {
        color: '#555',
        fontStyle: 'italic'
    }
});

export default AdminManage;