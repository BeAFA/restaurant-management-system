import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, Styleheet } from "react-native";
import { Text, Avatar, List, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import UserContext from "../../contexts/UserContext";
import { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import Style from "./Style";

const Profile = () => {
    const { user, logout } = useContext(UserContext);
    const nav = useNavigation();
    const [orderCount, setOrderCount] = useState(0);

    if (!user) return null;
    

    const isChef = user.user_role === 'CHEF';
    const isCustomer = user.user_role !== 'ADMIN' && user.user_role !== 'CHEF'; 

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Người dùng';

    useEffect(() => {
        const fetchOrderCount = async () => {
            if (isCustomer) {
                try {
                    const token = await SecureStore.getItemAsync('token');
                    const res = await authApis(token).get(endpoints['orders']);
                    
                    const count = res.data.count !== undefined ? res.data.count : res.data.length;
                    setOrderCount(count || 0);
                    
                } catch (ex) {
                    console.error("Lỗi đếm số lượng đơn hàng:", ex);
                }
            }
        };

        fetchOrderCount();
    }, [isCustomer]);

    return (
        <View style={Style.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                
                <View style={Style.headerBackground} />

                <View style={Style.profileCard}>
                    {user.avatar ? (
                        <Avatar.Image size={90} source={{ uri: user.avatar }} style={Style.avatar} />
                    ) : (
                        <Avatar.Icon size={90} icon="account" color="#fff" style={[Style.avatar, { backgroundColor: '#FF6347' }]} />
                    )}
                    
                    <Text style={Style.nameText}>{fullName}</Text>
                    <Text style={Style.usernameText}>@{user.username}</Text>

                    {isCustomer && (
                        <View style={Style.statsContainer}>
                            <View style={Style.statItem}>
                                <Text style={Style.statNumber}>{orderCount}</Text>
                                <Text style={Style.statLabel}>Đơn hàng</Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={Style.menuContainer}>
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
                                    onPress={() => nav.navigate('cart_tab')}
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
                    style={Style.logoutButton}
                    labelStyle={Style.logoutText}
                    onPress={logout}
                >
                    Đăng xuất
                </Button>

                <View style={{height: 50}} /> 
            </ScrollView>
        </View>
    );
}

export default Profile;