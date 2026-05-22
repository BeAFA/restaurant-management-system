import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { Card } from "react-native-paper";

const formatPlainString = (htmlString) => {
    if (!htmlString) return "Chưa có mô tả chi tiết cho món ăn này.";
    // Lệnh này sẽ tìm tất cả những gì nằm trong cặp dấu <> và xóa sạch nó đi
    return htmlString.replace(/<[^>]*>/g, '');
};

const FoodDetail = ({ route }) => {
    const { dishId } = route.params;
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);


    const loadDish = async () => {
        setLoading(true);
        try {
            let res = await Apis.get(endpoints['dish_detail'](dishId));
            setDish(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết món ăn:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadDish();
    }, [dishId]);

    if (!dish) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5733" />
                <Text style={{ marginTop: 10 }}>Đang tải chi tiết món ăn...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            {loading && <ActivityIndicator />}
            {dish && (
                <Card style={{ margin: 10, backgroundColor: '#fff', elevation: 3 }}>
                    <Card.Cover source={{ uri: dish.illustration }} />
                    <Card.Title
                        title={formatPlainString(dish.dish)}
                        titleStyle={{ fontSize: 22, fontWeight: 'bold' }}
                    />
                    <Card.Content>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
                            Mô tả món ăn:
                        </Text>
                        <Text style={{ fontSize: 15, color: '#444', lineHeight: 22 }}>
                            {formatPlainString(dish.description)}
                        </Text>
                        <Text style={{ color: '#aaa', fontSize: 12, marginTop: 15 }}>
                            Ngày đăng: {dish.created_date}
                        </Text>
                    </Card.Content>
                </Card>
            )}
        </ScrollView>
    )
}

export default FoodDetail;