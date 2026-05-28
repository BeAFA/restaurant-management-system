import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, List, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import Style from './Style';

// Hàm hỗ trợ tính số tuần của năm hiện tại
const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // TRẠNG THÁI BỘ LỌC
    const [period, setPeriod] = useState('month'); 
    
    // Mặc định cho Ngày (Hôm nay)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // Mặc định cho Tuần (Tuần hiện tại)
    const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));
    
    // Mặc định cho Tháng (Tháng hiện tại 1-12)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    
    const currentYear = new Date().getFullYear();

    // HÀM TÍNH TOÁN KHOẢNG THỜI GIAN ĐỂ GỬI LÊN API
    const getFilterDates = () => {
        let finalStart = new Date();
        let finalEnd = new Date();

        if (period === 'day') {
            finalStart = new Date(startDate.setHours(0,0,0,0));
            finalEnd = new Date(endDate.setHours(23,59,59,999));
        } 
        else if (period === 'week') {
            // Tính ngày đầu và cuối của tuần được chọn
            let simple = new Date(currentYear, 0, 1 + (selectedWeek - 1) * 7);
            let dow = simple.getDay();
            let ISOweekStart = simple;
            if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
            
            finalStart = new Date(ISOweekStart.setHours(0,0,0,0));
            let ISOweekEnd = new Date(ISOweekStart);
            ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
            finalEnd = new Date(ISOweekEnd.setHours(23,59,59,999));
        } 
        else if (period === 'month') {
            finalStart = new Date(currentYear, selectedMonth - 1, 1);
            finalEnd = new Date(currentYear, selectedMonth, 0, 23, 59, 59); // Ngày cuối cùng của tháng
        }
        
        return { start: finalStart.toISOString(), end: finalEnd.toISOString() };
    };

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const token = await SecureStore.getItemAsync('token');
                
                const { start, end } = getFilterDates();
                
                // Gắn thêm start_date và end_date vào URL API
                let url = `${endpoints['admin_stats']}?period=${period}&start_date=${start}&end_date=${end}`;
                
                const res = await authApis(token).get(url);
                setStats(res.data);
            } catch (ex) {
                console.error("Lỗi lấy thống kê Admin:", ex.response?.data || ex.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAdminStats();
    }, [period, startDate, endDate, selectedWeek, selectedMonth]); 
    // Gọi lại API mỗi khi 1 trong các bộ lọc thay đổi

    const totalRevenue = stats?.revenue_stats?.reduce((sum, item) => sum + item.total_revenue, 0) || 0;

    // --- RENDER BỘ LỌC TÙY BIẾN THEO TỪNG CHẾ ĐỘ ---
    const renderFilterOptions = () => {
        if (period === 'day') {
            return (
                <View style={Style.datePickerContainer}>
                    <TouchableOpacity style={Style.dateBox} onPress={() => setShowStartPicker(true)}>
                        <Text style={Style.dateLabel}>Từ ngày</Text>
                        <Text style={Style.dateValue}>{startDate.toLocaleDateString('vi-VN')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={Style.dateBox} onPress={() => setShowEndPicker(true)}>
                        <Text style={Style.dateLabel}>Đến ngày</Text>
                        <Text style={Style.dateValue}>{endDate.toLocaleDateString('vi-VN')}</Text>
                    </TouchableOpacity>

                    {showStartPicker && (
                        <DateTimePicker value={startDate} mode="date" display="default"
                            onChange={(event, date) => { setShowStartPicker(false); if(date) setStartDate(date); }}
                        />
                    )}
                    {showEndPicker && (
                        <DateTimePicker value={endDate} mode="date" display="default" minimumDate={startDate}
                            onChange={(event, date) => { setShowEndPicker(false); if(date) setEndDate(date); }}
                        />
                    )}
                </View>
            );
        }

        if (period === 'week') {
            return (
                <View style={Style.dropdownContainer}>
                    <Text style={Style.dropdownLabel}>Chọn Tuần trong năm {currentYear}:</Text>
                    <View style={Style.pickerWrapper}>
                        <Picker selectedValue={selectedWeek} onValueChange={(itemValue) => setSelectedWeek(itemValue)}>
                            {/* Tạo mảng 52 tuần */}
                            {[...Array(52).keys()].map(i => (
                                <Picker.Item key={i} label={`Tuần ${i + 1}`} value={i + 1} />
                            ))}
                        </Picker>
                    </View>
                </View>
            );
        }

        if (period === 'month') {
            return (
                <View style={Style.dropdownContainer}>
                    <Text style={Style.dropdownLabel}>Chọn Tháng trong năm {currentYear}:</Text>
                    <View style={Style.pickerWrapper}>
                        <Picker selectedValue={selectedMonth} onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
                            {/* Tạo mảng 12 tháng */}
                            {[...Array(12).keys()].map(i => (
                                <Picker.Item key={i} label={`Tháng ${i + 1}`} value={i + 1} />
                            ))}
                        </Picker>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView style={Style.container}>
                
                {/* 1. NÚT CHỌN CHẾ ĐỘ LỌC (NGÀY / TUẦN / THÁNG) */}
                <View style={Style.modeContainer}>
                    <Button mode={period === 'day' ? 'contained' : 'outlined'} onPress={() => setPeriod('day')} style={Style.filterBtn}>Theo Ngày</Button>
                    <Button mode={period === 'week' ? 'contained' : 'outlined'} onPress={() => setPeriod('week')} style={Style.filterBtn}>Theo Tuần</Button>
                    <Button mode={period === 'month' ? 'contained' : 'outlined'} onPress={() => setPeriod('month')} style={Style.filterBtn}>Theo Tháng</Button>
                </View>

                {/* 2. HIỂN THỊ CÔNG CỤ CHỌN TƯƠNG ỨNG VỚI CHẾ ĐỘ */}
                {renderFilterOptions()}

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 40 }} />
                ) : (
                    <>
                        {/* 3. TỔNG DOANH THU THEO KHOẢNG THỜI GIAN ĐÃ CHỌN */}
                        <Card style={[Style.card, { backgroundColor: '#e8f5e9', marginTop: 15 }]}>
                            <Card.Content>
                                <Paragraph style={{ fontWeight: 'bold' }}>TỔNG DOANH THU KỲ ĐÃ CHỌN</Paragraph>
                                <Title style={{ color: '#2e7d32', fontSize: 24 }}>
                                    {totalRevenue.toLocaleString()} VNĐ
                                </Title>
                            </Card.Content>
                        </Card>

                        {/* GIỮ NGUYÊN PHẦN HIỂN THỊ GRID 4 Ô VÀ TOP MÓN ĂN NHƯ CŨ */}
                        <Title style={Style.header}>Báo cáo tổng quan</Title>
                        <View style={Style.row}>
                            <Card style={Style.gridCard}>
                                <Card.Content>
                                    <Title style={Style.statNumber}>{stats?.overview?.total_foods || 0}</Title>
                                    <Paragraph style={Style.statLabel}>Số lượng món</Paragraph>
                                </Card.Content>
                            </Card>
                            <Card style={Style.gridCard}>
                                <Card.Content>
                                    <Title style={Style.statNumber}>{stats?.overview?.total_reservations || 0}</Title>
                                    <Paragraph style={Style.statLabel}>Lượt đặt bàn</Paragraph>
                                </Card.Content>
                            </Card>
                        </View>
                        <View style={Style.row}>
                            <Card style={Style.gridCard}>
                                <Card.Content>
                                    <Title style={Style.statNumber}>{stats?.overview?.total_orders || 0}</Title>
                                    <Paragraph style={Style.statLabel}>Đơn hàng</Paragraph>
                                </Card.Content>
                            </Card>
                            <Card style={Style.gridCard}>
                                <Card.Content>
                                    <Title style={Style.statNumber}>{stats?.overview?.total_users || 0}</Title>
                                    <Paragraph style={Style.statLabel}>Khách hàng</Paragraph>
                                </Card.Content>
                            </Card>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}



export default Dashboard;