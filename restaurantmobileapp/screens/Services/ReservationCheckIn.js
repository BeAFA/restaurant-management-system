import {
    View, Text, TouchableOpacity, ActivityIndicator, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTable } from "../../contexts/TableContext";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import { authApis, endpoints } from "../../configs/Apis";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

// How many minutes before/after serve_time check-in is allowed.
const CHECK_IN_EARLY_MINUTES = 10;
const CHECK_IN_LATE_MINUTES = 30;

const ReservationCheckIn = () => {
    const navigation = useNavigation();
    const { selectTable } = useTable();
    const { user } = useContext(UserContext);

    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);
    const [windowStatus, setWindowStatus] = useState(null);
    // "too_early" | "in_window" | "too_late" | null

    useEffect(() => {
        fetchUpcomingReservation();
    }, []);

    useEffect(() => {
        if (!reservation) return;
        evaluateWindow();
        // Re-evaluate every 30 s so the UI updates as time passes
        const timer = setInterval(evaluateWindow, 30_000);
        return () => clearInterval(timer);
    }, [reservation]);

    const fetchUpcomingReservation = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync("token");
            const res = await authApis(token).get(
                `${endpoints["reservations"]}current_reservation/`
            );
            setReservation(res.data);
        } catch (e) {
            const status = e.response?.status;
            if (status === 404) {
                // No upcoming reservation
                setReservation(null);
            } else {
                Alert.alert("Lỗi", "Không thể tải thông tin đặt bàn.");
            }
        } finally {
            setLoading(false);
        }
    };

    const evaluateWindow = () => {
        if (!reservation?.serve_time) return;

        const now = new Date();
        const serveTime = new Date(reservation.serve_time);
        const windowStart = new Date(
            serveTime.getTime() - CHECK_IN_EARLY_MINUTES * 60_000
        );
        const windowEnd = new Date(
            serveTime.getTime() + CHECK_IN_LATE_MINUTES * 60_000
        );

        if (now < windowStart) {
            setWindowStatus("too_early");
        } else if (now > windowEnd) {
            setWindowStatus("too_late");
        } else {
            setWindowStatus("in_window");
        }
    };

    const handleCheckIn = async () => {
        if (windowStatus !== "in_window") return;
        setCheckingIn(true);
        try {
            const token = await SecureStore.getItemAsync("token");
            const res = await authApis(token).post(
                `${endpoints["reservations"]}${reservation.id}/check_in/`
            );

            const { session_code } = res.data;

            // Persist session_code for Cart
            await SecureStore.setItemAsync("session_code", session_code);

            // Save table to context (reservation.table is the table id from the serializer)
            selectTable({ id: reservation.table }, "reservation");

            navigation.navigate("CustomerTabs", { screen: "cart_index" });
        } catch (e) {
            const msg =
                e.response?.data?.error ?? "Check-in thất bại, thử lại sau.";
            Alert.alert("Lỗi", msg);
        } finally {
            setCheckingIn(false);
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!reservation) {
        return (
            <SafeAreaView style={styles.center}>
                <MaterialIcons name="event-busy" size={48} color="#aaa" />
                <Text style={styles.emptyText}>
                    Bạn không có đặt bàn nào sắp tới
                </Text>
                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => navigation.navigate("reservation_form")}
                >
                    <Text style={styles.secondaryBtnText}>Đặt bàn ngay</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const serveTime = new Date(reservation.serve_time);
    const windowStart = new Date(
        serveTime.getTime() - CHECK_IN_EARLY_MINUTES * 60_000
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Reservation card */}
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <MaterialIcons
                            name="table-restaurant"
                            size={22}
                            color="#1976D2"
                        />
                        <Text style={styles.cardLabel}>
                            Bàn {reservation.table}
                        </Text>
                    </View>
                    <View style={styles.cardRow}>
                        <MaterialIcons
                            name="schedule"
                            size={22}
                            color="#1976D2"
                        />
                        <Text style={styles.cardLabel}>
                            {formatTime(reservation.serve_time)} —{" "}
                            {formatTime(reservation.end_time)}
                        </Text>
                    </View>
                    <View style={styles.cardRow}>
                        <MaterialIcons
                            name="people"
                            size={22}
                            color="#1976D2"
                        />
                        <Text style={styles.cardLabel}>
                            {reservation.customer_quantity} khách
                        </Text>
                    </View>
                </View>

                {/* Window status banner */}
                {windowStatus === "too_early" && (
                    <View style={[styles.banner, styles.bannerWarning]}>
                        <MaterialIcons
                            name="access-time"
                            size={18}
                            color="#7a5c00"
                        />
                        <Text style={styles.bannerTextWarning}>
                            Check-in mở lúc {formatTime(windowStart.toISOString())}
                            {" "}({CHECK_IN_EARLY_MINUTES} phút trước giờ hẹn)
                        </Text>
                    </View>
                )}

                {windowStatus === "too_late" && (
                    <View style={[styles.banner, styles.bannerError]}>
                        <MaterialIcons name="error-outline" size={18} color="#7a1212" />
                        <Text style={styles.bannerTextError}>
                            Đã quá giờ check-in. Vui lòng liên hệ nhân viên.
                        </Text>
                    </View>
                )}

                {windowStatus === "in_window" && (
                    <View style={[styles.banner, styles.bannerSuccess]}>
                        <MaterialIcons name="check-circle" size={18} color="#155724" />
                        <Text style={styles.bannerTextSuccess}>
                            Trong giờ check-in — sẵn sàng!
                        </Text>
                    </View>
                )}

                {/* Check-in button */}
                <TouchableOpacity
                    style={[
                        styles.checkInBtn,
                        windowStatus !== "in_window" && styles.checkInBtnDisabled,
                    ]}
                    onPress={handleCheckIn}
                    disabled={windowStatus !== "in_window" || checkingIn}
                >
                    {checkingIn ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.checkInBtnText}>
                            Check-in &amp; vào bàn
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
        gap: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        padding: 24,
    },
    emptyText: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        elevation: 1,
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    cardLabel: {
        fontSize: 16,
        color: "#222",
    },
    banner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: 8,
    },
    bannerWarning: { backgroundColor: "#fff3cd" },
    bannerError: { backgroundColor: "#f8d7da" },
    bannerSuccess: { backgroundColor: "#d4edda" },
    bannerTextWarning: { color: "#7a5c00", flex: 1, fontSize: 14 },
    bannerTextError: { color: "#7a1212", flex: 1, fontSize: 14 },
    bannerTextSuccess: { color: "#155724", flex: 1, fontSize: 14 },
    checkInBtn: {
        backgroundColor: "#1976D2",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },
    checkInBtnDisabled: {
        backgroundColor: "#b0bec5",
    },
    checkInBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryBtn: {
        marginTop: 8,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#1976D2",
    },
    secondaryBtnText: { color: "#1976D2", fontSize: 15 },
};

export default ReservationCheckIn;