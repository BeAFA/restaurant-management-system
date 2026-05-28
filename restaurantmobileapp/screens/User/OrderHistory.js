import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ActivityIndicator, List, Divider, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const nav = useNavigation();

    // 1. Lấy danh sách Order
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('token');
            // Gọi API lấy danh sách order của current user
            const res = await authApis(token).get(endpoints['orders']);
            setOrders(res.data);
        } catch (ex) {
            console.error("Lỗi lấy lịch sử đơn hàng:", ex);
            Alert.alert("Lỗi", "Không thể tải lịch sử đơn hàng!");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    // 2. Xử lý Hủy Đơn Hàng (DELETE /cancel/)
    const handleCancelOrder = (orderId) => {
        Alert.alert(
            "Xác nhận hủy",
            "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            [
                { text: "Không", style: "cancel" },
                {
                    text: "Hủy đơn",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setActionLoading(orderId);
                            const token = await SecureStore.getItemAsync('token');

                            // Gọi API cancel
                            await authApis(token).delete(`${endpoints['orders']}${orderId}/cancel/`);

                            Alert.alert("Thành công", "Đã hủy đơn hàng!");
                            fetchOrders(); // Tải lại danh sách sau khi hủy
                        } catch (ex) {
                            Alert.alert("Lỗi", "Không thể hủy đơn hàng lúc này.");
                        } finally {
                            setActionLoading(null);
                        }
                    }
                }
            ]
        );
    };



    // Hàm render màu sắc trạng thái
    const getStatusStyle = (status) => {
        switch (status) {
            case 'WAITING': return { color: '#f39c12', label: 'Đang chờ' };
            case 'SUCCESS': return { color: '#2ecc71', label: 'Đã thanh toán' };
            case 'CANCEL': return { color: '#e74c3c', label: 'Đã hủy' };
            default: return { color: '#95a5a6', label: status };
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>

            {loading ? (
                <ActivityIndicator size="large" color="#FF6347" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                    {orders.length === 0 ? (
                        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
                    ) : (
                        orders.map((order) => {
                            const statusInfo = getStatusStyle(order.status_order);

                            return (
                                <Card key={order.id} style={styles.orderCard}>
                                    <List.Accordion
                                        title={`Đơn hàng #${order.id}`}
                                        description={`Tổng tiền: ${order.total ? order.total.toLocaleString() : 0}đ`}
                                        titleStyle={{ fontWeight: 'bold' }}
                                        left={props => <List.Icon {...props} icon="receipt-text-outline" />}
                                        right={props => (
                                            <View style={styles.statusBadge}>
                                                <Text style={{ color: statusInfo.color, fontWeight: 'bold', fontSize: 12 }}>
                                                    {statusInfo.label}
                                                </Text>
                                            </View>
                                        )}
                                        style={styles.accordionHeader}
                                    >
                                        <View style={styles.detailsContainer}>
                                            <Text style={styles.detailTitle}>Chi tiết món ăn:</Text>
                                            {order.details && order.details.map((item, index) => (
                                                <View key={index} style={styles.foodRow}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.foodName}>{item.dish_name || "Món ăn"}</Text>
                                                        <Text style={styles.foodMeta}>
                                                            {item.unit_price ? item.unit_price.toLocaleString() : 0}đ x {item.quantity}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.foodTotal}>
                                                        {item.total_price ? item.total_price.toLocaleString() : 0}đ
                                                    </Text>
                                                </View>
                                            ))}

                                            <Text style={styles.dateText}>
                                                Ngày đặt: {new Date(order.created_date).toLocaleString('vi-VN')}
                                            </Text>
                                        </View>
                                    </List.Accordion>

                                    {order.status_order === 'WAITING' && (
                                        <>
                                            <Divider />
                                            <Card.Actions style={styles.actions}>
                                                <Button
                                                    mode="contained"
                                                    icon="cancel"
                                                    buttonColor="#e74c3c"
                                                    loading={actionLoading === order.id}
                                                    disabled={actionLoading === order.id}
                                                    onPress={() => handleCancelOrder(order.id)}
                                                >
                                                    Hủy đơn
                                                </Button>
                                            </Card.Actions>
                                        </>
                                    )}
                                </Card>
                            );
                        })
                    )}
                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#FF6347', padding: 15, alignItems: 'center' },
    headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: 'gray' },
    orderCard: { marginBottom: 15, backgroundColor: '#fff', elevation: 2, borderRadius: 8, overflow: 'hidden' },
    accordionHeader: { backgroundColor: '#fff' },
    statusBadge: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#f0f0f0', borderRadius: 12, alignSelf: 'center', marginRight: 10 },
    detailsContainer: { padding: 15, backgroundColor: '#fafafa', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    detailTitle: { fontWeight: 'bold', marginBottom: 10, color: '#333' },
    foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#ddd' },
    foodName: { fontSize: 15, fontWeight: '500', color: '#000' },
    foodMeta: { fontSize: 13, color: '#666', marginTop: 2 },
    foodTotal: { fontSize: 15, fontWeight: 'bold', color: '#FF6347' },
    dateText: { fontSize: 12, color: 'gray', marginTop: 10, fontStyle: 'italic', textAlign: 'right' },
    actions: { padding: 10, justifyContent: 'flex-end', backgroundColor: '#fff' }
});

export default OrderHistory;