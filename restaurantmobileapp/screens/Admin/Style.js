import { StyleSheet } from 'react-native';

const DashboardStyles = StyleSheet.create({
    // ==========================================
    // 1. STYLE DÙNG CHUNG (COMMON STYLES)
    // ==========================================
    container: { 
        flex: 1, 
        padding: 10 
    },
    header: { 
        marginVertical: 10, 
        fontWeight: 'bold', 
        fontSize: 18 
    },
    card: { 
        marginBottom: 10, 
        elevation: 2 
    },
    
    // --- Bộ lọc (Thời gian/Chế độ) ---
    modeContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 15 
    },
    filterBtn: { 
        flex: 1, 
        marginHorizontal: 2 
    },
    datePickerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 5 
    },
    dateBox: { 
        flex: 0.48, 
        padding: 12, 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        alignItems: 'center' 
    },
    dateLabel: { 
        fontSize: 12, 
        color: 'gray', 
        marginBottom: 4 
    },
    dateValue: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#1976d2' 
    },
    dropdownContainer: { 
        marginBottom: 10 
    },
    dropdownLabel: { 
        fontWeight: 'bold', 
        marginBottom: 8, 
        color: '#333' 
    },
    pickerWrapper: { 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        overflow: 'hidden' 
    },
    
    // ==========================================
    // 2. STYLE RIÊNG CHO ADMIN (ADMIN SPECIFIC)
    // ==========================================
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 10 
    },
    gridCard: { 
        flex: 0.48, 
        elevation: 2 
    }, 
    statNumber: { 
        fontSize: 22, 
        color: '#333' 
    },
    statLabel: { 
        fontSize: 13, 
        color: 'gray' 
    },

    // ==========================================
    // 3. STYLE RIÊNG CHO ĐẦU BẾP (CHEF SPECIFIC)
    // ==========================================
    dishCard: { 
        marginBottom: 8, 
        backgroundColor: '#fff' 
    },
    dishRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    revenueText: { 
        fontWeight: 'bold', 
        color: '#2e7d32', 
        fontSize: 16 
    },
    switchContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 15,
        marginBottom: 5,
        paddingHorizontal: 5
    },
    switchLabel: {
        fontWeight: 'bold', 
        color: '#555',
        fontSize: 15
    },
});

export default DashboardStyles;