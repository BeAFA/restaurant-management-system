import React, { memo } from "react";
import { Image, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import Styles from "../styles/SimpleFoodStyles";

const SimpleFood = ({ item, next }) => {
    const currencyFormatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });

    const formattedPrice = currencyFormatter.format(item.price);

    const defaultImage = "https://cdn3.ivivu.com/2023/08/pho-bo-ivivu.jpeg";
    const imageSource = item.illustration ? { uri: item.illustration } : { uri: defaultImage };

    const LeftImage = () => (
        <Image
            style={Styles.illustration}
            source={imageSource}
        />
    );

    return (
        <TouchableOpacity onPress={next} activeOpacity={0.8} style={Styles.card}>
            <List.Item
                title={item.dish}
                titleStyle={Styles.title}
                description={`${Number(item.avg_rating || 0).toFixed(1)} ⭐\n⏱ ${item.time} phút  •   ${formattedPrice}`}
                descriptionNumberOfLines={2}
                descriptionStyle={Styles.description}
                left={LeftImage}
                style={Styles.contentStyle}
            />
        </TouchableOpacity>
    );
}

export default memo(SimpleFood);