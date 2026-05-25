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
        marginTop: 20,
        left: 20,
    },
    rightNav: {
        marginTop: 20,
        right: 20,
    },
    // Khối thông tin dưới ảnh
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 100,
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
    clearCartButton: {
        flex: 1,
        backgroundColor: '#FF5733',
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
    // ✅ REVIEW SECTION — hàng tiêu đề + nút viết đánh giá
    reviewSectionRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, marginTop: 10, marginBottom: 12,
    },
    reviewSectionTitle: {
        fontSize: 18, fontWeight: 'bold', color: '#111',
    },
    writeReviewButton: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#0E7468', borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 6,
        elevation: 2,
        shadowColor: '#0E7468', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, shadowRadius: 4,
    },
    writeReviewText: {
        color: '#FFF', fontSize: 13, fontWeight: '600', marginLeft: 5,
    },

    // ✅ MODAL OVERLAY
    modalOverlay: {
        flex: 1, justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },

    // ✅ MODAL CONTAINER
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, paddingBottom: 40,
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1, shadowRadius: 12, elevation: 10,
    },

    // ✅ MODAL HEADER (tiêu đề + nút đóng)
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 4,
    },
    modalTitle: {
        fontSize: 18, fontWeight: 'bold', color: '#1a1a1a',
    },
    modalSubtitle: {
        color: '#888', fontSize: 13, marginBottom: 8,
    },

    // ✅ STAR RATING
    starRatingLabel: {
        fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center',
    },
    starRatingRow: {
        flexDirection: 'row', justifyContent: 'center', marginVertical: 12,
    },
    starButton: {
        marginHorizontal: 6,
    },

    // ✅ COMMENT INPUT
    commentInput: {
        borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12,
        padding: 12, fontSize: 14, color: '#333',
        minHeight: 100, textAlignVertical: 'top',
        backgroundColor: '#fafafa', marginBottom: 16,
    },
    reviewActionRow: {
        flexDirection: 'row',
        gap: 10,
    },

    // ✅ SUBMIT BUTTON
    submitReviewButton: {
        flex: 1,
        backgroundColor: '#0E7468',
        borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    },
    submitReviewButtonDisabled: {
        flex: 1,
        backgroundColor: '#aaa',
        borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    },
    submitReviewText: {
        color: '#fff', fontSize: 16, fontWeight: '700',
    },// ✅ Nút xóa
    deleteReviewButton: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FF4444',
        borderRadius: 14, paddingVertical: 14,
    },
    deleteReviewButtonDisabled: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#aaa',
        borderRadius: 14, paddingVertical: 14,
    },
    deleteReviewText: {
        color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 4,
    },
});