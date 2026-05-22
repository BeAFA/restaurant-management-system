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
import SimpleFood from "../../components/SimpleFood";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
    const { cart, dispatchCart, addToCart, clearCart, removeFromCart } = useContext(CartContext);
    const [food, setFood] = useState([]);
    const navigation = useNavigation();
    const { user } = useContext(UserContext);

    const confirm = async () => {
        try {
            const res = await Apis.post(endpoints['orders']);
        } catch (error) {
            console.error("Tạo order thất bại", error);
        }
    };

    useEffect(() => { }, []);

    if (!food) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5733" />
                <Text style={{ marginTop: 10 }}>Đang tải chi tiết giỏ hàng...</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20, flex: 1, backgroundColor: '#f2f4f6' }}>

            {cart && cart.length > 0 ? (
                <>
                    <SafeAreaView edges={["top"]}>
                        <Text style={Styles.headerTitle}>Giỏ hàng của bạn</Text>
                    </SafeAreaView>
                    <FlatList
                        data={cart}
                        renderItem={({ item }) => (
                            <SimpleFood
                                key={item.id}
                                item={item}
                            />
                        )}
                    >
                    </FlatList>
                    <View style={Styles.bottomBar}>
                        <TouchableOpacity style={Styles.addToCartButton}
                            onPress={clearCart}
                        >
                            <Text style={Styles.addToCartText}>Clear Cart</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.bottomBar}>
                        <TouchableOpacity style={Styles.addToCartButton}
                            onPress={confirm}
                        >
                            <Text style={Styles.addToCartText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ):(
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#555555' }}>Giỏ hàng của bạn đang trống</Text>
                </View>
            )}
        </View>
    );
}

export default Cart;