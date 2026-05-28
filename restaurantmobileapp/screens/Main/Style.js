import { StyleSheet } from 'react-native';

const COLORS = {
    primary: '#A8D5C9', // Xanh ngọc
    background: '#F5F5F5',
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#888888',
    accent: '#FF7F50', // Màu cam cho giá tiền/icon
    darkGreen: '#1A5D4A' // Xanh đậm cho nút bấm
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // Header & Search
    topSection: {
        backgroundColor: COLORS.primary,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 15,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchInput: {
        flex: 1,
        backgroundColor: COLORS.white,
        height: 45,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        fontSize: 16,
    },
    filterBtn: {
        backgroundColor: COLORS.darkGreen,
        width: 45,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Categories
    categoryContainer: {
        paddingVertical: 15,
        paddingLeft: 20,
    },
    categoryItem: {
        marginRight: 20,
        paddingBottom: 5,
    },
    categoryText: {
        fontSize: 16,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: COLORS.textDark,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.textDark,
    },
    // Food List
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    foodCard: {
        flexDirection: 'row', // Chuyển thành hàng ngang
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    foodImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    foodInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    foodName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    foodMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    metaText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginRight: 15,
        marginLeft: 5,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: 5,
    },
    // Modal Filter
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    applyBtn: {
        backgroundColor: COLORS.darkGreen,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    applyBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        paddingBottom: 40, // Đệm cho các máy có thanh điều hướng ảo
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 10,
    },
    // Giao diện ô nhập Giá
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    priceInput: {
        flex: 1,
        backgroundColor: COLORS.background,
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    priceDivider: {
        marginHorizontal: 15,
        fontSize: 20,
        color: COLORS.textLight,
    },
    // Giao diện nút chọn Thời gian
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },
    timeBtn: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    timeBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.darkGreen,
    },
    timeBtnText: {
        color: COLORS.textLight,
        fontWeight: '600',
    },
    timeBtnTextActive: {
        color: COLORS.darkGreen,
        fontWeight: 'bold',
    },
    // Giao diện Nút hành động (Reset / Apply)
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:20
    },
    resetBtn: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        marginRight: 10,
    },
    resetBtnText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontWeight: 'bold',
    },
    applyBtn: {
        flex: 2,
        backgroundColor: COLORS.darkGreen,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    applyBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});