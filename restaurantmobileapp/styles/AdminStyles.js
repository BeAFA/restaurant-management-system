import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    // ==========================================
    // 1. STYLE DÙNG CHUNG (COMMON STYLES)
    // ==========================================
    container: {
        flex: 1,
        padding: 10,
    },
    screenBackground: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingIndicator: {
        marginTop: 40,
    },
    actionButtonMargin: {
        marginRight: 10,
    },
    highlightCard: {
        backgroundColor: '#e8f5e9',
        marginTop: 15,
    },
    highlightTitle: {
        fontWeight: 'bold',
    },
    highlightValue: {
        color: '#2e7d32',
        fontSize: 24,
    },
    noDataText: {
        fontStyle: 'italic',
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
    flexOne: {
        flex: 1,
    },
    centeredColumn: {
        justifyContent: 'center',
    },
    header: {
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 18,
    },
    card: {
        marginBottom: 10,
        elevation: 2,
    },
    modeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    filterBtn: {
        flex: 1,
        marginHorizontal: 2,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    dateBox: {
        flex: 0.48,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1976d2',
    },
    dropdownContainer: {
        marginBottom: 10,
    },
    dropdownLabel: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    pickerWrapper: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
    },

    // ==========================================
    // 2. STYLE RIÊNG CHO ADMIN (ADMIN SPECIFIC)
    // ==========================================
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    gridCard: {
        flex: 0.48,
        elevation: 2,
    },
    statNumber: {
        fontSize: 22,
        color: '#333',
    },
    statLabel: {
        fontSize: 13,
        color: 'gray',
    },
    highlightLabel: {
        fontWeight: 'bold',
        color: '#e65100',
    },
    subtitleText: {
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
        color: 'black',
    },
    foodTitle: {
        fontSize: 16,
    },
    foodMetaText: {
        color: 'gray',
        fontSize: 13,
    },
    ratingText: {
        color: '#f39c12',
        fontSize: 13,
    },
    qrButtonMargin: {
        marginTop: 15,
    },

    // ==========================================
    // 3. STYLE RIÊNG CHO ĐẦU BẾP (CHEF SPECIFIC)
    // ==========================================
    dishCard: {
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    dishRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    revenueText: {
        fontWeight: 'bold',
        color: '#2e7d32',
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 5,
        paddingHorizontal: 5,
    },
    switchLabel: {
        fontWeight: 'bold',
        color: '#555',
        fontSize: 15,
    },
    checkinContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    checkinTitle: {
        textAlign: 'center',
        marginBottom: 20,
    },
    checkinInput: {
        marginBottom: 20,
    },
});