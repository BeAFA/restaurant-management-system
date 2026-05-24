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
import TableContext from "../../contexts/TableContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
    const { cart, dispatchCart, addToCart, clearCart, removeFromCart } = useContext(CartContext);
    const [food, setFood] = useState([]);
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const { table, tableSource, reservationId, clearTable } = useContext(TableContext);

    const confirm = async () => {
        if (!table) {
            alert("Vui lòng chọn bàn trước!");
            return;
        }
        if (!user) {
            alert("Vui lòng đăng nhập!");
            return;
        }

        try {
            const token = await SecureStore.getItemAsync("token");

            const payload = {
                table_id: table.id,
                items: cart,
                source: tableSource,                   
                ...(reservationId && { reservation_id: reservationId }),
            };

            await authApis(token).post(endpoints['orders'], payload);

            clearCart();
            clearTable();
            navigation.navigate("Home");
        } catch (error) {
            console.error("Tạo order thất bại", error.response?.data || error);
            alert("Đặt hàng thất bại, vui lòng thử lại");
        }
    };

    useEffect(() => { }, []);

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
                        <TouchableOpacity style={Styles.clearCartButton} onPress={clearCart}>
                            <Text style={Styles.addToCartText}>Clear Cart</Text>
                        </TouchableOpacity>

                        <View style={{ width: 10 }} />

                        <TouchableOpacity style={Styles.addToCartButton} onPress={confirm}>
                            <Text style={Styles.addToCartText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#555555' }}>Giỏ hàng của bạn đang trống</Text>
                </View>
            )}

            {table ? (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                    <Text>Bàn đang chọn: Bàn {table.id}</Text>
                    <TouchableOpacity onPress={clearTable} style={{ marginLeft: 8 }}>
                        <Text style={{ color: "red" }}>✕</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => navigation.navigate("table_entry")}>
                    <Text style={{ color: "#1976D2" }}>+ Chọn bàn</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default Cart;