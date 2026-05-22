import React from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Styles from "../styles/SimpleReviewStyles";

const Reviews = ({ item }) => {
    const defaultImage = "https://cdn3.ivivu.com/2023/08/pho-bo-ivivu.jpeg";
    const imageSource = item.avatar ? { uri: item.avatar } : { uri: defaultImage };

    return (
            <TouchableOpacity activeOpacity={0.8} style={Styles.reviewCard}>
                {/* Hàng chứa Avatar + Tên + Số Sao */}
                <View style={Styles.userInfoRow}>
                    <Image style={Styles.avatar} source={imageSource} />

                    <View style={Styles.userMeta}>
                        <Text style={Styles.userName}>
                            {item.user?.first_name || ""} {item.user?.last_name || "Ẩn danh"}
                        </Text>
                        {/* Hiển thị số sao */}
                        <View style={Styles.ratingRow}>
                            <MaterialIcons name="star" size={14} color="#FF6B4A" />
                            <Text style={Styles.ratingText}>{Number(item.rating).toFixed(1)}/5</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={Styles.dateText}>
                            {item.created_date ? new Date(item.created_date).toLocaleDateString() : "Ngày không xác định"}
                        </Text>
                    </View>
                </View>

                {/* Nội dung bình luận */}
                <Text style={Styles.commentText}>
                    {item.comment || "Người dùng không để lại bình luận."}
                </Text>
            </TouchableOpacity>
    );
};

export default Reviews;