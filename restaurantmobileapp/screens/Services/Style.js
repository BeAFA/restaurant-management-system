import { StyleSheet } from "react-native";

export default StyleSheet.create({
    // ==========================================
    // 1. KHUNG CƠ BẢN & TIÊU ĐỀ
    // ==========================================
    container: {
        flex: 1,
        backgroundColor: '#FFF5E5', // Màu nền chuẩn của app
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6347', // Màu cam đỏ Tomato
        textAlign: 'center',
        marginBottom: 25,
        textTransform: 'uppercase', // In hoa cho sang trọng
        letterSpacing: 1,
    },

    // ==========================================
    // 2. TRẠNG THÁI 1: FORM ĐẶT BÀN
    // ==========================================
    formContainer: {
        backgroundColor: '#FFFFFF', // Nền trắng để form nhìn sạch sẽ, dễ đọc
        padding: 25,
        borderRadius: 25,
        elevation: 4, // Đổ bóng giống khối formContainer cũ
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#F5F5F5', // Xám nhạt thay vì cam đậm để chữ dễ nhìn hơn
        minHeight: 50,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        justifyContent: 'center', // Giúp text trong TouchableOpacity căn giữa theo chiều dọc
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    primaryButton: {
        backgroundColor: '#FF6347', // Dùng màu cam đỏ làm nút chính cho nổi bật
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },
    buttonLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // ==========================================
    // 3. TRẠNG THÁI 2: VÉ ĐẶT BÀN (TICKET CARD)
    // ==========================================
    ticketCard: {
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 10,
        // Tạo viền nét đứt hoặc viền màu vàng để giống một tấm vé
        borderWidth: 2,
        borderColor: '#FFE394', 
        borderStyle: 'dashed',
        elevation: 5,
        shadowColor: '#FF6347',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    infoText: {
        fontSize: 18,
        color: '#333333',
        marginBottom: 15,
        fontWeight: '600',
    },
    cancelBtn: {
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#FF6347', // Viền đỏ cam giống nút Đăng xuất ở Profile
        backgroundColor: '#FFF5F3', 
    },
    cancelBtnText: {
        color: '#FF6347',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    tableBtn: {
        width: '30%', // Chia 3 cột
        backgroundColor: '#F5F5F5',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    tableBtnSelected: {
        backgroundColor: '#FFE394',
        borderColor: '#FF6347',
    },
    tableBtnDisabled: {
        backgroundColor: '#E0E0E0',
        opacity: 0.6,
    },
    tableBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    tableBtnTextSelected: {
        color: '#FF6347',
    },
    tableSubText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    tableStatusText: {
        fontSize: 10,
        color: 'red',
        fontWeight: 'bold',
        marginTop: 4,
    },

    // ==========================================
    // 5. MODAL XÁC NHẬN
    // ==========================================
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF6347',
        textAlign: 'center',
        marginBottom: 20,
    },
    summaryBox: {
        backgroundColor: '#FFF5E5',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    summaryText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    modalCancelText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalConfirmBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#FF6347',
    },
    modalConfirmText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});