import { Text, View } from "react-native";
import Styles from "../styles/Styles";

const Header = () => {

    return (
        <View style={Styles.headerContainer}>
                <Text style={Styles.headerTitle}>DK Restaurant</Text>
        </View>
    );
}

export default Header;