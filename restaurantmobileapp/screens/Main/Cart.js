import { useContext } from "react";
import {
    FlatList, Text, View, TouchableOpacity, Alert
} from "react-native";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import CartContext from "../../contexts/CartContext";
import UserContext from "../../contexts/UserContext";
import CartFood from "../../components/CartFood";
import TableContext from "../../contexts/TableContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import Styles from "../../styles/CartFoodStyle";

const Cart = () => {
    const navigation = useNavigation();
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(UserContext);
    const { table, tableSource, reservationId, clearTable } = useContext(TableContext);

    const parseErrorMsg = (error) => {
        const data = error?.response?.data;
        if (!data) return "Đặt hàng thất bại!";
        if (typeof data === "string") return data;
        if (data.error) return data.error;
        if (data.non_field_errors) return data.non_field_errors.join("\n");
        return Object.values(data).flat().join("\n");
    };

    const confirm = async () => {
        if (!user) {
            Alert.alert("Thông báo", "Vui lòng đăng nhập!");
            return;
        }

        if (!table) {
            navigation.navigate("table_entry");
            return;
        }

        try {
            const token = await SecureStore.getItemAsync("token");
            let payload;

            if (tableSource === "reservation") {
                if (!reservationId) {
                    Alert.alert("Lỗi", "Không tìm thấy thông tin đặt bàn.");
                    return;
                }
                payload = {
                    reservation_id: reservationId,
                    details: cart.map((item) => ({
                        food: item.id,
                        quantity: item.quantity,
                    })),
                };
            } else {
                payload = {
                    table_id: table.id,
                    details: cart.map((item) => ({
                        food: item.id,
                        quantity: item.quantity,
                    })),
                };
            }

            const res = await authApis(token).post(endpoints["orders"], payload);
            const order = res.data;

            clearCart();

            navigation.navigate("payment_qr", { order });
        } catch (error) {
            Alert.alert("Lỗi", parseErrorMsg(error));
        }
    };

    return (
        <View style={{ padding: 20, flex: 1, backgroundColor: "#f2f4f6" }}>
            {cart && cart.length > 0 ? (
                <>
                    <SafeAreaView edges={["top"]}>
                        <Text style={Styles.headerTitle}>Giỏ hàng của bạn</Text>
                    </SafeAreaView>

                    <View>
                        {table ? (
                            <View style={Styles.tableInfoContainer}>
                                <MaterialIcons
                                    name="table-restaurant"
                                    size={20}
                                    color="#1976D2"
                                />
                                <Text
                                    style={{
                                        marginLeft: 8,
                                        color: "#1976D2",
                                        fontWeight: "600",
                                    }}
                                >
                                    Bàn {table.id}
                                    {tableSource === "reservation"
                                        ? "  📅 Đặt trước"
                                        : ""}
                                </Text>
                                <TouchableOpacity
                                    onPress={clearTable}
                                    style={{ marginLeft: 10 }}
                                >
                                    <MaterialIcons
                                        name="close"
                                        size={18}
                                        color="red"
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("table_entry")}
                                style={Styles.emptyTableContainer}
                            >
                                <MaterialIcons
                                    name="add-circle-outline"
                                    size={20}
                                    color="#1976D2"
                                />
                                <Text
                                    style={{
                                        marginLeft: 5,
                                        color: "#1976D2",
                                        fontWeight: "600",
                                    }}
                                >
                                    Chọn bàn
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <CartFood item={item} />}
                    />

                    <View style={Styles.bottomBar}>
                        <TouchableOpacity
                            style={Styles.clearCartButton}
                            onPress={clearCart}
                        >
                            <Text style={Styles.addToCartText}>Xoá giỏ</Text>
                        </TouchableOpacity>

                        <View style={{ width: 10 }} />

                        <TouchableOpacity
                            style={Styles.addToCartButton}
                            onPress={confirm}
                        >
                            <Text style={Styles.addToCartText}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 18, color: "#555555" }}>
                        Giỏ hàng của bạn đang trống
                    </Text>
                </View>
            )}
        </View>
    );
};

export default Cart;