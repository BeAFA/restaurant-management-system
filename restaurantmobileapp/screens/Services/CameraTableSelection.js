import { CameraView, useCameraPermissions } from "expo-camera";
import { useTable } from "../../contexts/TableContext";
import { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const QRScanner = ({ onSuccess }) => {
    const { selectTable } = useTable();
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    const handleScan = ({ data }) => {
        if (scanned) return;
        setScanned(true);

        try {
            const tableData = JSON.parse(data);

            if (onSuccess) {
                
                onSuccess(tableData);
            } else {
                
                selectTable(tableData, "walk_in");
                navigation.navigate('CustomerTabs', { screen: 'cart_index' });
            }
        } catch {
            alert("QR không hợp lệ");
            setScanned(false);
        }
    };

    if (!permission?.granted) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={requestPermission}>
                    <Text>Cấp quyền camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <CameraView
            style={{ flex: 1 }}
            onBarcodeScanned={handleScan}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
    );
};

export default QRScanner;