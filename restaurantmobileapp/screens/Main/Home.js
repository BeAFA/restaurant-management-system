import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { List, Searchbar } from "react-native-paper";
import Styles from "../../styles/Styles";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import SimpleFood from "../../components/SimpleFood";
import { SafeAreaView } from "react-native-safe-area-context";
import Style from "./Style";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [topDishes, setTopDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5733" />
                <Text style={{ marginTop: 10 }}>Đang tải menu món ăn...</Text>
            </View>
        );
    }

    const handleCategoryPress = (item) => {
        navigation.navigate('menu', {
            screen: 'menu_index',
            params: { categoryFromHome: item }
        });
    };

    return (

        <ScrollView style={[Styles.padding, { flex: 1, backgroundColor: '#f2f4f6' }]}>

            <SafeAreaView edges={["top"]}>
                <Text style={Styles.headerTitle}>DK Restaurant</Text>
                <Searchbar placeholder="Tìm món ăn bạn thích..." style={{ marginBottom: 20 }} />
            </SafeAreaView>


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

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>
                Top 10 Món Bán Chạy 🔥
            </Text>

            <View style={{ marginBottom: 30 }}>
                {topDishes.map((dish) => (
                    <SimpleFood
                        key={dish.id}
                        item={dish}
                        next={() => navigation.navigate('menu', {
                            screen: 'food_detail',
                            initial: false,
                            params: { foodId: dish.id }
                        })}
                    />
                ))}
            </View>

        </ScrollView>
    );
}

export default Home;