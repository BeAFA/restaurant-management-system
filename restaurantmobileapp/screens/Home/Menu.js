import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';;
import Apis, { endpoints } from "../../configs/Apis";
import { Chip } from "react-native-paper";
import Style from "./Style";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header";

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const route = useRoute(); // Thêm dòng này để đọc tham số truyền vào
    const [activeCategory, setActiveCategory] = useState({ id: '', name: 'All' });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1); // Thêm State quản lý trang
    const [showFilter, setShowFilter] = useState(false);

    // State cho Bộ lọc
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxTime, setMaxTime] = useState(''); // Ví dụ: '15', '30'
    const [appliedFilters, setAppliedFilters] = useState({ min: '', max: '', time: '' });

    const nav = useNavigation();

    // 2. Tải danh mục (Chỉ gọi 1 lần khi mở app)
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await Apis.get(endpoints['categories']);

                // Lấy dữ liệu an toàn: Nếu có res.data.results thì dùng, không thì lấy res.data
                const categoryData = res.data.results || res.data;

                setCategories([{ id: '', name: 'All' }, ...categoryData]);
            } catch (ex) {
                console.log("Lỗi tải danh mục:", ex.message);
            }
        };
        loadCategories();
    }, []);

    // 3. Kỹ thuật Reset Page: Đưa về trang 1 nếu người dùng đổi từ khóa tìm kiếm hoặc đổi Category
    useEffect(() => {
        setPage(1);
    }, [searchQuery, activeCategory.id]);

    // 4. Kỹ thuật Debounce & Theo dõi thay đổi
    useEffect(() => {
        // Thiết lập bộ đếm giờ, sau 500ms không có thay đổi mới gọi hàm loadFoods
        let timer = setTimeout(() => {
            if (page > 0) {
                loadFoods();
            }
        }, 500);

        // Clear timeout nếu người dùng gõ ký tự mới trong khoảng 500ms
        return () => clearTimeout(timer);
    }, [searchQuery, activeCategory.id, page]);

    // 5. Hàm gọi API chính (Tương tự code mẫu của bạn)
    const loadFoods = async () => {
        try {
            setLoading(true);

            let url = endpoints['food'](activeCategory.id);

            // Các tham số cũ
            if (searchQuery) {
                url = `${url}&q=${searchQuery}`;
            }
            if (page) {
                url = `${url}&page=${page}`;
            }



            // In ra log để tự kiểm tra xem URL đã nối chuẩn chưa
            console.log("URL gọi API:", url);

            const res = await Apis.get(url);

            if (page === 1) {
                setFoods(res.data.results);
            } else if (page > 1) {
                setFoods(prev => [...prev, ...res.data.results]);
            }

            if (res.data.next === null) {
                setPage(0);
            }

        } catch (ex) {
            console.log("Lỗi tải món ăn:", ex.message);
            if (ex.response && ex.response.status === 404) {
                setPage(0);
            }
        } finally {
            setLoading(false);
        }
    };

    // 6. Hàm kích hoạt khi cuộn đến cuối danh sách
    const loadMore = () => {
        // CHỈ load thêm khi: page đang mở (>0), không bị kẹt loading, VÀ màn hình đã có dữ liệu
        if (page > 0 && !loading && foods.length > 0) {
            setPage(page + 1);
        }
    };

    const getFilteredFoods = () => {
        return foods.filter(item => {
            const price = parseFloat(item.price);
            const time = parseInt(item.time, 10);

            // Dùng appliedFilters thay cho các state rời rạc
            if (appliedFilters.min !== '') {
                if (price < parseFloat(appliedFilters.min)) return false;
            }
            if (appliedFilters.max !== '') {
                if (price > parseFloat(appliedFilters.max)) return false;
            }
            if (appliedFilters.time !== '') {
                if (time > parseInt(appliedFilters.time, 10)) return false;
            }

            return true;
        });
    };

    const applyFilters = () => {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (minPrice && min < 0) { alert("Giá tối thiểu phải >= 0"); return; }
        if (maxPrice && max < 0) { alert("Giá tối đa không hợp lệ"); return; }
        if (minPrice && maxPrice && min > max) { alert("Min không thể lớn hơn Max"); return; }

        // Đẩy dữ liệu nháp vào bản chính thức để FlatList bắt đầu lọc
        setAppliedFilters({ min: minPrice, max: maxPrice, time: maxTime });
        setShowFilter(false);
    };

    const resetFilters = () => {
        // Xóa bản nháp trên giao diện
        setMinPrice('');
        setMaxPrice('');
        setMaxTime('');
        // Xóa bản chính thức để khôi phục danh sách
        setAppliedFilters({ min: '', max: '', time: '' });
    };

    useEffect(() => {
        resetFilters(); // Đảm bảo bộ lọc được reset khi đổi Category
    }, [activeCategory.id]);

    useEffect(() => {
        if (route.params?.categoryFromHome) {
            // 1. Cập nhật danh mục kích hoạt thành danh mục được chọn từ trang Home
            setActiveCategory(route.params.categoryFromHome);

            // 2. Mẹo nâng cao: Xóa tham số này khỏi bộ nhớ của route sau khi đã nhận xong
            // Điều này giúp tránh việc bị kẹt bộ lọc khi người dùng bấm vào icon Tab Menu ở dưới đáy sau này
            nav.setParams({ categoryFromHome: undefined });
        }
    }, [route.params?.categoryFromHome]);


    // --- CÁC HÀM RENDER GIAO DIỆN GIỮ NGUYÊN NHƯ CŨ ---
    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={Style.categoryItem}
            onPress={() => setActiveCategory(item)}
        >
            <Text style={[Style.categoryText, activeCategory.id === item.id && Style.categoryTextActive]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderFoodItem = ({ item }) => (
        <TouchableOpacity
            style={Style.foodCard}
            // Truyền id của món ăn sang màn hình chi tiết (giả sử tên màn hình là 'FoodDetail')
            onPress={() => nav.navigate('dish_detail', { dishId: item.id })}
        >
            <Image
                source={{ uri: item.illustration || 'https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg' }}
                style={Style.foodImage}
            />
            <View style={Style.foodInfo}>
                <Text style={Style.foodName} numberOfLines={1}>{item.dish}</Text>
                {item.description && <Text style={Style.metaText} numberOfLines={1}>{item.description}</Text>}
                <View style={Style.foodMeta}>
                    <Ionicons name="time-outline" size={16} color="#888" />
                    <Text style={Style.metaText}>{item.time} phút</Text>
                </View>
                <Text style={Style.price}>{parseFloat(item.price).toFixed(2)}$</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={Style.container}>
            <View style={Style.topSection}>
                <Text style={Style.headerTitle}>Menu</Text>
                <View style={Style.searchRow}>
                    <TextInput
                        style={Style.searchInput}
                        placeholder="Tìm kiếm món ăn..."
                        value={searchQuery}
                        onChangeText={setSearchQuery} // Cập nhật state liên tục khi gõ
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={Style.filterBtn} onPress={() => setShowFilter(true)}>
                        <Ionicons name="options" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={Style.categoryContainer}>
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={item => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <FlatList
                data={getFilteredFoods()}
                renderItem={renderFoodItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={Style.listContainer}
                showsVerticalScrollIndicator={false}
                // Thêm 3 thuộc tính cực kỳ quan trọng cho Infinite Scroll
                onEndReached={loadMore}
                onEndReachedThreshold={0.1} // Gọi loadMore khi cách đáy màn hình 10%
                ListFooterComponent={loading && <ActivityIndicator size="large" color="#1A5D4A" style={{ marginVertical: 20 }} />}
            />



            <Modal visible={showFilter} transparent={true} animationType="slide">
                {/* 1. Biến Overlay thành nút bấm đóng Modal */}
                <Pressable style={Style.modalOverlay} onPress={() => setShowFilter(false)}>

                    {/* 2. Chặn sự kiện click xuyên qua khi bấm vào phần nội dung màu trắng */}
                    <Pressable
                        style={Style.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Tiêu đề & Nút đóng */}
                        <View style={Style.modalHeader}>
                            <Text style={Style.modalTitle}>Bộ lọc nâng cao</Text>
                            <TouchableOpacity onPress={() => setShowFilter(false)}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {/* ... Toàn bộ giao diện ô nhập Giá, chọn Thời gian, nút Áp dụng giữ nguyên ... */}
                        {/* Mục 1: Lọc theo khoảng giá */}
                        <Text style={Style.filterLabel}>Khoảng giá ($)</Text>
                        <View style={Style.priceRow}>
                            <TextInput
                                style={Style.priceInput}
                                placeholder="Tối thiểu"
                                keyboardType="numeric"
                                value={minPrice}
                                onChangeText={setMinPrice}
                            />
                            <Text style={Style.priceDivider}>-</Text>
                            <TextInput
                                style={Style.priceInput}
                                placeholder="Tối đa"
                                keyboardType="numeric"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                            />
                        </View>

                        {/* Mục 2: Lọc theo thời gian */}
                        <Text style={Style.filterLabel}>Thời gian chuẩn bị</Text>
                        <View style={Style.timeRow}>
                            {['15', '30', '60'].map(time => (
                                <TouchableOpacity
                                    key={time}
                                    style={[Style.timeBtn, maxTime === time && Style.timeBtnActive]}
                                    onPress={() => setMaxTime(maxTime === time ? '' : time)} // Bấm lần 2 để bỏ chọn
                                >
                                    <Text style={[Style.timeBtnText, maxTime === time && Style.timeBtnTextActive]}>
                                        &lt; {time} phút
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Mục 3: Nút hành động */}
                        <View style={Style.actionRow}>
                            <TouchableOpacity style={Style.resetBtn} onPress={resetFilters}>
                                <Text style={Style.resetBtnText}>Làm mới</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={Style.applyBtn} onPress={applyFilters}>
                                <Text style={Style.applyBtnText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>

                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

export default Menu;