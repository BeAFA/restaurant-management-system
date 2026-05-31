import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, ActivityIndicator, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import styles from '../../styles/AdminStyles';
import Header from '../../components/Header';

const AdminManage = () => {
    const [pendingChefs, setPendingChefs] = useState([]);
    const [allApprovedChefs, setAllApprovedChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);


    const fetchPendingChefs = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await authApis(token).get(endpoints['pending_chefs']);
            setPendingChefs(res.data);
        } catch (ex) {
            console.error("Lỗi lấy danh sách bếp chờ duyệt:");
        } finally {
            setLoading(false);
        }
    };
    const fetchAllApprovedChefs = async () => {
        try {
            const res = await Apis.get(`${endpoints['chef_list']}?is_approved=true`);
            setAllApprovedChefs(res.data);
        } catch (ex) {
            console.error("Lỗi lấy danh sách bếp:");
        } finally {
            setLoading(false);
        }
    };

    const getChefName = (chef) => {
        if (chef.name) return chef.name;

        const firstName = chef.first_name || "";
        const lastName = chef.last_name || "";

        return `${firstName} ${lastName}`.trim();
    };

    useEffect(() => {
        fetchPendingChefs();
        fetchAllApprovedChefs();
    }, []);


    const handleApprove = async (userId, userName) => {

        Alert.alert(
            "Xác nhận duyệt",
            `Bạn có chắc chắn muốn cấp quyền cho đầu bếp ${userName}?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Duyệt ngay",
                    onPress: async () => {
                        try {
                            setActionLoading(userId);
                            const token = await SecureStore.getItemAsync('token');


                            await authApis(token).patch(endpoints['approve_chef'](userId), {
                                is_approved: true
                            }, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            Alert.alert("Thành công", `Tài khoản ${userName} đã được duyệt!`);


                            fetchAllApprovedChefs();
                            fetchPendingChefs();

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

    const handleDeleteApprove = async (userId, userName) => {

        Alert.alert(
            "Xác nhận thu hồi quyền",
            `Bạn có chắc chắn muốn thu hồi quyền cho đầu bếp ${userName}?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Thu hồi ngay",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setActionLoading(userId);
                            const token = await SecureStore.getItemAsync('token');


                            await authApis(token).patch(endpoints['approve_chef'](userId), {
                                is_approved: false
                            }, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            Alert.alert("Thành công", `Tài khoản ${userName} đã được thu hồi quyền!`);

                            fetchAllApprovedChefs();
                            fetchPendingChefs();

                        } catch (ex) {
                            Alert.alert("Lỗi", "Không thể thu hồi quyền tài khoản này!");
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
        <SafeAreaView style={styles.screenBackground}>
            <ScrollView style={styles.container}>
                <Header />
                <View>
                    <Title style={styles.header}>Quản lý Đầu bếp</Title>
                    <Button
                        mode="contained-tonal"
                        icon="refresh"
                        onPress={() => {
                            setLoading(true);
                            fetchPendingChefs();
                            fetchAllApprovedChefs();
                        }}
                    >
                        Reload
                    </Button>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" style={styles.loadingIndicator} />
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Đầu bếp chờ duyệt</Text>
                        {pendingChefs.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>Hiện không có đầu bếp nào cần duyệt.</Text>
                            </View>
                        ) : (
                            pendingChefs.map((chef) => (
                                <Card key={chef.id} style={styles.userCard}>
                                    <Card.Title
                                        title={getChefName(chef)}
                                        subtitle={chef.email || "Chưa cập nhật Email"}
                                        left={(props) =>
                                            chef.avatar ?
                                                <Avatar.Image {...props} source={{ uri: chef.avatar }} /> :
                                                <Avatar.Icon {...props} icon="account" />
                                        }
                                        right={(props) => (
                                            <Button
                                                mode="contained"
                                                buttonColor="#2e7d32"
                                                style={styles.actionButtonMargin}
                                                loading={actionLoading === chef.id}
                                                disabled={actionLoading === chef.id}
                                                onPress={() => handleApprove(chef.id, getChefName(chef))}
                                            >
                                                Duyệt
                                            </Button>
                                        )}
                                    />
                                </Card>
                            ))
                        )}

                        <Text style={styles.sectionTitle}>Đầu bếp đã duyệt</Text>
                        {allApprovedChefs.length > 0 && (
                            allApprovedChefs.map((chef) => (
                                <Card key={chef.id} style={styles.userCard}>
                                    <Card.Title
                                        title={getChefName(chef)}
                                        subtitle={chef.email || "Chưa cập nhật Email"}
                                        left={(props) =>
                                            chef.avatar ?
                                                <Avatar.Image {...props} source={{ uri: chef.avatar }} /> :
                                                <Avatar.Icon {...props} icon="account" />
                                        }
                                        right={(props) => (
                                            <Button
                                                mode="contained"
                                                buttonColor="#ff0000b7"
                                                style={styles.actionButtonMargin}
                                                loading={actionLoading === chef.id}
                                                disabled={actionLoading === chef.id}
                                                onPress={() => handleDeleteApprove(chef.id, getChefName(chef))}
                                            >
                                                Thu hồi quyền
                                            </Button>
                                        )}
                                    />
                                </Card>
                            ))
                        )}
                    </>
                )}


            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminManage;