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

    // Called when user selects a table from the list (no session yet —
    // staff will create the DiningSession and hand over the session_code,
    // e.g. printed on a receipt or via QR at the table).
    const handleSelectTable = (table) => {
        selectTable(table, "walk_in");
        navigation.navigate("CustomerTabs", {
            screen: "cart_index",
        });
    };

    // Called after the QR scanner resolves a session_code from the table QR.
    // The QR on each table should encode: { tableId, session_code }
    // const handleQRResult = async (qrData) => {
    //     try {
    //         const parsed = JSON.parse(qrData);
    //         const { tableId, session_code } = parsed;

    //         if (!tableId || !session_code) {
    //             Alert.alert("Lỗi", "Mã QR không hợp lệ.");
    //             return;
    //         }

    //         // Persist session_code so Cart can use it immediately
    //         await SecureStore.setItemAsync("session_code", session_code);

    //         // Find matching table object (may already be in our list, or build minimal)
    //         const matchedTable =
    //             tables.find((t) => t.id === tableId) ?? { id: tableId };

    //         selectTable(matchedTable, "walk_in");
    //         navigation.navigate("CustomerTabs", {
    //             screen: "cart_index",
    //         });
    //     } catch {
    //         Alert.alert("Lỗi", "Không thể đọc mã QR.");
    //     }
    // };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, padding: 20 }}>
                {/* <TouchableOpacity
                    style={{
                        padding: 12,
                        backgroundColor: "#4CAF50",
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                    onPress={() =>
                        navigation.navigate("camera_table_selection", {
                            onQRResult: handleQRResult,
                        })
                    }
                >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                        📷 Quét mã QR trên bàn
                    </Text>
                </TouchableOpacity> */}

                {/* <Text
                    style={{
                        textAlign: "center",
                        marginBottom: 12,
                        color: "#888",
                    }}
                >
                    — hoặc chọn bàn —
                </Text> */}

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