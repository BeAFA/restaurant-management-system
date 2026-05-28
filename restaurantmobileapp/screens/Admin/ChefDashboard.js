import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, Button, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import styles from './Style';

const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
}

const ChefDashboard = () => {
    const [stats, setStats] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month'); 
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const currentYear = new Date().getFullYear();

    const getFilterDates = () => {
        let finalStart = new Date();
        let finalEnd = new Date();

        if (period === 'day') {
            finalStart = new Date(startDate.setHours(0,0,0,0));
            finalEnd = new Date(endDate.setHours(23,59,59,999));
        } else if (period === 'week') {
            let simple = new Date(currentYear, 0, 1 + (selectedWeek - 1) * 7);
            let dow = simple.getDay();
            let ISOweekStart = simple;
            if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
            finalStart = new Date(ISOweekStart.setHours(0,0,0,0));
            let ISOweekEnd = new Date(ISOweekStart);
            ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
            finalEnd = new Date(ISOweekEnd.setHours(23,59,59,999));
        } else if (period === 'month') {
            finalStart = new Date(currentYear, selectedMonth - 1, 1);
            finalEnd = new Date(currentYear, selectedMonth, 0, 23, 59, 59);
        }
        return { start: finalStart.toISOString(), end: finalEnd.toISOString() };
    };

    useEffect(() => {
        const fetchChefStats = async () => {
            try {
                setLoading(true);
                const token = await SecureStore.getItemAsync('token');
                const { start, end } = getFilterDates();
                
                let url = `${endpoints['chef_stats']}?period=${period}&start_date=${start}&end_date=${end}&view_all=${viewAll}`;
                const res = await authApis(token).get(url);
                setStats(res.data);
                console.log("Thống kê Bếp:", res.data);
            } catch (ex) {
                console.error("Lỗi lấy thống kê Bếp:", ex);
            } finally {
                setLoading(false);
            }
        }
        fetchChefStats();
    }, [period, startDate, endDate, selectedWeek, selectedMonth, viewAll]);

    const totalRevenue = stats?.food_stats?.reduce((sum, item) => sum + item.total_revenue, 0) || 0;
    const totalQuantity = stats?.food_stats?.reduce((sum, item) => sum + item.total_quantity, 0) || 0;

    const renderFilterOptions = () => {
        if (period === 'day') {
            return (
                <View style={styles.datePickerContainer}>
                    <TouchableOpacity style={styles.dateBox} onPress={() => setShowStartPicker(true)}>
                        <Text style={styles.dateLabel}>Từ ngày</Text>
                        <Text style={styles.dateValue}>{startDate.toLocaleDateString('vi-VN')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dateBox} onPress={() => setShowEndPicker(true)}>
                        <Text style={styles.dateLabel}>Đến ngày</Text>
                        <Text style={styles.dateValue}>{endDate.toLocaleDateString('vi-VN')}</Text>
                    </TouchableOpacity>

                    {showStartPicker && (
                        <DateTimePicker value={startDate} mode="date" display="default"
                            onChange={(event, date) => { 
                                setShowStartPicker(false); 
                                if(date) {
                                    setStartDate(date);
                                    if (date > endDate) setEndDate(date);
                                } 
                            }}
                        />
                    )}
                    {showEndPicker && (
                        <DateTimePicker value={endDate} mode="date" display="default" minimumDate={startDate}
                            onChange={(event, date) => { 
                                setShowEndPicker(false); 
                                if(date) {
                                    const startObj = new Date(startDate.setHours(0,0,0,0));
                                    const endObj = new Date(date.setHours(0,0,0,0));
                                    if (endObj >= startObj) setEndDate(date);
                                    else alert("Ngày kết thúc không hợp lệ!");
                                } 
                            }}
                        />
                    )}
                </View>
            );
        }
        if (period === 'week') {
            return (
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownLabel}>Chọn Tuần:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={selectedWeek} onValueChange={(itemValue) => setSelectedWeek(itemValue)}>
                            {[...Array(52).keys()].map(i => <Picker.Item key={i} label={`Tuần ${i + 1}`} value={i + 1} />)}
                        </Picker>
                    </View>
                </View>
            );
        }
        if (period === 'month') {
            return (
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownLabel}>Chọn Tháng:</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={selectedMonth} onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
                            {[...Array(12).keys()].map(i => <Picker.Item key={i} label={`Tháng ${i + 1}`} value={i + 1} />)}
                        </Picker>
                    </View>
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView style={styles.container}>
                
                <View style={styles.modeContainer}>
                    <Button mode={period === 'day' ? 'contained' : 'outlined'} onPress={() => setPeriod('day')} style={styles.filterBtn}>Ngày</Button>
                    <Button mode={period === 'week' ? 'contained' : 'outlined'} onPress={() => setPeriod('week')} style={styles.filterBtn}>Tuần</Button>
                    <Button mode={period === 'month' ? 'contained' : 'outlined'} onPress={() => setPeriod('month')} style={styles.filterBtn}>Tháng</Button>
                </View>

                {renderFilterOptions()}

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Xem tất cả món ăn của nhà hàng</Text>
                            <Switch 
                                value={viewAll} 
                                onValueChange={() => setViewAll(!viewAll)} 
                                color="#e65100" 
                            />
                        </View>
                        <Card style={[styles.card, { backgroundColor: '#fff3e0', marginTop: 15 }]}>
                            <Card.Content>
                                {viewAll ? (
                                    <Paragraph style={{ fontWeight: 'bold', color: '#e65100' }}>DOANH THU TẤT CẢ MÓN ĂN</Paragraph>
                                ) : (
                                    <Paragraph style={{ fontWeight: 'bold', color: '#e65100' }}>DOANH THU MÓN ĂN CỦA BẠN</Paragraph>
                                )}
                                <Title style={{ color: '#e65100', fontSize: 26, fontWeight: 'bold' }}>
                                    {totalRevenue.toLocaleString()} VNĐ
                                </Title>
                                <Paragraph style={{ color: '#555' }}>
                                    Đã bán tổng cộng: <Text style={{fontWeight: 'bold'}}>{totalQuantity} phần</Text>
                                </Paragraph>
                            </Card.Content>
                        </Card>

                        <Title style={styles.header}>Chi tiết theo từng món</Title>
                        
                        {stats?.food_stats?.length > 0 ? (
                            stats.food_stats.map((food, index) => (
                                <Card key={index} style={styles.dishCard}>
                                    <Card.Content style={styles.dishRow}>
                                        <View style={{ flex: 1 }}>
                                            <Title style={{ fontSize: 16 }}>{food.food__dish}</Title>
                                            <Paragraph style={{ color: 'gray', fontSize: 13 }}>
                                                Số lượng đặt: <Text style={{fontWeight: 'bold', color: 'black'}}>{food.total_quantity}</Text>
                                            </Paragraph>
                                            {food.avg_rating && (
                                                <Paragraph style={{ color: '#f39c12', fontSize: 13 }}>
                                                    Đánh giá: ⭐ {Number(food.avg_rating).toFixed(1)}
                                                </Paragraph>
                                            )}
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={styles.revenueText}>
                                                {food.total_revenue.toLocaleString()}đ
                                            </Text>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        ) : (
                            <Text style={{ fontStyle: 'italic', color: 'gray', textAlign: 'center', marginTop: 20 }}>
                                Không có món ăn nào được bán ra trong kỳ này.
                            </Text>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}



export default ChefDashboard;