import { FlatList, Text, TouchableOpacity } from "react-native";
import TableContext from "../../contexts/TableContext";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

const TableSelection = () => {
    const { selectTable } = useContext(TableContext);
    const navigation = useNavigation();

    const handleSelectTable = (table) => {
        selectTable(table);
        navigation.navigate("cart");
    };

    return (
        <FlatList
            data={tables}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectTable(item)}>
                    <Text>Bàn {item.id} - {item.slot} chỗ</Text>
                </TouchableOpacity>
            )}
        />
    );
};

export default TableSelection;