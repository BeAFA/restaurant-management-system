import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#FFF',
    },
    illustration: {
        width: width,
        height: width * 0.8, // Tỷ lệ ảnh cân đối
        backgroundColor: '#F5F5F5',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    // Nút điều hướng đè lên ảnh
    navButton: {
        position: 'absolute',
        top: 40, // Điều chỉnh tùy theo tai thỏ/notch của thiết bị
        backgroundColor: '#0E7468',
        padding: 8,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Tạo bóng đổ trên Android
        shadowColor: '#000', // Tạo bóng đổ trên iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    leftNav: {
        left: 20,
    },
    rightNav: {
        right: 20,
    },
    // Khối thông tin dưới ảnh
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 100, // Tạo khoảng trống để không bị nút Bottom Bar che mất khi cuộn
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111111',
        flex: 1,
        marginRight: 10,
    },
    metaRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 13,
        color: '#0E7468',
        fontWeight: '500',
    },
    price: {
        fontSize: 20,
        fontWeight: '800', // Extra bold
        color: '#111111',
        marginTop: 8,
        marginBottom: 20,
    },
    description: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    // Thanh mua hàng cố định ở dưới cùng (Bottom Bar)
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#0E7468',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});