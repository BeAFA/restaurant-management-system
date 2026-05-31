import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { List, Searchbar } from "react-native-paper";
import Styles from "../../styles/Styles";
import MainStyles from "../../styles/MainStyles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import SimpleFood from "../../components/SimpleFood";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryContext from "../../contexts/CategoryContext";

const Home = () => {
    const { categories } = useContext(CategoryContext)
    const [topDishes, setTopDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            setLoading(true);

            const resTopDishes = await Apis.get(endpoints['top_dishes']);
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
            <View style={MainStyles.loadingScreen}>
                <ActivityIndicator size="large" color="#FF5733" />
                <Text style={MainStyles.loadingText}>
                    Đang tải menu món ăn...
                </Text>
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

        <ScrollView style={MainStyles.container}>

            <SafeAreaView edges={["top"]}>
                <Header />
                <Text style={MainStyles.sectionTitle}>Danh mục</Text>
            </SafeAreaView>
            <FlatList
                horizontal={true} 
                showsHorizontalScrollIndicator={false} 
                data={categories} 
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    
                    <TouchableOpacity style={MainStyles.categoryButton} onPress={() => handleCategoryPress(item)}>
                        <Text style={MainStyles.categoryButtonText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            <Text style={[MainStyles.sectionTitle, { marginTop: 10 }]}>
                Top 10 Món Bán Chạy 🔥
            </Text>

            <View style={MainStyles.sectionSpacing}>
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


            <Footer />
        </ScrollView>
    );
}

export default Home;