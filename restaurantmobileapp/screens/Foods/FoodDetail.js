import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from "react-native";
CLIENT_ID_REMOVED
import { Card } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import Styles from "../../styles/DetailFoodStyles";
import CartContext from "../../contexts/CartContext";
import Reviews from "../../components/SimpleReviews";
import UserContext from "../../contexts/UserContext";
import TableContext from "../../contexts/TableContext";
import FoodCompareContext from "../../contexts/FoodCompareContext";
import * as SecureStore from "expo-secure-store";


const formatPlainString = (htmlString) => {
    if (!htmlString) return "Chưa có mô tả chi tiết cho món ăn này.";
    return htmlString.replace(/<[^>]*>/g, '');
};

const StarRating = ({ rating, onRate }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => onRate(star)} style={{ marginHorizontal: 6 }}>
                    <MaterialIcons
                        name={star <= rating ? "star" : "star-border"}
                        size={36}
                        color={star <= rating ? "#FFC107" : "#ccc"}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const FoodDetail = ({ route }) => {
    const { cart, addToCart } = useContext(CartContext);
    const { foodsToCompare, addFoodToCompare } = useContext(FoodCompareContext);
    const { foodId } = route.params;
    const [food, setFood] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const { table } = useContext(TableContext);

    //--- State cho Review Modal ---
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);
    // Thêm state
    const [userReview, setUserReview] = useState(null);   // review của chính user
    const [isEditing, setIsEditing] = useState(false);    // đang sửa hay tạo mới
    const [deletingReview, setDeletingReview] = useState(false);

    const loadFood = async () => {
        setLoading(true);
        try {
            let res = await Apis.get(endpoints['food_detail'](foodId));
            setFood(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết món ăn:", error);
        }
        setLoading(false);
    };

    const loadReviews = async () => {
        setLoading(true);
        try {
            let res = await Apis.get(endpoints['food_reviews'](foodId));
            const allReviews = res.data.results;
            setReviews(allReviews);

            if (user) {
                const mine = allReviews.find(r => r.user?.id === user.id);
                setUserReview(mine || null);
            }
        } catch (error) {
            console.error("Lỗi khi lấy đánh giá món ăn:", error);
        }
        setLoading(false);
    }

    const handleOpenReviewModal = () => {
        if (!user) { navigation.navigate("account_tab"); return; }

        if (userReview) {
            // ✅ Điền sẵn dữ liệu cũ vào modal
            setReviewComment(userReview.comment || "");
            setReviewRating(userReview.rating || 5);
            setIsEditing(true);
        } else {
            setReviewComment("");
            setReviewRating(5);
            setIsEditing(false);
        }
        setReviewModalVisible(true);
    };

    // Cập nhật handleSubmitReview — phân nhánh POST / PATCH
    const handleSubmitReview = async () => {
        if (!user) {
            setReviewModalVisible(false);
            navigation.navigate("account_tab");
            return;
        }

        setSubmittingReview(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            let res;

            if (isEditing && userReview) {
                // ✅ PATCH — chỉnh sửa review cũ
                res = await authApis(token).patch(
                    endpoints['current_review'](userReview.id),
                    { comment: reviewComment, rating: reviewRating }
                );
                // Cập nhật review trong danh sách
                setReviews(prev => prev.map(r => r.id === userReview.id ? res.data : r));
                setUserReview(res.data);
            } else {
                // ✅ POST — tạo review mới
                res = await authApis(token).post(
                    endpoints['food_reviews'](foodId),
                    { comment: reviewComment, rating: reviewRating }
                );
                setReviews(prev => [res.data, ...prev]);
                setUserReview(res.data);
            }

            setReviewModalVisible(false);
            setReviewComment("");
            setReviewRating(5);
            setIsEditing(false);
        } catch (error) {
            console.log("STATUS:", error?.response?.status);
            console.log("DATA:", JSON.stringify(error?.response?.data, null, 2));
            const errorData = error?.response?.data;
            let errorMessage = "Không thể gửi đánh giá.";
            if (errorData) {
                errorMessage = Object.entries(errorData)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join('\n');
            }
            Alert.alert(`Lỗi ${error?.response?.status || ''}`, errorMessage);
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async () => {
        Alert.alert(
            "Xóa đánh giá",
            "Bạn có chắc muốn xóa đánh giá này không?",
            [
                { text: "Huỷ", style: "cancel" },
                {
                    text: "Xóa", style: "destructive",
                    onPress: async () => {
                        setDeletingReview(true);
                        try {
                            const token = await SecureStore.getItemAsync('token');
                            await authApis(token).delete(
                                endpoints['review_detail'](userReview.id)
                            );
                            // ✅ Xóa khỏi danh sách và reset userReview
                            setReviews(prev => prev.filter(r => r.id !== userReview.id));
                            setUserReview(null);
                            setReviewModalVisible(false);
                        } catch (error) {
                            Alert.alert("Lỗi", "Không thể xóa đánh giá. Vui lòng thử lại.");
                            console.log("DELETE ERROR:", error?.response?.data);
                        } finally {
                            setDeletingReview(false);
                        }
                    }
                }
            ]
        );
    };



    const handleAddToCart = () => {
        if (!user) {
            navigation.navigate("account_tab");
            return;
        }

        if (!table) {
            navigation.navigate("table_entry");
            return;
        }

        addToCart(food);
    };

    const handleCompareFoods = async (food) => {
        // ✅ Build ids từ context hiện tại + food mới (không gọi addFoodToCompare ở đây)
        const existingIds = foodsToCompare.map(item => item.id);
        const uniqueIds = [...new Set([...existingIds, food.id])];

        if (uniqueIds.length < 2) {
            // Lưu vào context để lần sau chọn thêm
            addFoodToCompare(food);
            Alert.alert("Thông báo", "Hãy chọn thêm ít nhất 1 món nữa để so sánh");
            return;
        }

        try {
            const idsParam = uniqueIds.join(",");
            const res = await Apis.get(endpoints['foods_compare'](idsParam));

            // ✅ Cập nhật context sau khi API thành công
            addFoodToCompare(food);

            navigation.navigate("food_compare", {
                comparedFoods: res.data
            });
        } catch (error) {
            Alert.alert(
                "Lỗi",
                error?.response?.data?.error || "Không thể so sánh món ăn"
            );
        }
    };


    useEffect(() => {
        loadFood();
        loadReviews();
    }, [foodId, submittingReview, deletingReview]);

    if (!food) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5733" />
                <Text style={{ marginTop: 10 }}>Đang tải chi tiết món ăn...</Text>
            </View>
        );
    }

    return (
        <View style={Styles.container}>
            {loading && <ActivityIndicator color="#0E7468" size="large" style={{ marginTop: 20 }} />}

            {food && (
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <Reviews item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}

                    ListHeaderComponent={
                        <View>
                            <View style={Styles.imageContainer}>
                                <Card.Cover source={{ uri: food.illustration }} style={Styles.illustration} />

                                <TouchableOpacity style={[Styles.navButton, Styles.leftNav]} onPress={() => navigation.goBack()}>
                                    <MaterialIcons name="chevron-left" size={24} color="#FFF" />
                                </TouchableOpacity>

                                {user && (
                                    <TouchableOpacity style={[Styles.navButton, Styles.rightNav]} onPress={() => navigation.navigate("cart_tab", { screen: "cart_index" })}>
                                        <MaterialIcons name="shopping-basket" size={20} color="#FFF" />
                                        {cart.length > 0 && (
                                            <View style={{
                                                position: 'absolute', top: -5, right: -5,
                                                backgroundColor: 'red', borderRadius: 10,
                                                width: 18, height: 18, justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={Styles.infoContainer}>
                                <View style={Styles.headerRow}>
                                    <Text style={Styles.title}>{formatPlainString(food.dish)}</Text>
                                    <View style={Styles.metaRight}>
                                        <View style={Styles.metaItem}>
                                            <MaterialIcons name="access-time" size={14} color="#0E7468" />
                                            <Text style={Styles.metaText}> {food.time || "20 min"} min</Text>
                                        </View>
                                        <View style={[Styles.metaItem, { marginLeft: 10 }]}>
                                            <MaterialIcons name="star-border" size={14} color="#FF6B4A" />
                                            <Text style={[Styles.metaText, { color: '#FF6B4A' }]}> {Number(food.avg_rating).toFixed(1)}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={Styles.price}>{food.price || "25.00$"}</Text>

                                <Text style={Styles.description}>
                                    {formatPlainString(food.description)}
                                </Text>

                                <Text style={Styles.title}>Nguyên liệu:</Text>
                                <FlatList
                                    data={food.ingredients}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) =>
                                        <Text item={item}>{formatPlainString(item.name)}</Text>}
                                    showsVerticalScrollIndicator={true}
                                    contentContainerStyle={{ paddingBottom: 120 }}>
                                </FlatList>

                                <TouchableOpacity style={[Styles.compareButton, Styles.leftCompare]} onPress={() => handleCompareFoods(food)}>
                                    <Text style={Styles.compareButtonText}>So sánh món ăn</Text>
                                </TouchableOpacity>

                            </View>
                            {/* Hàng tiêu đề + nút — thay onPress bằng handleOpenReviewModal */}
                            <View style={Styles.reviewSectionRow}>
                                <Text style={Styles.reviewSectionTitle}>
                                    Đánh giá từ khách hàng ({reviews.length})
                                </Text>
                                <TouchableOpacity onPress={handleOpenReviewModal} style={Styles.writeReviewButton}>
                                    <MaterialIcons
                                        name={userReview ? "edit" : "rate-review"}
                                        size={16} color="#FFF"
                                    />
                                    <Text style={Styles.writeReviewText}>
                                        {userReview ? "Sửa đánh giá" : "Viết đánh giá"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Modal — cập nhật tiêu đề theo trạng thái */}
                            <Modal visible={reviewModalVisible} transparent animationType="slide"
                                onRequestClose={() => setReviewModalVisible(false)}>
                                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                                    style={Styles.modalOverlay}>
                                    <View style={Styles.modalContainer}>
                                        <View style={Styles.modalHeader}>
                                            {/* ✅ Tiêu đề modal thay đổi theo trạng thái */}
                                            <Text style={Styles.modalTitle}>
                                                {isEditing ? "Chỉnh sửa đánh giá" : "Đánh giá món ăn"}
                                            </Text>
                                            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                                                <MaterialIcons name="close" size={24} color="#666" />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={Styles.modalSubtitle}>
                                            {food?.dish} — Hãy chia sẻ cảm nhận của bạn!
                                        </Text>

                                        <Text style={Styles.starRatingLabel}>Chất lượng món ăn</Text>
                                        <StarRating rating={reviewRating} onRate={setReviewRating} />

                                        <TextInput
                                            style={Styles.commentInput}
                                            placeholder="Nhập nhận xét của bạn (tuỳ chọn)..."
                                            placeholderTextColor="#bbb"
                                            multiline numberOfLines={4}
                                            value={reviewComment}
                                            onChangeText={setReviewComment}
                                        />

                                        <View style={Styles.reviewActionRow}>
                                            {/* Nút xóa — chỉ hiện khi đang chỉnh sửa */}
                                            {isEditing && (
                                                <TouchableOpacity
                                                    onPress={handleDeleteReview}
                                                    disabled={deletingReview}
                                                    style={deletingReview ? Styles.deleteReviewButtonDisabled : Styles.deleteReviewButton}
                                                >
                                                    {deletingReview
                                                        ? <ActivityIndicator color="#fff" />
                                                        : <>
                                                            <MaterialIcons name="delete-outline" size={18} color="#fff" />
                                                            <Text style={Styles.deleteReviewText}>Xóa đánh giá</Text>
                                                        </>
                                                    }
                                                </TouchableOpacity>
                                            )}

                                            {/* Nút gửi / cập nhật */}
                                            <TouchableOpacity
                                                onPress={handleSubmitReview}
                                                disabled={submittingReview}
                                                style={submittingReview ? Styles.submitReviewButtonDisabled : Styles.submitReviewButton}
                                            >
                                                {submittingReview
                                                    ? <ActivityIndicator color="#fff" />
                                                    : <Text style={Styles.submitReviewText}>
                                                        {isEditing ? "Cập nhật" : "Gửi đánh giá"}
                                                    </Text>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </KeyboardAvoidingView>
                            </Modal>
                        </View>}

                    ListEmptyComponent={
                        <Text style={{ color: '#aaa', fontSize: 14, fontStyle: 'italic', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 }}>
                            Chưa có đánh giá nào cho món ăn này.
                        </Text>
                    }

                />
            )}

            {food && (
                <View style={Styles.bottomBar}>
                    {!table ? (
                        <>
                            <TouchableOpacity
                                style={Styles.addToCartButton}
                                onPress={() => navigation.navigate("table_entry")}
                            >
                                <Text style={Styles.addToCartText}>Chọn bàn</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={Styles.addToCartButton}
                            onPress={handleAddToCart}
                        >
                            <Text style={Styles.addToCartText}>Add to cart (Bàn {table.id})</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    )
}

export default FoodDetail;