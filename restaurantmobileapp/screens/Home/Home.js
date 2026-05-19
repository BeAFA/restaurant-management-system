import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { List, Searchbar } from "react-native-paper";
import Styles from "../../styles/Styles";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import MyItem from "../../components/MyItem";

const Home = () => {
   
    return (
        <View style={Styles.padding}>
            
            <Text style={Styles.headerTitle}>DK Restaurant</Text>
        </View>
    );
}

export default Home;