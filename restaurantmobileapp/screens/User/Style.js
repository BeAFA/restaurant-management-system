import { StyleSheet } from "react-native";

export default StyleSheet.create({
    // ==========================================
    // 1. KHUNG CƠ BẢN (Dùng chung)
    // ==========================================
    container: {
        flex: 1,
        backgroundColor: '#FFF5E5', // Nền trắng cho Login & Register
        paddingLeft: 15,
        paddingRight: 15,
    },
    scrollContent: {
        paddingBottom: 300,
    },
    headerContainer: { 
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    
    // ==========================================
    // 2. TEXT & TYPOGRAPHY (Dùng chung)
    // ==========================================
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6347', // Màu cam đỏ Tomato (Foodie Express)
        marginTop: 15,
    },
    subText: {
        fontSize: 20,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 14,
    },

    // ==========================================
    // 3. FORM & NÚT BẤM (Login & Register)
    // ==========================================
    formContainer: {
        backgroundColor: '#F69D39', // Nền xám nhạt cho form
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 25,
        elevation: 3, // Bóng nhẹ cho form
    },
    input: {
        marginBottom: 12,
        backgroundColor : '#F69D39', // Loại bỏ nền trắng mặc định của TextInput
    },
    primaryButton: { // Đã đổi tên để dùng cho cả Đăng nhập & Đăng ký
        paddingVertical: 6,
        backgroundColor: '#FFE394',
        borderRadius: 25,
        elevation: 2,
        marginTop: 10,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    forgotPassword: { // Dành riêng cho Đăng nhập
        textAlign: 'right',
        color: '#b9422a',
        marginTop: 5,
        marginBottom: 20,
        fontWeight: '600',
    },
    logoImage: { // Logo đồ ăn ở trang Đăng nhập
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },

    // ==========================================
    // 4. PHẦN CHỌN ẢNH (Dành riêng cho Register)
    // ==========================================
    avatarPickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderWidth: 1.5,
        borderColor: '#FF6347',
        borderStyle: 'dashed', 
        borderRadius: 12,
        marginBottom: 15,
        marginTop: 5,
        backgroundColor: '#FFF5F3', 
    },
    avatarPickerText: {
        color: '#FF6347',
        fontWeight: 'bold',
        fontSize: 16,
    },
    avatarPreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FF6347',
    },

    // ==========================================
    // 5. TRANG PROFILE (Hồ sơ người dùng)
    // ==========================================
    profileContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Nền xám nhạt làm nổi bật khối thông tin
    },
    headerBackground: {
        backgroundColor: '#FF6347',
        height: 120,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileInfoWrapper: { 
        alignItems: 'center',
        marginTop: -60, // Kéo phần info đè lên nền cam
        marginBottom: 20,
    },
    avatarWrapper: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 10,
    },
    usernameText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 15,
        elevation: 2,
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    statLabel: {
        fontSize: 14,
        color: '#888888',
        marginTop: 4,
    },
    menuContainer: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        borderRadius: 15,
        elevation: 2,
        overflow: 'hidden', 
        marginBottom: 20,
    },
    logoutButton: {
        marginHorizontal: 20,
        marginBottom: 40,
        paddingVertical: 6,
        borderColor: '#FF6347',
        borderWidth: 1.5,
        borderRadius: 25,
        backgroundColor: '#FFF5F3',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6347',
    },
    //6. TRANG ACCOUNT (Hub Đăng nhập / Đăng ký)
    accountContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFF5E5', // Đồng bộ màu nền chung
    },
    accountTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FF6347', // Màu cam đỏ chủ đạo
        textAlign: 'center',
        marginBottom: 10,
    },
    accountSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 10,
        lineHeight: 24,
    },
    accountLoginBtn: {
        backgroundColor: '#FF6347', 
        paddingVertical: 15,
        borderRadius: 25, // Bo góc đồng bộ với primaryButton
        alignItems: 'center',
        marginBottom: 15,
        elevation: 3,
    },
    accountLoginText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    accountRegisterBtn: {
        backgroundColor: '#FFE394', // Màu vàng nhạt phụ trợ
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 2,
    },
    accountRegisterText: {
        color: '#FF6347',
        fontSize: 18,
        fontWeight: 'bold',
    }
});