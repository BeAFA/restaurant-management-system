import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Cần cài thư viện này
import Apis, { endpoints } from "../../configs/Apis";
import Style from './Style';
import { MyUserContext } from "../../configs/Contexts";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const Reservation = () => {
    const nav = useNavigation();
    const [user,] = useContext(MyUserContext);

    const [loading, setLoading] = useState(true);
    const [currentBooking, setCurrentBooking] = useState(null);

    // States cho Form
    const [serveTime, setServeTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 2 * 60 * 60 * 1000)); // Mặc định +2h
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [customerQuantity, setCustomerQuantity] = useState('');
    const [selectedTable, setSelectedTable] = useState(null); // Lưu toàn bộ object bàn được chọn

    // States MỚI cho chức năng chọn bàn và Modal
    const [allTables, setAllTables] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (user !== null) {
            checkCurrentReservation();
            // THÊM DÒNG NÀY: Tải danh sách bàn ngay khi vừa vào màn hình
            loadTables(serveTime, endTime); 
        } else {
            setLoading(false);
        }
    }, [user]);


    // Lấy danh sách toàn bộ bàn từ server
    const loadTables = async (start, end) => {
        try {
            const url = `${endpoints['tables']}?serve_time=${start.toISOString()}&end_time=${end.toISOString()}`;
            
            // 1. In ra đường dẫn URL để xem Mobile có nối đúng tham số không
            console.log("👉 Đang gọi API URL:", url);

            const res = await Apis.get(url);
            
            // 2. In ra số lượng và danh sách bàn nhận được
            const tables = res.data.results || res.data;
            console.log(`✅ Lấy thành công ${tables.length} bàn trống:`, tables);

            setAllTables(tables);
            setSelectedTable(null);
        } catch (error) {
            console.log("❌ Lỗi tải danh sách bàn:", error);
        }
    };


    const checkCurrentReservation = async () => {
        try {
            const res = await Apis.get(endpoints['current_reservation']);
            if (res.data && Object.keys(res.data).length > 0) {
                setCurrentBooking(res.data);
            } else {
                setCurrentBooking(null);
            }
        } catch (error) {
            console.log("Không có lịch đặt bàn hiện tại.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm gọi khi bấm "Xác Nhận Đặt" ở Form -> Mở Modal Xác Nhận
    const handlePreSubmit = () => {
        if (!customerQuantity || parseInt(customerQuantity) <= 0) {
            Alert.alert("Lỗi", "Vui lòng nhập số lượng khách hợp lệ.");
            return;
        }
        if (!selectedTable) {
            Alert.alert("Lỗi", "Vui lòng chọn một bàn.");
            return;
        }
        setShowConfirmModal(true);
    };

    // Hàm chính thức gửi API sau khi đã xem Modal
    const handleConfirmReservation = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
            // 1. Lấy token từ SecureStore thay vì AsyncStorage
            const token = await SecureStore.getItemAsync('token'); 

            const payload = {
                table: selectedTable.id,
                customer_quantity: parseInt(customerQuantity, 10),
                serve_time: serveTime.toISOString(),
                end_time: endTime.toISOString(),
            };

            console.log("👉 Đang gửi payload đặt bàn kèm Token:", token ? "Đã có token" : "Token rỗng!");

            // 2. Gọi API kèm Header
            const res = await Apis.post(endpoints['current_reservation_create'], payload, {
                headers: {
                    'Authorization': `Bearer ${token}` // Lưu ý: Nếu Backend dùng JWT, đôi khi chữ này là 'JWT ${token}'
                }
            });
            
            setCurrentBooking(res.data);
            Alert.alert("Thành công", "Bạn đã đặt bàn thành công!");

        } catch (error) {
            console.log("❌ LỖI ĐẶT BÀN:", error.response?.data || error.message);
            console.log("❌ STATUS CODE:", error.response?.status);

            if (error.response) {
                if (error.response.status === 400) {
                    const errorMsg = error.response.data.non_field_errors 
                                     || error.response.data.message 
                                     || JSON.stringify(error.response.data); 
                    Alert.alert("Không thể đặt bàn", errorMsg);
                } else if (error.response.status === 401 || error.response.status === 403) {
                    Alert.alert("Lỗi xác thực", "Bạn cần đăng nhập lại để thực hiện tính năng này.");
                } else {
                    Alert.alert("Lỗi Server", `Backend báo lỗi ${error.response.status}.`);
                }
            } else {
                Alert.alert("Lỗi mạng", "Không thể kết nối đến server Django.");
            }
            setSelectedTable(null);
        } finally {
            setLoading(false);
        }
    };

    // ... (Giữ nguyên hàm handleCancelReservation cũ)

    if (user === null) {
        // ... (Giữ nguyên màn hình chặn đăng nhập)
    }

    if (loading) return <ActivityIndicator size="large" color="#FF6347" style={{ flex: 1, backgroundColor: '#FFF5E5' }} />;

    if (currentBooking) {
        // ... (Giữ nguyên giao diện Vé đặt bàn - Trạng thái 2)
    }

    // LỌC BÀN: Chỉ lấy những bàn có slot >= customerQuantity
    const qty = parseInt(customerQuantity) || 0;
    const filteredTables = allTables.filter(t => t.slot >= qty);

    return (
        <ScrollView style={Style.container} showsVerticalScrollIndicator={false}>
            <Text style={Style.headerTitle}>Đặt Bàn Mới</Text>

            <View style={Style.formContainer}>
                {/* 1. Chọn thời gian */}
                <Text style={Style.label}>Thời gian đến:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={Style.input}>
                    <Text>{serveTime.toLocaleString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={serveTime}
                        mode="datetime"
                        minimumDate={new Date()}
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            
                            if (event.type === 'set' && date) {
                                // KIỂM TRA 1: Chặn chọn giờ quá khứ (đề phòng minimumDate của Android bị lỗi giờ/phút)
                                if (date < new Date()) {
                                    Alert.alert("Lỗi thời gian", "Vui lòng chọn thời gian đến trong tương lai (không chọn giờ đã qua).");
                                    return; // Dừng lại, giữ nguyên giờ cũ, không gọi API
                                }

                                setServeTime(date);
                                
                                let newEndTime = endTime;
                                // KIỂM TRA 2: Nếu giờ đến vượt qua giờ trả bàn
                                if (date >= endTime) {
                                    Alert.alert(
                                        "Đã điều chỉnh giờ", 
                                        "Giờ đến bạn chọn đang trễ hơn giờ trả bàn hiện tại. Hệ thống đã tự động dời giờ trả bàn lên 2 tiếng để phù hợp."
                                    );
                                    newEndTime = new Date(date.getTime() + 2 * 60 * 60 * 1000);
                                    setEndTime(newEndTime);
                                }
                                
                                loadTables(date, newEndTime); 
                            }
                        }}
                    />
                )}


                <Text style={Style.label}>Giờ trả bàn:</Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} style={Style.input}>
                    <Text>{endTime.toLocaleString()}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={endTime}
                        mode="datetime"
                        minimumDate={serveTime} 
                        onChange={(event, date) => {
                            setShowEndPicker(false);
                            
                            if (event.type === 'set' && date) {
                                // KIỂM TRA 3: Bắt buộc giờ trả bàn phải SAU giờ đến
                                if (date <= serveTime) {
                                    Alert.alert(
                                        "Lỗi logic", 
                                        "Giờ trả bàn không thể nằm trước hoặc bằng giờ đến! Vui lòng chọn lại."
                                    );
                                    return; // Từ chối cho cập nhật state, giữ nguyên giờ cũ
                                }

                                // (Tùy chọn) KIỂM TRA 4: Chặn đặt bàn quá lâu (Ví dụ: tối đa 5 tiếng)
                                const durationInHours = (date.getTime() - serveTime.getTime()) / (1000 * 60 * 60);
                                if (durationInHours > 5) {
                                    Alert.alert(
                                        "Vượt quá giới hạn", 
                                        "Nhà hàng chỉ hỗ trợ giữ bàn tối đa 5 tiếng trên ứng dụng. Nếu bạn muốn tổ chức tiệc cả ngày, vui lòng liên hệ hotline."
                                    );
                                    return;
                                }

                                setEndTime(date);
                                loadTables(serveTime, date); 
                            }
                        }}
                    />
                )}
                {/* 2. Số lượng khách */}
                <Text style={Style.label}>Số lượng khách:</Text>
                <TextInput
                    style={Style.input}
                    keyboardType="numeric"
                    placeholder="Nhập số lượng để tìm bàn phù hợp"
                    value={customerQuantity}
                    onChangeText={(text) => {
                        setCustomerQuantity(text);
                        setSelectedTable(null); // Reset bàn đã chọn khi đổi số lượng
                    }}
                />

                {/* 3. Danh sách nút chọn bàn (Tự động hiện khi nhập số khách) */}
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
                                    // Kiểm tra trạng thái: Giả sử status_table === 'AVAILABLE' là trống
                                    const isAvailable = table.status_table === 'AVAILABLE';
                                    const isSelected = selectedTable?.id === table.id;

                                    return (
                                        <TouchableOpacity
                                            key={table.id}
                                            disabled={!isAvailable} // Khóa nút nếu không trống
                                            style={[
                                                Style.tableBtn,
                                                !isAvailable && Style.tableBtnDisabled,
                                                isSelected && Style.tableBtnSelected
                                            ]}
                                            onPress={() => setSelectedTable(table)}
                                        >
                                            <Text style={[Style.tableBtnText, isSelected && Style.tableBtnTextSelected]}>
                                                Bàn {table.id}
                                            </Text>
                                            <Text style={Style.tableSubText}>
                                                {table.slot} chỗ
                                            </Text>
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

            {/* 4. MODAL XÁC NHẬN */}
            <Modal visible={showConfirmModal} transparent={true} animationType="fade">
                <View style={Style.modalOverlay}>
                    <View style={Style.modalContent}>
                        <Text style={Style.modalTitle}>Xác Nhận Đặt Bàn</Text>

                        <View style={Style.summaryBox}>
                            <Text style={Style.summaryText}>📋 Bàn số: <Text style={{ fontWeight: 'bold' }}> {selectedTable?.id}</Text></Text>
                            <Text style={Style.summaryText}>👥 Số khách: <Text style={{ fontWeight: 'bold' }}>{customerQuantity}</Text></Text>
                            <Text style={Style.summaryText}>🕒 Thời gian: <Text style={{ fontWeight: 'bold' }}>{serveTime.toLocaleString()}</Text></Text>
                        </View>

                        <Text style={Style.warningText}>
                            Lưu ý: Bàn của bạn sẽ được giữ trong vòng 2 tiếng kể từ thời gian nhận bàn.
                        </Text>

                        <View style={Style.modalActionRow}>
                            <TouchableOpacity style={Style.modalCancelBtn} onPress={() => setShowConfirmModal(false)}>
                                <Text style={Style.modalCancelText}>Hủy Bỏ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={Style.modalConfirmBtn} onPress={handleConfirmReservation}>
                                <Text style={Style.modalConfirmText}>Chốt Đặt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Tạo khoảng trống dưới cùng để cuộn không bị vướng bottom tab */}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

export default Reservation;