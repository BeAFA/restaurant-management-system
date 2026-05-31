import { Text, View } from "react-native";
import Styles from "../styles/Styles";

const Footer = () => {

    return (
        <View style={Styles.footerContainer}>
            <Text style={Styles.footerTitle}>DK Restaurant</Text>
            <Text style={Styles.footerSubTitle}>© 2026 All Rights Reserved</Text>
        </View>
    );
}

export default Footer;