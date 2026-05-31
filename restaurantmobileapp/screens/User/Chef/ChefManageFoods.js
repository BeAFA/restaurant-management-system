import React, { useState, useCallback, useContext } from 'react';
import { View, FlatList, Alert, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import SimpleFood from '../../../components/SimpleFood';
import UserContext from '../../../contexts/UserContext';
import { authApis, endpoints } from '../../../configs/Apis';
import Style from '../../../styles/UserStyles';

const ChefManageFoods = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    
    const [expandedId, setExpandedId] = useState(null);

    const nav = useNavigation();
    const { user } = useContext(UserContext);

    
    const fetchChefFoods = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('token');

            
            const res = await authApis(token).get(`${endpoints['foods']}?chef_id=${user.id}`);

            const foodData = res.data.results || res.data;
            setFoods(foodData);
        } catch (ex) {
            console.error("Lỗi tải món ăn:", ex);
            Alert.alert("Lỗi", "Không thể tải danh sách món ăn.");
        } finally {
            setLoading(false);
        }
    };

    
    useFocusEffect(
        useCallback(() => {
            fetchChefFoods();
            return () => setExpandedId(null); 
        }, [])
    );

    
    const handlePressAccordion = (foodId) => {
        setExpandedId(expandedId === foodId ? null : foodId);
    };

    
    const handleDeleteFood = (food) => {
        Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa (ẩn) món ${food.dish} không?`,
            [
                { text: "Không", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setActionLoading(food.id);
                            const token = await SecureStore.getItemAsync('token');

                            await authApis(token).delete(`${endpoints['foods']}${food.id}/chef_manage_food/`);

                            Alert.alert("Thành công", "Đã xóa món ăn!");
                            fetchChefFoods(); 
                        } catch (ex) {
                            Alert.alert("Lỗi", "Không thể xóa món ăn lúc này.");
                        } finally {
                            setActionLoading(null);
                        }
                    }
                }
            ]
        );
    };

    const handleEditFood = (food) => {
        nav.navigate('update_food', { foodId: food.id });
    };

    const renderFoodItem = ({ item }) => {
        const isExpanded = expandedId === item.id;

        return (
            <View style={Style.itemContainer}>
                <View style={{ position: 'relative' }}>
                    <SimpleFood item={item} />
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        onPress={() => handlePressAccordion(item.id)}
                        activeOpacity={0.8}
                    />
                </View>

                {isExpanded && (
                    <View style={Style.actionRow}>
                        <Button
                            mode="outlined"
                            icon="pencil"
                            textColor="#1976d2"
                            style={Style.actionBtn}
                            onPress={() => handleEditFood(item)}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            mode="contained"
                            icon="delete"
                            buttonColor="#e74c3c"
                            style={Style.actionBtn}
                            loading={actionLoading === item.id}
                            disabled={actionLoading === item.id}
                            onPress={() => handleDeleteFood(item)}
                        >
                            Xóa món
                        </Button>
                    </View>
                )}
            </View>
        );
    };

    return (
        !user.is_approved ? (
            <View style={[Style.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#e74c3c', textAlign: 'center' }}>
                    Bạn chưa được phê duyệt làm đầu bếp
                </Text>

                <Text style={{ marginTop: 10, color: 'gray', textAlign: 'center' }}>
                    Vui lòng liên hệ quản trị viên để được phê duyệt tài khoản đầu bếp.
                </Text>
            </View>
        ) : (
            <View style={Style.container}>
                {/* Header chung */}
                <View style={Style.headerContainer}>
                    <Text style={Style.titleText}>Món ăn của tôi</Text>
                    <Text style={Style.subText}>Danh sách các món bạn đang phụ trách</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#FF6347" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={foods}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderFoodItem}
                        contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 30, color: 'gray' }}>
                                Bạn chưa phụ trách món ăn nào.
                            </Text>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <FAB
                    icon="plus"
                    style={Style.fab}
                    color="white"
                    onPress={() => nav.navigate('create_food')}
                />
            </View>
        )
    );
}

export default ChefManageFoods;