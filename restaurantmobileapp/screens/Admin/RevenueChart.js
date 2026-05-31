import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import styles from '../../styles/RevenuesChartStyle';

const { width } = Dimensions.get('window');

const RevenueChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chưa có dữ liệu doanh thu cho kỳ này</Text>
            </View>
        );
    }

    const formatYLabel = (value) => {
        if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'Tỷ';
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'Tr';
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
        return value.toString();
    };

    const chartWidth = width - 70; 
    const calculatedBarWidth = Math.max(15, Math.min(40, (chartWidth / data.length) - 15));

    const maxDataValue = Math.max(...data.map(item => item.value));
    const chartMaxValue = maxDataValue > 0 ? maxDataValue + (maxDataValue * 0.2) : 100;

    return (
        <View style={styles.container}>
            <Text style={styles.yAxisTitle}>Doanh thu (VNĐ)</Text>

            <View style={styles.chartWrapper}>
                <BarChart
                    data={data}
                    maxValue={chartMaxValue}
                    width={chartWidth}
                    barWidth={calculatedBarWidth}
                    spacing={15}
                    roundedTop
                    initialSpacing={40}
                    
                    frontColor="#FF6347" 
                    
                    xAxisThickness={1}
                    yAxisThickness={0}
                    xAxisColor="#E0E0E0"
                    
                    yAxisTextStyle={{ color: '#888', fontSize: 11 }}
                    xAxisLabelTextStyle={{ color: '#555', fontSize: 11, textAlign: 'center' }}
                    
                    formatYLabel={formatYLabel}
                    yAxisLabelWidth={45} 
                    
                    isAnimated
                    animationDuration={500}
                    
                    renderTooltip={(item, index) => {
                        return (
                            <View style={styles.tooltip}>
                                <Text style={styles.tooltipLabel}>{item.label}</Text>
                                <Text style={styles.tooltipValue}>
                                    {item.value.toLocaleString()} đ
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>

            <Text style={styles.xAxisTitle}>Thời gian</Text>
        </View>
    );
};

    

export default RevenueChart;