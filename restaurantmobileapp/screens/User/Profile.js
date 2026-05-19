import { Image, Text, View, ScrollView } from "react-native";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";
import { Button, List } from "react-native-paper";
import Style from "./Style"; 

const Profile = () => {
    const [user, dispatch] = useContext(MyUserContext);

    // Ghép tên và họ, nếu không có thì hiển thị mặc định
    const fullName = (user.first_name || user.last_name) 
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
        : 'Người dùng DK Restaurant';

    return (
        <View style={Style.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* Phần Nền Cam Header */}
                <View style={Style.headerBackground} />

                {/* Phần Avatar và Thông tin cơ bản */}
                <View style={Style.profileContainer}>
                    <View style={Style.avatarWrapper}>
                        <Image 
                            
                            style={Style.avatar} 
                        />
                    </View>
                    <Text style={Style.nameText}>{fullName}</Text>
                    <Text style={Style.usernameText}>@{user.username}</Text>
                </View>

                {/* Thanh thống kê (Số liệu mẫu cho Food App) */}
                <View style={Style.statsContainer}>
                    <View style={Style.statItem}>
                        <Text style={Style.statNumber}>12</Text>
                        <Text style={Style.statLabel}>Đơn hàng</Text>
                    </View>
                    <View style={Style.statItem}>
                        <Text style={Style.statNumber}>3</Text>
                        <Text style={Style.statLabel}>Voucher</Text>
                    </View>
                    <View style={Style.statItem}>
                        <Text style={Style.statNumber}>5</Text>
                        <Text style={Style.statLabel}>Yêu thích</Text>
                    </View>
                </View>

                {/* Danh sách Menu Chức năng */}
                <View style={Style.menuContainer}>
                    <List.Section>
                        <List.Item
                            title="Lịch sử đơn hàng"
                            left={props => <List.Icon {...props} icon="receipt" color="#FF6347" />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                            onPress={() => console.log('Chuyển đến lịch sử')}
                        />
                        <List.Item
                            title="Địa chỉ giao hàng"
                            left={props => <List.Icon {...props} icon="map-marker" color="#FF6347" />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                            onPress={() => console.log('Chuyển đến địa chỉ')}
                        />
                        <List.Item
                            title="Ví thanh toán"
                            left={props => <List.Icon {...props} icon="wallet" color="#FF6347" />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                            onPress={() => console.log('Chuyển đến thanh toán')}
                        />
                        <List.Item
                            title="Cài đặt tài khoản"
                            left={props => <List.Icon {...props} icon="cog" color="#888" />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="#ccc" />}
                            onPress={() => console.log('Chuyển đến cài đặt')}
                        />
                    </List.Section>
                </View>

                {/* Nút Đăng xuất */}
                <Button 
                    mode="outlined" 
                    icon="logout"
                    style={Style.logoutButton}
                    labelStyle={Style.logoutText}
                    onPress={() => dispatch({"type": "LOGOUT"})}
                >
                    Đăng xuất
                </Button>

            </ScrollView>
        </View>
    );
}

export default Profile;