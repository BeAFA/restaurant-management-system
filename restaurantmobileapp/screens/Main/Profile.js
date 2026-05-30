import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { Text, Avatar, List, Button } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import UserContext from "../../contexts/UserContext";
import { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import MainStyles from "../../styles/MainStyles";

const Profile = () => {
    const { user, logout } = useContext(UserContext);
    const nav = useNavigation();
    const [orderCount, setOrderCount] = useState(0);

    if (!user) return null;


    const isChef = user.user_role === 'CHEF';
    const isCustomer = user.user_role !== 'ADMIN' && user.user_role !== 'CHEF';

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Người dùng';

    const fetchOrderCount = async () => {
        if (isCustomer) {
            try {
                const token = await SecureStore.getItemAsync('token');
                const res = await authApis(token).get(endpoints['orders']);

                const count =
                    res.data.count !== undefined
                        ? res.data.count
                        : res.data.length;

                setOrderCount(count || 0);

            } catch (ex) {
                console.error("Lỗi đếm số lượng đơn hàng:", ex);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrderCount();
        }, [isCustomer])
    );

    return (
        <View style={MainStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                <View style={MainStyles.headerBackground} />

                <View style={MainStyles.profileCard}>
                    <View style={MainStyles.avatarContainer}>
                        {user.avatar ? (
                            <Avatar.Image
                                size={90}
                                source={{ uri: user.avatar }}
                                style={MainStyles.avatarImage}
                            />
                        ) : (
                            <Avatar.Icon
                                size={90}
                                icon="account"
                                color="#fff"
                                style={MainStyles.avatarImage}
                            />
                        )}
                    </View>

                    <Text style={MainStyles.nameText}>{fullName}</Text>
                    <Text style={MainStyles.usernameText}>@{user.username}</Text>

                    {isCustomer && (
                        <View style={MainStyles.statsContainer}>
                            <View style={MainStyles.statItem}>
                                <Text style={MainStyles.statNumber}>{orderCount}</Text>
                                <Text style={MainStyles.statLabel}>Đơn hàng</Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={MainStyles.menuContainer}>
                    <List.Section>

                        {isCustomer && (
                            <>
                                <List.Item
                                    title="Lịch sử đơn hàng"
                                    description="Xem lại chi tiết các đơn hàng đã đặt"
                                    left={props => <List.Icon {...props} icon="receipt" color="#FF6347" />}
                                    right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                                    onPress={() => nav.navigate('order_history')}
                                />

                                <List.Item
                                    title="Giỏ hàng của tôi"
                                    description="Xem lại các món đã thêm vào giỏ"
                                    left={props => <List.Icon {...props} icon="cart" color="#FF6347" />}
                                    right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                                    onPress={() => nav.navigate('cart_index')}
                                />
                            </>
                        )}

                        {isChef && (
                            <List.Item
                                title="Quản lý món ăn"
                                description="Danh sách món ăn bạn phụ trách"
                                left={props => <List.Icon {...props} icon="silverware-fork-knife" color="#FF6347" />}
                                right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                                onPress={() => nav.navigate('chef_foods_manage', { screen: 'chef_manage_foods' })}
                            />
                        )}

                        <List.Item
                            title="Chỉnh sửa thông tin cá nhân"
                            left={props => <List.Icon {...props} icon="account-edit" color="#7f8c8d" />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                            onPress={() => nav.navigate('account_settings')}
                        />
                        <List.Item
                            title="Đổi mật khẩu"
                            left={props => <List.Icon {...props} icon="lock" color="#7f8c8d" />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                            onPress={() => nav.navigate('change_password')}
                        />
                    </List.Section>
                </View>

                <Button
                    mode="contained"
                    icon="logout"
                    buttonColor="#ffebee"
                    textColor="#d32f2f"
                    style={MainStyles.logoutButton}
                    labelStyle={MainStyles.logoutText}
                    onPress={logout}
                >
                    Đăng xuất
                </Button>

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
}

export default Profile;