import { Image, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import Styles from "../styles/Styles";

const MyItem = ({ item, next }) => {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(item.price);

    const defaultImage = "https://cdn3.ivivu.com/2023/08/pho-bo-ivivu.jpeg";
    const imageSource = item.illustration ? { uri: item.illustration } : { uri: defaultImage };

    return (
        <TouchableOpacity onPress={next} activeOpacity={0.8} style={{ marginBottom: 12 }}>
            <List.Item
                title={item.dish}
                titleStyle={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}
                description={`${item.description}\n⏱ ${item.time} phút  •   ${formattedPrice}`}
                descriptionNumberOfLines={3}
                descriptionStyle={{ color: '#666', fontSize: 13, marginTop: 4 }}
                left={() => (
                    <Image
                        style={[Styles.avatar, { width: 70, height: 70, borderRadius: 8 }]}
                        source={imageSource}
                    />
                )}
                style={{
                    backgroundColor: '#fafafa',
                    borderRadius: 12,
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                }}
            />
        </TouchableOpacity>
    );
}

export default MyItem;