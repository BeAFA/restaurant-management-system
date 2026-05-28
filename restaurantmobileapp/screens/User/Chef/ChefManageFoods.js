import React, { useState, useCallback, useContext } from 'react';
import { View, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, List, Button, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import SimpleFood from '../../../components/SimpleFood';
import UserContext from '../../../contexts/UserContext';
import { authApis, endpoints } from '../../../configs/Apis';
import Style from '../Style'; // Import Style chung

const ChefManageFoods = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    
    // State để theo dõi xem món nào đang được "xổ xuống"
    const [expandedId, setExpandedId] = useState(null);

    const nav = useNavigation();
    const { user } = useContext(UserContext);

    // 1. Hàm lấy danh sách món ăn của Chef
    const fetchChefFoods = async () => {
        try {
            setLoading(true);
            const token = await SecureStore.getItemAsync('token');
            
            // Gọi API lấy danh sách Food, lọc theo chef_id
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

    // Tự động load lại dữ liệu mỗi khi màn hình này hiện lên
    useFocusEffect(
        useCallback(() => {
            fetchChefFoods();
            return () => setExpandedId(null); // Đóng hết accordion khi rời đi
        }, [])
    );

    // 2. Xử lý mở/đóng Accordion
    const handlePressAccordion = (foodId) => {
        setExpandedId(expandedId === foodId ? null : foodId);
    };

    // 3. Xử lý Hủy (Xóa mềm) món ăn
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
                            fetchChefFoods(); // Tải lại danh sách
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

    // 4. CHỈNH SỬA: Điều hướng sang màn hình UpdateFood và truyền foodId
    const handleEditFood = (food) => {
        // Đảm bảo bạn đã đăng ký màn hình 'update_food' trong file Router của bạn
        nav.navigate('update_food', { foodId: food.id });
    };

    const renderFoodItem = ({ item }) => {
        const isExpanded = expandedId === item.id;

        return (
            <View style={localStyles.itemContainer}>
                <List.Accordion
                    expanded={isExpanded}
                    onPress={() => handlePressAccordion(item.id)}
                    style={localStyles.accordionHeader}
                    right={props => null} 
                    title={
                        <View pointerEvents="none"> 
                            <SimpleFood item={item} />
                        </View>
                    }
                >
                    <View style={localStyles.actionRow}>
                        <Button 
                            mode="outlined" 
                            icon="pencil"
                            textColor="#1976d2"
                            style={localStyles.actionBtn}
                            onPress={() => handleEditFood(item)}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button 
                            mode="contained" 
                            icon="delete"
                            buttonColor="#e74c3c"
                            style={localStyles.actionBtn}
                            loading={actionLoading === item.id}
                            disabled={actionLoading === item.id}
                            onPress={() => handleDeleteFood(item)}
                        >
                            Xóa món
                        </Button>
                    </View>
                </List.Accordion>
            </View>
        );
    };

    return (
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

            {/* CHỈNH SỬA: Sửa lỗi thẻ FAB có 2 thuộc tính onPress */}
            <FAB
                icon="plus"
                style={localStyles.fab}
                color="white"
                onPress={() => nav.navigate('create_food')}
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    accordionHeader: {
        backgroundColor: '#fff',
        padding: 0, 
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: '#fafafa', 
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionBtn: {
        marginLeft: 10,
        borderRadius: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#FF6347',
    }
});

export default ChefManageFoods;