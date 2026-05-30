import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, Modal, ScrollView, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authApis, endpoints } from "../../configs/Apis";
import Style from '../../styles/ServiceStyles';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import UserContext from '../../contexts/UserContext';
import TableContext from '../../contexts/TableContext';

const Reservation = () => {
    const nav = useNavigation();
    const { user } = useContext(UserContext);
    const { selectTableFromReservation } = useContext(TableContext);

    const [loading, setLoading] = useState(true);
    const [currentBooking, setCurrentBooking] = useState(null);

    const [serveTime, setServeTime] = useState(() => {
        const d = new Date();
        d.setSeconds(0, 0);
        return d;
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [customerQuantity, setCustomerQuantity] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [allTables, setAllTables] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (user) checkCurrentReservation();
        else setLoading(false);
    }, [user]);

    const checkCurrentReservation = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await authApis(token).get(endpoints['current_reservation']);
            setCurrentBooking(res.data ?? null);
        } catch {
            setCurrentBooking(null);
        } finally {
            setLoading(false);
        }
    };

    const loadTables = async (start, quantity) => {
        if (!quantity || Number(quantity) <= 0) { setAllTables([]); return; }
        try {
            const token = await SecureStore.getItemAsync('token');
            const params = new URLSearchParams({
                serve_time: start.toISOString(),
                customer_quantity: Number(quantity),
            });
            const res = await authApis(token).get(`${endpoints['tables']}?${params}`);
            setAllTables(res.data.results ?? res.data);
            setSelectedTable(null);
        } catch (e) {
            console.log('Lỗi tải bàn:', e);
        }
    };

    // Kiểm tra ngày + giờ hợp lệ.
    // - Nếu ngày chọn là hôm nay: thời gian phải trong tương lai.
    // - Nếu ngày chọn là ngày mai trở đi: luôn hợp lệ, không cần check giờ.
    const isDateTimeValid = (dt) => {
        const now = new Date();
        const isToday =
            dt.getFullYear() === now.getFullYear() &&
            dt.getMonth() === now.getMonth() &&
            dt.getDate() === now.getDate();
        if (isToday) return dt > now;
        return true;
    };

    const isFutureDate = (dt) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const chosen = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        return chosen > today;
    };

    const onDateChange = (event, selected) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (event.type === 'dismissed' || !selected) return;

        // Gộp ngày mới với giờ hiện tại đang chọn
        const updated = new Date(serveTime);
        updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());

        // Chặn chọn ngày trong quá khứ
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (updated < today) {
            Alert.alert("Lỗi thời gian", "Vui lòng chọn ngày từ hôm nay trở đi.");
            return;
        }

        setServeTime(updated);
        loadTables(updated, customerQuantity);
    };

    const onTimeChange = (event, selected) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (event.type === 'dismissed' || !selected) return;

        const updated = new Date(serveTime);
        updated.setHours(selected.getHours(), selected.getMinutes(), 0, 0);

        // Chỉ kiểm tra giờ nếu ngày đang chọn là HÔM NAY
        if (!isFutureDate(updated) && updated <= new Date()) {
            Alert.alert("Lỗi thời gian", "Hôm nay vui lòng chọn giờ trong tương lai.");
            return;
        }

        setServeTime(updated);
        loadTables(updated, customerQuantity);
    };

    const handlePreSubmit = () => {
        if (!customerQuantity || Number(customerQuantity) <= 0) {
            Alert.alert("Lỗi", "Vui lòng nhập số lượng khách hợp lệ.");
            return;
        }
        if (!selectedTable) {
            Alert.alert("Lỗi", "Vui lòng chọn một bàn.");
            return;
        }
        // Final check: ngày hôm nay thì giờ phải còn hợp lệ
        if (!isDateTimeValid(serveTime)) {
            Alert.alert("Lỗi thời gian", "Thời gian đặt bàn đã qua, vui lòng chọn lại.");
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmReservation = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            const payload = {
                table: selectedTable.id,
                customer_quantity: Number(customerQuantity),
                serve_time: serveTime.toISOString(),
            };
            const res = await authApis(token).post(endpoints['current_reservation'], payload);
            setCurrentBooking(res.data);
            selectTableFromReservation(selectedTable, res.data.id);

            Alert.alert(
                "Đặt bàn thành công! 🎉",
                "Đặt bàn thành công.",
                [{ text: "OK", style: "cancel" }]
            );
        } catch (error) {
            Alert.alert("Lỗi", "Bàn đã được đặt trong thời gian bạn chọn.");
            console.log('Lỗi đặt bàn:', error.response ?? error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn hủy đặt bàn?",
            [
                { text: "Không", style: "cancel" },
                {
                    text: "Hủy đặt bàn",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const token = await SecureStore.getItemAsync("token");
                            await authApis(token).delete(
                                endpoints['reservation_detail'](currentBooking.id)
                            );
                            setCurrentBooking(null);
                            setSelectedTable(null);
                            setAllTables([]);
                            setCustomerQuantity("");
                            Alert.alert("Thành công", "Đặt bàn đã được hủy.");
                        } catch (error) {
                            const msg = error?.response?.data
                                ? Object.values(error.response.data).flat().join("\n")
                                : "Không thể hủy đặt bàn.";
                            Alert.alert("Lỗi", msg);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (d) =>
        d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

    const formatTime = (d) =>
        d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    if (!user) {
        return (
            <View style={[Style.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={Style.headerTitle}>Yêu Cầu Đăng Nhập</Text>
                <Text style={Style.promptText}>
                    Tính năng đặt bàn dành riêng cho thành viên. Vui lòng đăng nhập để tiếp tục!
                </Text>
                <TouchableOpacity
                    style={Style.primaryButton}
                    onPress={() => nav.navigate('CustomerTabs', {
                        screen: 'profile',
                    })}
                >
                    <Text style={Style.buttonLabel}>Đi đến Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) return (
        <ActivityIndicator size="large" color="#FF6347" style={Style.fullPageLoader} />
    );

    if (currentBooking) {
        return (
            <View style={Style.container}>
                <Text style={Style.headerTitle}>Vé Đặt Bàn Của Bạn</Text>
                <View style={Style.ticketCard}>
                    <Text style={Style.infoText}>🪑 Bàn số: {currentBooking.table}</Text>
                    <Text style={Style.infoText}>👥 Số khách: {currentBooking.customer_quantity} người</Text>
                    <Text style={Style.infoText}>
                        🕒 Thời gian đến: {new Date(currentBooking.serve_time).toLocaleString('vi-VN')}
                    </Text>

                    <TouchableOpacity
                        style={[Style.primaryButton, Style.marginTop12]}
                        onPress={() => {
                            selectTableFromReservation({ id: currentBooking.table }, currentBooking.id);
                            nav.navigate('CustomerTabs', { screen: 'cart_index' });
                        }}
                    >
                        <Text style={Style.buttonLabel}>Gọi món ngay</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={Style.cancelBtn} onPress={handleCancelReservation}>
                        <Text style={Style.cancelBtnText}>Hủy Đặt Bàn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const qty = parseInt(customerQuantity) || 0;

    return (
        <ScrollView style={Style.container} showsVerticalScrollIndicator={false}>
            <Text style={Style.headerTitle}>Đặt Bàn Mới</Text>

            <View style={Style.formContainer}>

                {/* Chọn ngày */}
                <Text style={Style.label}>Chọn ngày:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={Style.input}>
                    <Text>{formatDate(serveTime)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={serveTime}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={onDateChange}
                    />
                )}

                {/* Chọn giờ — hiển thị ghi chú nếu ngày tương lai */}
                <Text style={Style.label}>
                    Chọn giờ đến:
                    {isFutureDate(serveTime)}
                </Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={Style.input}>
                    <Text>{formatTime(serveTime)}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={serveTime}
                        mode="time"
                        display="default"
                        onChange={onTimeChange}
                    />
                )}

                {/* Số lượng khách */}
                <Text style={Style.label}>Số lượng khách:</Text>
                <TextInput
                    style={Style.input}
                    keyboardType="numeric"
                    placeholder="Nhập số lượng để tìm bàn phù hợp"
                    value={customerQuantity}
                    onChangeText={(text) => {
                        setCustomerQuantity(text);
                        setSelectedTable(null);
                        loadTables(serveTime, parseInt(text) || 0);
                    }}
                />

                {/* Danh sách bàn */}
                {qty > 0 && (
                    <>
                        <Text style={Style.label}>Chọn bàn trống:</Text>
                        {allTables.length === 0 ? (
                            <Text style={Style.errorText}>
                                Không có bàn trống phù hợp cho {qty} người vào khung giờ này.
                            </Text>
                        ) : (
                            <View style={Style.tableGrid}>
                                {allTables.map((table) => {
                                    const isSelected = selectedTable?.id === table.id;
                                    return (
                                        <TouchableOpacity
                                            key={table.id}
                                            style={[
                                                Style.tableBtn,
                                                isSelected && Style.tableBtnSelected,
                                            ]}
                                            onPress={() => setSelectedTable(table)}
                                        >
                                            <Text style={[Style.tableBtnText, isSelected && Style.tableBtnTextSelected]}>
                                                Bàn {table.id}
                                            </Text>
                                            <Text style={Style.tableSubText}>{table.slot} chỗ</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </>
                )}

                <TouchableOpacity
                    style={[Style.primaryButton, (!selectedTable || !customerQuantity) && Style.disabledButton]}
                    onPress={handlePreSubmit}
                    disabled={!selectedTable || !customerQuantity}
                >
                    <Text style={Style.buttonLabel}>Tiếp Tục</Text>
                </TouchableOpacity>
            </View>

            {/* Modal Xác Nhận */}
            <Modal visible={showConfirmModal} transparent animationType="fade">
                <View style={Style.modalOverlay}>
                    <View style={Style.modalContent}>
                        <Text style={Style.modalTitle}>Xác Nhận Đặt Bàn</Text>

                        <View style={Style.summaryBox}>
                            <Text style={Style.summaryText}>
                                📋 Bàn số: <Text style={Style.boldText}>{selectedTable?.id}</Text>
                            </Text>
                            <Text style={Style.summaryText}>
                                👥 Số khách: <Text style={Style.boldText}>{customerQuantity}</Text>
                            </Text>
                            <Text style={Style.summaryText}>
                                🕒 Đến lúc: <Text style={Style.boldText}>{serveTime.toLocaleString('vi-VN')}</Text>
                            </Text>
                            <Text style={Style.summaryText}>
                                ⏱ Thời lượng: <Text style={Style.boldText}>30 phút</Text>
                            </Text>
                        </View>

                        <Text style={Style.warningText}>
                            Lưu ý: Bàn sẽ được giữ trong 30 phút kể từ giờ nhận bàn.
                        </Text>

                        <View style={Style.modalActionRow}>
                            <TouchableOpacity
                                style={Style.modalCancelBtn}
                                onPress={() => setShowConfirmModal(false)}
                            >
                                <Text style={Style.modalCancelText}>Hủy Bỏ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={Style.modalConfirmBtn}
                                onPress={handleConfirmReservation}
                            >
                                <Text style={Style.modalConfirmText}>Chốt Đặt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={Style.spacer100} />
        </ScrollView>
    );
};

export default Reservation;