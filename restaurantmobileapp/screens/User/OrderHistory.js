import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ActivityIndicator, List, Divider, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import Style from '../../styles/UserStyles';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const nav = useNavigation();

    
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('token');
            
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

                            
                            await authApis(token).delete(`${endpoints['orders']}${orderId}/cancel/`);

                            Alert.alert("Thành công", "Đã hủy đơn hàng!");
                            fetchOrders(); 
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

    const handlePayOrder = (order) => {
        nav.navigate("payment_qr", { order });
    };


    
    const getStatusStyle = (status) => {
        switch (status) {
            case 'WAITING': return { color: '#f39c12', label: 'Đang chờ' };
            case 'SUCCESS': return { color: '#2ecc71', label: 'Đã thanh toán' };
            case 'CANCEL': return { color: '#e74c3c', label: 'Đã hủy' };
            default: return { color: '#95a5a6', label: status };
        }
    };

    return (
        <SafeAreaView style={Style.container}>

            {loading ? (
                <ActivityIndicator size="large" color="#FF6347" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                    {orders.length === 0 ? (
                        <Text style={Style.emptyText}>Bạn chưa có đơn hàng nào.</Text>
                    ) : (
                        orders.map((order) => {
                            const statusInfo = getStatusStyle(order.status_order);

                            return (
                                <Card key={order.id} style={Style.orderCard}>
                                    <List.Accordion
                                        title={`Đơn hàng #${order.id}`}
                                        description={`Tổng tiền: ${order.total ? order.total.toLocaleString() : 0}đ`}
                                        titleStyle={{ fontWeight: 'bold' }}
                                        left={props => <List.Icon {...props} icon="receipt-text-outline" />}
                                        right={props => (
                                            <View style={Style.statusBadge}>
                                                <Text style={{ color: statusInfo.color, fontWeight: 'bold', fontSize: 12 }}>
                                                    {statusInfo.label}
                                                </Text>
                                            </View>
                                        )}
                                        style={Style.orderAccordionHeader}
                                    >
                                        <View style={Style.detailsContainer}>
                                            <Text style={Style.detailTitle}>Chi tiết món ăn:</Text>
                                            {order.details && order.details.map((item, index) => (
                                                <View key={index} style={Style.foodRow}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={Style.foodName}>{item.dish_name || "Món ăn"}</Text>
                                                        <Text style={Style.foodMeta}>
                                                            {item.unit_price ? item.unit_price.toLocaleString() : 0}đ x {item.quantity}
                                                        </Text>
                                                    </View>
                                                    <Text style={Style.foodTotal}>
                                                        {item.total_price ? item.total_price.toLocaleString() : 0}đ
                                                    </Text>
                                                </View>
                                            ))}

                                            <Text style={Style.dateText}>
                                                Ngày đặt: {new Date(order.created_date).toLocaleString('vi-VN')}
                                            </Text>
                                        </View>
                                    </List.Accordion>

                                    {order.status_order === 'WAITING' && (
                                        <View>
                                            <Divider />
                                            <Card.Actions style={Style.actions}>
                                                <Button
                                                    mode="contained"
                                                    icon="qrcode"
                                                    buttonColor="#1976D2"
                                                    loading={actionLoading === `pay_${order.id}`}
                                                    disabled={actionLoading !== null}
                                                    onPress={() => handlePayOrder(order)}
                                                >
                                                    Thanh toán
                                                </Button>
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
                                        </View>
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

export default OrderHistory;