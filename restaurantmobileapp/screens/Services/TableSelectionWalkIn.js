import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTable } from "../../contexts/TableContext";
import { useState, useEffect } from "react";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import QRScanner from "./CameraTableSelection";
import * as SecureStore from "expo-secure-store";

const TableSelectionWalkIn = () => {
    const { selectTable } = useTable();
    const navigation = useNavigation();
    const [mode, setMode] = useState("list");
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);


    const getEndTime = (st) => new Date(st.getTime() + 30 * 60 * 1000);

    useEffect(() => {
        const fetchTables = async (start) => {
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync('token');
                const end = getEndTime(start);

                const url =
                    `${endpoints['available_tables']}` +
                    `?serve_time=${start.toISOString()}&end_time=${end.toISOString()}`
                        `&customer_quantity=${Number(quantity)}`;

                console.log("👉 URL:", url);

                const res = await authApis(token).get(url);
                setAllTables(res.data.results || res.data);
                setSelectedTable(null);

            } catch (error) {
                console.log("❌ Lỗi tải bàn:", error);
            }
        };
        fetchTables();
    }, []);

    const handleSelectTable = (table) => {
        selectTable(table, "walk_in");
        navigation.navigate("cart");
    };

    if (mode === "qr") {
        return <QRScanner onSuccess={handleSelectTable} />;
    }

    return (
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
    );
};

export default TableSelectionWalkIn;