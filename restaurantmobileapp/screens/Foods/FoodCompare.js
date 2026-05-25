import { FlatList, Text, TouchableOpacity, View } from "react-native";
import SimpleFoodCompare from "../../components/SimpleFoodCompare";
import { useState } from "react";
import FoodCompareContext from "../../contexts/FoodCompareContext";
import { SafeAreaView } from "react-native-safe-area-context";

const FoodCompare = () => {
    const { foodsToCompare,
        dispatchFoodsToCompare,
        addToFoodsToCompare,
        removeFromFoodsToCompare,
        clearFoodsToCompare } = useContext(FoodCompareContext);
    const [food, setFood] = useState([]);

    useEffect(() => { }, []);

    return (
        <View style={{ padding: 20, flex: 1, backgroundColor: '#f2f4f6' }}>
        
                    {foodsToCompare && foodsToCompare.length > 0 ? (
                        <>
                            <SafeAreaView edges={["top"]}>
                                <Text style={Styles.headerTitle}>So sánh món ăn</Text>
                            </SafeAreaView>
                            <FlatList
                                data={foodsToCompare}
                                renderItem={({ item }) => (
                                    <SimpleFoodCompare
                                        key={item.id}
                                        item={item}
                                    />
                                )}
                            >
                            </FlatList>
                            <View style={Styles.bottomBar}>
                                <TouchableOpacity style={Styles.clearCartButton} onPress={clearFoodsToCompare}>
                                    <Text style={Styles.addToCartText}>Clear Comparison</Text>
                                </TouchableOpacity>
        
                                <View style={{ width: 10 }} />
        
                                <TouchableOpacity style={Styles.addToCartButton} onPress={confirm}>
                                    <Text style={Styles.addToCartText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, color: '#555555' }}>Không có món ăn nào để so sánh</Text>
                        </View>
                    )}
                </View>
    )
}

export default FoodCompare;