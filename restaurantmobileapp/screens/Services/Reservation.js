import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, Modal, ScrollView, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import Style from './Style';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import UserContext from '../../contexts/UserContext';
import TableContext from '../../contexts/TableContext';
import CartContext from '../../contexts/CartContext';

const Reservation = () => {
    const nav = useNavigation();
    const { user } = useContext(UserContext);
    const { selectTableFromReservation } = useContext(TableContext);
    const { cart } = useContext(CartContext);

    const [loading, setLoading] = useState(true);
    const [currentBooking, setCurrentBooking] = useState(null);

    // ── Thời gian ──────────────────────────────────────────────────────────────
    // serveTime: ngày + giờ đến (user chọn)
    const [serveTime, setServeTime] = useState(() => {
        const d = new Date();
        d.setSeconds(0, 0);
        return d;
    });

    // endTime: tự động = serveTime + 30 phút (KHÔNG cho user chọn)
    const getEndTime = (st) => new Date(st.getTime() + 30 * 60 * 1000);

    // Hiển thị picker riêng cho date và time
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // ── Bàn & Form ─────────────────────────────────────────────────────────────
    const [customerQuantity, setCustomerQuantity] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [allTables, setAllTables] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // ── Khởi tạo ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (user) {
            checkCurrentReservation();
        } else {
            setLoading(false);
        }
    }, [user]);

    // ── API: Kiểm tra đặt bàn hiện tại ─────────────────────────────────────────
    const checkCurrentReservation = async () => {
        try {
            const res = await Apis.get(endpoints['current_reservation']);
            if (res.data && Object.keys(res.data).length > 0) {
                setCurrentBooking(res.data);
            } else {
                setCurrentBooking(null);
            }
        } catch {
            setCurrentBooking(null);
        } finally {
            setLoading(false);
        }
    };

    // ── API: Tải danh sách bàn trống ────────────────────────────────────────────
    const loadTables = async (start, quantity) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const end = getEndTime(start);

            const url =
                `${endpoints['available_tables']}` +
                `?serve_time=${start.toISOString()}&end_time=${end.toISOString()}`
                    `&customer_quantity=${Number(quantity)}`;

            console.log("👉 URL:", url);

            const res = await authApis(token).get(url);
            setAllTables(res.data.results || res.data);
            setSelectedTable(null);

        } catch (error) {
            console.log("❌ Lỗi tải bàn:", error);
        }
    };

    // ── Xử lý chọn ngày ────────────────────────────────────────────────────────
    const onDateChange = (event, selected) => {
        setShowDatePicker(Platform.OS === 'ios'); // iOS giữ picker; Android tự đóng
        if (event.type === 'dismissed' || !selected) return;

        // Ghép ngày mới vào giờ hiện có của serveTime
        const updated = new Date(serveTime);
        updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());

        // Không cho chọn thời điểm trong quá khứ
        if (updated < new Date()) {
            Alert.alert("Lỗi thời gian", "Vui lòng chọn ngày trong tương lai.");
            return;
        }

        setServeTime(updated);
        loadTables(updated, getEndTime(updated), customerQuantity);
    };

    // ── Xử lý chọn giờ ─────────────────────────────────────────────────────────
    const onTimeChange = (event, selected) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (event.type === 'dismissed' || !selected) return;

        // Ghép giờ mới vào ngày hiện có của serveTime
        const updated = new Date(serveTime);
        updated.setHours(selected.getHours(), selected.getMinutes(), 0, 0);

        if (updated < new Date()) {
            Alert.alert("Lỗi thời gian", "Vui lòng chọn giờ trong tương lai.");
            return;
        }

        setServeTime(updated);
        loadTables(updated, customerQuantity);
    };

    // ── Xử lý đặt bàn ──────────────────────────────────────────────────────────
    const handlePreSubmit = () => {
        if (!customerQuantity || Number(customerQuantity) <= 0) {
            Alert.alert("Lỗi", "Vui lòng nhập số lượng khách hợp lệ.");
            return;
        }
        if (!selectedTable) {
            Alert.alert("Lỗi", "Vui lòng chọn một bàn.");
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmReservation = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            const endTime = getEndTime(serveTime);

            const payload = {
                table: selectedTable.id,
                customer_quantity: Number(customerQuantity),
                serve_time: serveTime.toISOString(),
                end_time: endTime.toISOString(),
            };

            const res = await authApis(token).post(endpoints['current_reservation'], payload);
            setCurrentBooking(res.data);

            // ── Mới: lưu bàn vào TableContext ──────────────────────────────
            selectTableFromReservation(selectedTable, res.data.id);
            // ───────────────────────────────────────────────────────────────

            Alert.alert(
                "Đặt bàn thành công!",
                `Bàn ${selectedTable.id} đã được giữ cho bạn.\nBạn có muốn vào gọi món ngay không?`,
                [
                    {
                        text: "Để sau",
                        style: "cancel",
                    },
                    {
                        text: "Gọi món ngay",
                        onPress: () => nav.navigate("home", {        // chuyển sang HomeStack
                            screen: "cart",
                        }),
                    },
                ]
            );

        } catch (error) {
            // ... giữ nguyên phần xử lý lỗi
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async () => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn hủy đặt bàn?", [
            { text: "Không", style: "cancel" },
            {
                text: "Hủy đặt bàn", style: "destructive", onPress: async () => {
                    setLoading(true);
                    try {
                        const token = await SecureStore.getItemAsync('token');
                        await authApis(token).delete(endpoints['current_reservation']);
                        setCurrentBooking(null);
                        Alert.alert("Đã hủy", "Đặt bàn của bạn đã được hủy.");
                    } catch {
                        Alert.alert("Lỗi", "Không thể hủy đặt bàn. Vui lòng thử lại.");
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]);
    };

    // ── Render helpers ──────────────────────────────────────────────────────────
    const formatDate = (d) =>
        d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

    const formatTime = (d) =>
        d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // ── Guards ──────────────────────────────────────────────────────────────────
    if (!user) {
        return (
            <View style={[Style.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={Style.headerTitle}>Yêu Cầu Đăng Nhập</Text>
                <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
                    Tính năng đặt bàn dành riêng cho thành viên. Vui lòng đăng nhập để tiếp tục!
                </Text>
                <TouchableOpacity style={Style.primaryButton} onPress={() => nav.navigate('account_tab')}>
                    <Text style={Style.buttonLabel}>Đi đến Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) return (
        <ActivityIndicator size="large" color="#FF6347" style={{ flex: 1, backgroundColor: '#FFF5E5' }} />
    );

    if (currentBooking) {
    return (
        <View style={Style.container}>
            <Text style={Style.headerTitle}>Vé Đặt Bàn Của Bạn</Text>
            <View style={Style.ticketCard}>
                <Text style={Style.infoText}>Bàn số: {currentBooking.table}</Text>
                <Text style={Style.infoText}>Số khách: {currentBooking.customer_quantity} người</Text>
                <Text style={Style.infoText}>
                    Thời gian đến: {new Date(currentBooking.serve_time).toLocaleString('vi-VN')}
                </Text>
                <Text style={Style.infoText}>
                    Kết thúc: {new Date(currentBooking.end_time).toLocaleString('vi-VN')}
                </Text>

                {/* ── Mới: nút gọi món ── */}
                <TouchableOpacity
                    style={[Style.primaryButton, { marginTop: 12 }]}
                    onPress={() => {
                        selectTableFromReservation(
                            { id: currentBooking.table },
                            currentBooking.id
                        );
                        nav.navigate("home", { screen: "cart" });
                    }}
                >
                    <Text style={Style.buttonLabel}>Gọi món ngay</Text>
                </TouchableOpacity>
                {/* ───────────────────── */}

                <TouchableOpacity style={Style.cancelBtn} onPress={handleCancelReservation}>
                    <Text style={Style.cancelBtnText}>Hủy Đặt Bàn</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

    const qty = parseInt(customerQuantity) || 0;
    const filteredTables = allTables.filter(t => t.slot >= qty);
    const endTime = getEndTime(serveTime);

    // ── Màn hình chính ─────────────────────────────────────────────────────────
    return (
        <ScrollView style={Style.container} showsVerticalScrollIndicator={false}>
            <Text style={Style.headerTitle}>Đặt Bàn Mới</Text>

            <View style={Style.formContainer}>

                {/* ── Chọn ngày ── */}
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

                {/* ── Chọn giờ đến ── */}
                <Text style={Style.label}>Chọn giờ đến:</Text>
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

                {/* ── Hiển thị giờ kết thúc (tự động) ── */}
                <Text style={Style.label}>Giờ kết thúc (tự động):</Text>
                <View style={[Style.input, { backgroundColor: '#f0f0f0' }]}>
                    <Text style={{ color: '#888' }}>
                        {formatTime(endTime)}{'  '}
                        <Text style={{ fontSize: 12, color: '#aaa' }}>(+30 phút)</Text>
                    </Text>
                </View>

                {/* ── Số lượng khách ── */}
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

                {/* ── Danh sách bàn ── */}
                {qty > 0 && (
                    <>
                        <Text style={Style.label}>Chọn bàn trống:</Text>
                        {filteredTables.length === 0 ? (
                            <Text style={{ color: 'red', fontStyle: 'italic', marginBottom: 15 }}>
                                Không có bàn nào đủ sức chứa cho {qty} người.
                            </Text>
                        ) : (
                            <View style={Style.tableGrid}>
                                {filteredTables.map((table) => {
                                    const isAvailable = table.status_table === 'AVAILABLE';
                                    const isSelected = selectedTable?.id === table.id;
                                    return (
                                        <TouchableOpacity
                                            key={table.id}
                                            disabled={!isAvailable}
                                            style={[
                                                Style.tableBtn,
                                                !isAvailable && Style.tableBtnDisabled,
                                                isSelected && Style.tableBtnSelected,
                                            ]}
                                            onPress={() => setSelectedTable(table)}
                                        >
                                            <Text style={[Style.tableBtnText, isSelected && Style.tableBtnTextSelected]}>
                                                Bàn {table.id}
                                            </Text>
                                            <Text style={Style.tableSubText}>{table.slot} chỗ</Text>
                                            {!isAvailable && (
                                                <Text style={Style.tableStatusText}>(Đã đặt)</Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </>
                )}

                <TouchableOpacity
                    style={[Style.primaryButton, (!selectedTable || !customerQuantity) && { opacity: 0.5 }]}
                    onPress={handlePreSubmit}
                    disabled={!selectedTable || !customerQuantity}
                >
                    <Text style={Style.buttonLabel}>Tiếp Tục</Text>
                </TouchableOpacity>
            </View>

            {/* ── Modal Xác Nhận ── */}
            <Modal visible={showConfirmModal} transparent animationType="fade">
                <View style={Style.modalOverlay}>
                    <View style={Style.modalContent}>
                        <Text style={Style.modalTitle}>Xác Nhận Đặt Bàn</Text>

                        <View style={Style.summaryBox}>
                            <Text style={Style.summaryText}>
                                📋 Bàn số: <Text style={{ fontWeight: 'bold' }}>{selectedTable?.id}</Text>
                            </Text>
                            <Text style={Style.summaryText}>
                                👥 Số khách: <Text style={{ fontWeight: 'bold' }}>{customerQuantity}</Text>
                            </Text>
                            <Text style={Style.summaryText}>
                                🕒 Đến lúc: <Text style={{ fontWeight: 'bold' }}>{serveTime.toLocaleString('vi-VN')}</Text>
                            </Text>
                            <Text style={Style.summaryText}>
                                ⏱ Kết thúc: <Text style={{ fontWeight: 'bold' }}>{endTime.toLocaleString('vi-VN')}</Text>
                            </Text>
                        </View>

                        <Text style={Style.warningText}>
                            Lưu ý: Bàn sẽ được giữ trong 15 phút kể từ giờ nhận bàn.
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

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

export default Reservation;