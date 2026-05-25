import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTable } from "../../contexts/TableContext";
import { useState, useEffect } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import QRScanner from "./CameraTableSelection";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

const TableSelectionWalkIn = () => {
    const { selectTable } = useTable();
    const navigation = useNavigation();
    const [mode, setMode] = useState('list');
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    // Walk-in không cần filter thời gian — lấy tất cả bàn AVAILABLE ngay lúc này
    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync('token');
                const now = new Date();
                const params = new URLSearchParams({
                    serve_time: now.toISOString(),
                    // không cần end_time, không cần customer_quantity (walk-in chọn bàn tự do)
                });
                const res = await authApis(token).get(`${endpoints['tables']}?${params}`);
                setTables(res.data.results ?? res.data);
            } catch (e) {
                console.log('❌ Lỗi tải bàn:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    const handleSelectTable = (table) => {
        selectTable(table, 'walk_in');
        navigation.navigate('cart_tab', { screen: 'cart_index' });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity
                    style={{ padding: 12, backgroundColor: "#4CAF50", borderRadius: 8, marginBottom: 16 }}
                    onPress={() => setMode("qr")}
                >
                    <Text style={{ color: "#fff", textAlign: "center" }}>📷 Quét mã QR trên bàn</Text>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", marginBottom: 12, color: "#888" }}>— hoặc chọn bàn —</Text>

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
                                <Text>Bàn {item.id} — {item.slot} chỗ</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default TableSelectionWalkIn;