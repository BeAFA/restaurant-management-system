import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, Button } from 'react-native-paper';
import Header from '../../components/Header';
import RevenueChart from './RevenueChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from 'expo-secure-store';
import Style, { Colors } from '../../styles/AdminStyles';

const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const buildChartData = (revenueStats = [], filterType) => { 
    if (!revenueStats.length) return [];

    return revenueStats.map((item, index) => {
        let label = `Kỳ ${index + 1}`;
        const targetDate = item.period; 

        if (targetDate) {
            const d = new Date(targetDate);
            
            if (filterType === 'day') {
                label = `${d.getDate()}/${d.getMonth() + 1}`;
            } else if (filterType === 'week') {
                const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                label = days[d.getDay()];
            } else {
                label = `T${d.getMonth() + 1}`;
            }
        } else {
            if (filterType === 'month') label = 'Tháng này';
            else if (filterType === 'week') label = 'Tuần này';
            else if (filterType === 'day') label = 'Hôm nay';
        }

        return { 
            label: label, 
            value: item.total_revenue ?? 0 
        };
    });
};

const Dashboard = () => {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);

    const [period, setPeriod]   = useState('month');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate,   setEndDate]   = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker,   setShowEndPicker]   = useState(false);
    const [selectedWeek,  setSelectedWeek]  = useState(getWeekNumber(new Date()));
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const currentYear = new Date().getFullYear();

    const getFilterDates = () => {
        let finalStart = new Date();
        let finalEnd   = new Date();

        if (period === 'day') {
            finalStart = new Date(startDate.setHours(0, 0, 0, 0));
            finalEnd   = new Date(endDate.setHours(23, 59, 59, 999));
        } else if (period === 'week') {
            let simple = new Date(currentYear, 0, 1 + (selectedWeek - 1) * 7);
            let ISOweekStart = simple;
            if (simple.getDay() <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
            finalStart = new Date(ISOweekStart.setHours(0, 0, 0, 0));
            let ISOweekEnd = new Date(ISOweekStart);
            ISOweekEnd.setDate(ISOweekStart.getDate() + 6);
            finalEnd = new Date(ISOweekEnd.setHours(23, 59, 59, 999));
        } else if (period === 'month') {
            finalStart = new Date(currentYear, selectedMonth - 1, 1);
            finalEnd   = new Date(currentYear, selectedMonth, 0, 23, 59, 59);
        }

        return { start: finalStart.toISOString(), end: finalEnd.toISOString() };
    };

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                setLoading(true);
                const token = await SecureStore.getItemAsync('token');
                const { start, end } = getFilterDates();
                const url = `${endpoints['admin_stats']}?period=${period}&start_date=${start}&end_date=${end}`;
                const res = await authApis(token).get(url);
                setStats(res.data);
            } catch (ex) {
                console.error('Lỗi lấy thống kê Admin:', ex.response?.data || ex.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminStats();
    }, [period, startDate, endDate, selectedWeek, selectedMonth]);

    const totalRevenue = stats?.revenue_stats?.reduce((sum, item) => sum + item.total_revenue, 0) || 0;
    const chartData    = buildChartData(stats?.revenue_stats ?? [], period);

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
                            onChange={(event, date) => {
                                setShowStartPicker(false);
                                if (date) { setStartDate(date); if (date > endDate) setEndDate(date); }
                            }}
                        />
                    )}
                    {showEndPicker && (
                        <DateTimePicker value={endDate} mode="date" display="default" minimumDate={startDate}
                            onChange={(event, date) => {
                                setShowEndPicker(false);
                                if (date) {
                                    const s = new Date(startDate.setHours(0, 0, 0, 0));
                                    const e = new Date(date.setHours(0, 0, 0, 0));
                                    if (e >= s) setEndDate(date);
                                    else alert('Ngày kết thúc không hợp lệ!');
                                }
                            }}
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
                        <Picker selectedValue={selectedWeek} onValueChange={setSelectedWeek}>
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
                        <Picker selectedValue={selectedMonth} onValueChange={setSelectedMonth}>
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
        <SafeAreaView style={Style.screenBackground}>
            <ScrollView style={Style.container}>
                <Header />
                <Text style={Style.header}>Thống kê doanh thu</Text>

                {/* Nút chọn kỳ */}
                <View style={Style.modeContainer}>
                    {[
                        { key: 'day',   label: 'Theo Ngày'  },
                        { key: 'week',  label: 'Theo Tuần'  },
                        { key: 'month', label: 'Theo Tháng' },
                    ].map(({ key, label }) => (
                        <Button
                            key={key}
                            mode={period === key ? 'contained' : 'outlined'}
                            onPress={() => setPeriod(key)}
                            style={Style.filterBtn}
                            buttonColor={period === key ? Colors.primary : undefined}
                            textColor={period === key ? Colors.surface : Colors.primary}
                            theme={{ colors: { outline: Colors.primary } }}
                        >
                            {label}
                        </Button>
                    ))}
                </View>

                {renderFilterOptions()}

                {loading ? (
                    <ActivityIndicator size="large" style={Style.loadingIndicator} color={Colors.primary} />
                ) : (
                    <>
                        <Card style={Style.highlightCard}>
                            <Card.Content>
                                <Paragraph style={Style.highlightTitle}>TỔNG DOANH THU KỲ ĐÃ CHỌN</Paragraph>
                                <Title style={Style.highlightValue}>
                                    {totalRevenue.toLocaleString()} VNĐ
                                </Title>
                            </Card.Content>
                        </Card>
                        <Text style={Style.sectionTitle}>Biểu đồ doanh thu</Text>
                        <RevenueChart data={chartData} />

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
};

export default Dashboard;