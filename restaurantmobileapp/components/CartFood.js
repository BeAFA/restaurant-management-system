import React, { memo, useContext } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import CartContext from "../contexts/CartContext";
import Styles from "../styles/CartFoodStyle";

const CartFood = ({ item }) => {
    const {
        addToCart,
        removeFromCart,
    } = useContext(CartContext);

    const currencyFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    const defaultImage =
        "https://cdn3.ivivu.com/2023/08/pho-bo-ivivu.jpeg";

    const imageSource = item.illustration
        ? { uri: item.illustration }
        : { uri: defaultImage };

    const quantity = item.quantity || 1;

    const subtotal = item.price * quantity;

    return (
        <View style={Styles.card}>
            <Image
                source={imageSource}
                style={Styles.image}
            />

            <View style={Styles.infoContainer}>
                <Text
                    numberOfLines={1}
                    style={Styles.title}
                >
                    {item.dish}
                </Text>

                <Text style={Styles.rating}>
                    ⭐ {Number(item.avg_rating || 0).toFixed(1)}
                </Text>

                <Text style={Styles.price}>
                    {currencyFormatter.format(item.price)}
                </Text>

                <Text style={Styles.subtotal}>
                    Thành tiền: {currencyFormatter.format(subtotal)}
                </Text>

                <View style={Styles.quantityWrapper}>
                    <TouchableOpacity
                        style={Styles.quantityButton}
                        onPress={() => removeFromCart(item.id)}
                    >
                        <MaterialIcons
                            name="remove"
                            size={18}
                            color="#fff"
                        />
                    </TouchableOpacity>

                    <Text style={Styles.quantityText}>
                        {quantity}
                    </Text>

                    <TouchableOpacity
                        style={Styles.quantityButton}
                        onPress={() => addToCart(item)}
                    >
                        <MaterialIcons
                            name="add"
                            size={18}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default memo(CartFood);