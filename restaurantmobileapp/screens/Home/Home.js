import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { List, Searchbar } from "react-native-paper";
import Styles from "../../styles/Styles";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import MyItem from "../../components/MyItem";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [topDishes, setTopDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigation();

    const fetchData = async () => {
        try {
            setLoading(true);

            const [resCategories, resTopDishes] = await Promise.all([
                Apis.get(endpoints['categories']),
                Apis.get(endpoints['top_dishes'])
            ]);
            setCategories(resCategories.data);
            setTopDishes(resTopDishes.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleCategoryPress = (item) => {
        nav.navigate('menu', {
            screen: 'menu_index', // Đi vào trang danh sách Menu
            params: { categoryFromHome: item } // Truyền nguyên Object danh mục sang
        });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5733" />
                <Text style={{ marginTop: 10 }}>Đang tải menu món ăn...</Text>
            </View>
        );
    }

    return (
        // Toàn bộ màn hình được bao bởi ScrollView để có thể cuộn lên xuống
        <ScrollView style={[Styles.padding, { flex: 1, backgroundColor: '#fff' }]}>

            {/* 3. KHU VỰC DANH MỤC (CATEGORIES) */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Danh mục</Text>
            <FlatList
                horizontal={true} // Bật tính năng vuốt NANG
                showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn xấu xí đi
                data={categories} // Truyền dữ liệu danh mục vào
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    // Định dạng giao diện cho từng ô danh mục nút bấm
                    <TouchableOpacity style={{
                        padding: 10,
                        backgroundColor: '#f0f0f0',
                        borderRadius: 20,
                        marginRight: 10,
                        marginBottom: 20
                    }} onPress={() => handleCategoryPress(item)}>
                        <Text style={{ fontWeight: '500' }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* 4. KHU VỰC TOP 10 MÓN BÁN CHẠY */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>
                Top 10 Món Bán Chạy 🔥
            </Text>

            <View style={{ marginBottom: 30 }}>
                {topDishes.map((dish) => (
                    <MyItem
                        key={dish.id}
                        item={dish}
                        next={() => nav.navigate('menu', {
                            screen: 'dish_detail',
                            initial: false,
                            params: { dishId: dish.id }
                        })}
                    />
                ))}
            </View>

        </ScrollView>
    );
}

export default Home;