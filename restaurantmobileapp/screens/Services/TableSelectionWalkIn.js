import {
    View, Text, TouchableOpacity, FlatList,
    ActivityIndicator, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTable } from "../../contexts/TableContext";
import { useState, useEffect } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

const TableSelectionWalkIn = () => {
    const { selectTable } = useTable();
    const navigation = useNavigation();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync("token");
                const now = new Date();
                const params = new URLSearchParams({
                    serve_time: now.toISOString(),
                });
                const res = await authApis(token).get(
                    `${endpoints["tables"]}?${params}`
                );
                setTables(res.data.results ?? res.data);
            } catch (e) {
                console.log("Lỗi tải bàn:", e);
                Alert.alert("Lỗi", "Không thể tải danh sách bàn.");
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);


    const handleSelectTable = (table) => {
        selectTable(table, "walk_in");
        navigation.navigate("CustomerTabs", {
            screen: "cart_index"
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 20 }}>
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <FlatList
                        data={tables}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelectTable(item)}
                                style={{
                                    padding: 16,
                                    marginBottom: 8,
                                    backgroundColor: "#fff",
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: "#ddd",
                                }}
                            >
                                <Text>
                                    Bàn {item.id} — {item.slot} chỗ
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default TableSelectionWalkIn;