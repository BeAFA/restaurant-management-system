import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Style from "../../styles/CompareFoodStyle";
import Apis, { endpoints } from "../../configs/Apis";
import FoodCompareContext from "../../contexts/FoodCompareContext";
import { useNavigation } from "@react-navigation/native";

const FoodCompare = ({ route }) => {
    const {
        foodsToCompare,
        clearFoodsToCompare
    } = useContext(FoodCompareContext);

    const [comparedFoods, setComparedFoods] = useState([]);
    const navigation = useNavigation();

    const handleClear = () => {
        clearFoodsToCompare();
        navigation.goBack();
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);

    const compareRows = [
        {
            label: "Hình ảnh",
            key: "illustration",
            render: (food) => (
                <Image
                    source={{ uri: food.illustration }}
                    style={Style.foodImage}
                />
            )
        },
        {
            label: "Giá",
            key: "price",
            render: (food) => (
                <Text style={Style.priceText}>
                    {formatPrice(food.price)}
                </Text>
            )
        },
        {
            label: "Đánh giá",
            key: "avg_rating",
            render: (food) => (
                <Text style={Style.ratingText}>
                    {Number(food.avg_rating || 0).toFixed(1)} ⭐
                </Text>
            )
        },
        {
            label: "Lượt review",
            key: "review_count",
            render: (food) => (
                <Text style={Style.valueText}>
                    {food.review_count}
                </Text>
            )
        },
        {
            label: "Thời gian",
            key: "time",
            render: (food) => (
                <Text style={Style.valueText}>
                    {food.time} phút
                </Text>
            )
        },
        {
            label: "Danh mục",
            key: "category_name",
            render: (food) => (
                <Text style={Style.categoryText}>
                    {food.category_name}
                </Text>
            )
        },
        {
            label: "Nguyên liệu",
            key: "ingredients",
            render: (food) => (
                <Text style={Style.ingredientText}>
                    {food.ingredients
                        ?.map(i => i.name)
                        .join(", ")}
                </Text>
            )
        },
        {
            label: "Mô tả",
            key: "description",
            render: (food) => (
                <Text style={Style.descriptionText}>
                    {food.description}
                </Text>
            )
        }
    ];



    useEffect(() => {

        const loadComparedFoods = async () => {

            try {

                const ids = foodsToCompare
                    .map(item => item.id)
                    .join(",");

                console.log("COMPARE IDS:", ids);

                const res = await Apis.get(
                    endpoints['foods_compare'](ids)
                );

                console.log("COMPARE DATA:", res.data);

                setComparedFoods(res.data);

            } catch (err) {
                console.log("COMPARE ERROR:", err);
            }
        };

        if (foodsToCompare.length >= 2) {
            loadComparedFoods();
        } else {
            setComparedFoods([]);
        }

    }, [foodsToCompare]);

    if (!comparedFoods.length) {
        return (
            <View style={Style.emptyContainer}>
                <Text style={Style.emptyText}>
                    Không có món ăn nào để so sánh
                </Text>
            </View>
        );
    }

    return (

        <View style={Style.container}>

            <SafeAreaView edges={["top"]}>
                <Text style={Style.headerTitle}>
                    So sánh món ăn
                </Text>
            </SafeAreaView>
            <ScrollView>
                <ScrollView horizontal>
                    <View style={Style.scrollContainer}>

                        <View style={Style.headerRow}>

                            <View style={Style.attributeHeaderCell}>
                                <Text style={Style.attributeHeaderText}>
                                    Thuộc tính
                                </Text>
                            </View>

                            {comparedFoods.map(food => (
                                <View
                                    key={food.id}
                                    style={Style.foodHeaderCell}
                                >
                                    <Text style={Style.foodHeaderText}>
                                        {food.dish}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {compareRows.map((row, index) => (
                            <View
                                key={index}
                                style={Style.compareRow}
                            >

                                <View style={Style.attributeCell}>
                                    <Text style={Style.attributeText}>
                                        {row.label}
                                    </Text>
                                </View>

                                {comparedFoods.map(food => (
                                    <View
                                        key={food.id}
                                        style={Style.valueCell}
                                    >
                                        {row.render(food)}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>
            <View style={Style.actionContainer}>
                <TouchableOpacity
                    style={Style.clearButton}
                    onPress={handleClear}
                >
                    <Text style={Style.clearButtonText}>
                        Clear Comparison
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FoodCompare;