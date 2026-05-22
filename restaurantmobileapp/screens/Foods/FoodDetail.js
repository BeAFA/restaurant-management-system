import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View, TouchableOpacity } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { Card } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import Styles from "../../styles/DetailFoodStyles";
import CartContext from "../../contexts/CartContext";
import Reviews from "../../components/SimpleReviews";
import UserContext from "../../contexts/UserContext";


const formatPlainString = (htmlString) => {
    if (!htmlString) return "Chưa có mô tả chi tiết cho món ăn này.";
    return htmlString.replace(/<[^>]*>/g, '');
};

const FoodDetail = ({ route }) => {
    const { cart, dispatchCart, addToCart, clearCart } = useContext(CartContext);
    const { foodId } = route.params;
    const [food, setFood] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { user } = useContext(UserContext);


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
            setReviews(res.data.results);
        } catch (error) {
            console.error("Lỗi khi lấy đánh giá món ăn:", error);
        }
        setLoading(false);
    }

    const handleAddToCart = () => {
        if (!user) {
            navigation.navigate("login");
            return;
        }

        addToCart(food);
    };

    useEffect(() => {
        loadFood();
        loadReviews();
    }, [foodId]);

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

                                <TouchableOpacity style={[Styles.navButton, Styles.rightNav]} onPress={handleAddToCart}>
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


                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, paddingHorizontal: 20, marginTop: 10 }}>
                                Đánh giá từ khách hàng ({reviews.length})
                            </Text>
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
                    <TouchableOpacity style={Styles.addToCartButton}
                        onPress={handleAddToCart}
                    >
                        <Text style={Styles.addToCartText}>Add to cart</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default FoodDetail;