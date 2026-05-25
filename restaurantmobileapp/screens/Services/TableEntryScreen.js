import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/TableEntryStyles";

const TableEntryScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Xin chào 👋</Text>

            <Text style={styles.title}>
                Bạn muốn dùng bữa{"\n"}thế nào hôm nay?
            </Text>

            <Text style={styles.subtitle}>
                Chọn hình thức phù hợp với bạn
            </Text>

            {/* Đến trực tiếp */}
            <TouchableOpacity
                style={[styles.card, styles.walkIn]}
                onPress={() => navigation.navigate("table_selection_walkin")}
            >
                <View style={[styles.iconBox, styles.purpleIcon]}>
                    <Ionicons name="restaurant-outline" size={28} color="#5B5FFF" />
                </View>

                <View style={styles.content}>
                    <Text style={styles.cardTitle}>Đến trực tiếp</Text>

                    <Text style={styles.cardDesc}>
                        Quét QR bàn hoặc chọn bàn trống ngay bây giờ
                    </Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Nhanh nhất</Text>
                    </View>
                </View>

                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {/* Đặt trước */}
            <TouchableOpacity
                style={[styles.card, styles.reservation]}
                onPress={() => navigation.navigate("reservation_form")}
            >
                <View style={[styles.iconBox, styles.greenIcon]}>
                    <Ionicons name="calendar-outline" size={28} color="#1F9D68" />
                </View>

                <View style={styles.content}>
                    <Text style={styles.cardTitle}>Đặt bàn trước</Text>

                    <Text style={styles.cardDesc}>
                        Chọn ngày, giờ và số người — bàn sẽ được giữ cho bạn
                    </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>hoặc</Text>
                <View style={styles.divider} />
            </View>

            {/* QR */}
            <TouchableOpacity style={[styles.card, styles.qrCard]} onPress={() => navigation.navigate("QRScanner")}>
                <View style={[styles.iconBox, styles.orangeIcon]}>
                    <MaterialIcons name="qr-code-scanner" size={28} color="#D28A22" />
                </View>

                <View style={styles.content}>
                    <Text style={styles.cardTitle}>Quét mã QR bàn</Text>

                    <Text style={styles.cardDesc}>
                        Hướng camera vào mã QR trên bàn của bạn
                    </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                Bạn có thể thay đổi bàn bất kỳ lúc nào trong giỏ hàng
            </Text>
        </View>
    );
};

export default TableEntryScreen;