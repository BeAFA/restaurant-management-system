import React, { memo } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import Styles from "../styles/SimpleFoodStyles";

const FoodCompare = ({ item, next }) => {
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
        <FlatList
            horizontal={true}
            data={item.foods}
            renderItem={({ item }) => (
                <List.Item
                    title={item.dish}
                    titleStyle={Styles.title}
                    description={`${Number(item.avg_rating || 0).toFixed(1)} ⭐\n⏱ ${item.time} phút  •   ${formattedPrice}`}
                    descriptionNumberOfLines={2}
                    descriptionStyle={Styles.description}
                    top={LeftImage}
                    style={Styles.contentStyle}
                />
            )}
        />
    );
}

export default memo(FoodCompare);