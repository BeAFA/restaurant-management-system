import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';;
import Apis, { endpoints } from "../../configs/Apis";
import { Chip } from "react-native-paper";
import MainStyles from "../../styles/MainStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header";
import SimpleFood from "../../components/SimpleFood";
import { SelectList } from 'react-native-dropdown-select-list'
import UserContext from "../../contexts/UserContext";

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const route = useRoute(); // Thêm dòng này để đọc tham số truyền vào
    const [activeCategory, setActiveCategory] = useState({ id: '', name: 'All' });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1); // Thêm State quản lý trang
    const [showFilter, setShowFilter] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [chefs, setChefs] = useState([]);
    const { user } = useContext(UserContext);

    // State cho Bộ lọc
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxTime, setMaxTime] = useState(''); // Ví dụ: '15', '30'
    const [minRating, setMinRating] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({ min: '', max: '', time: '', rating: '' });
    const [chefSelected, setChefSelected] = React.useState("");//Chọn đầu bếp

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
        setHasMore(true);
        setFoods([]);
    }, [searchQuery, activeCategory.id, chefSelected]);

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
    }, [searchQuery, activeCategory.id, page, chefSelected]);

    const loadFoods = async () => {
        try {
            setLoading(true);

            let url = '';

            if (activeCategory.id) {
                url = endpoints['category_foods'](activeCategory.id);
            } else {
                url = endpoints['foods'];
            }



            console.log("URL gọi API:", url);

            const res = await Apis.get(url, {
                params: {
                    page: page,
                    q: searchQuery,
                    chef_id: chefSelected,
                }
            });

            const foodData = Array.isArray(res.data.results)
                ? res.data.results
                : Array.isArray(res.data)
                    ? res.data
                    : [];

            if (page === 1) {
                setFoods(foodData);
            } else if (page > 1) {
                setFoods(prev => {
                    const newFoods = [...prev, ...foodData];

                    const uniqueFoods = newFoods.filter(
                        (item, index, self) =>
                            index === self.findIndex(f => f.id === item.id)
                    );

                    return uniqueFoods;
                });
            }

            if (Array.isArray(res.data)) {
                setHasMore(false);
            } else if (res.data.next === null) {
                setHasMore(false);
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
        if (hasMore && !loading && foods.length > 0) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        const loadChefs = async () => {
            try {
                const res = await Apis.get(endpoints['chef_list']);

                const chefOptions = [
                    { key: '', value: 'Tất cả đầu bếp' },
                    ...res.data.map(item => ({
                        key: item.id.toString(),
                        value: item.name
                    }))
                ];

                setChefs(chefOptions);

            } catch (ex) {
                console.log("Lỗi load chefs:", ex);
            }
        };

        loadChefs();
    }, []);

    const getFilteredFoods = () => {
        return foods.filter(item => {
            const price = parseFloat(item.price);
            const time = parseInt(item.time, 10);
            const rating = Number(item.avg_rating ?? 0);


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
            if (appliedFilters.rating !== '') {
                if (rating < parseFloat(appliedFilters.rating)) return false;
            }

            return true;
        });
    };


    const applyFilters = () => {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        const rating = parseFloat(minRating);

        if (minPrice && min < 0) { alert("Giá tối thiểu phải >= 0"); return; }
        if (maxPrice && max < 0) { alert("Giá tối đa không hợp lệ"); return; }
        if (minPrice && maxPrice && min > max) { alert("Min không thể lớn hơn Max"); return; }

        // Đẩy dữ liệu nháp vào bản chính thức để FlatList bắt đầu lọc
        setAppliedFilters({ min: minPrice, max: maxPrice, time: maxTime, rating: minRating });
        setShowFilter(false);
    };

    const resetFilters = () => {
        // Xóa bản nháp trên giao diện
        setMinPrice('');
        setMaxPrice('');
        setMaxTime('');
        setMinRating('');
        setChefSelected('');
        // Xóa bản chính thức để khôi phục danh sách
        setAppliedFilters({ min: '', max: '', time: '', rating: '' });
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
            style={MainStyles.categoryItem}
            onPress={() => setActiveCategory(item)}
        >
            <Text style={[MainStyles.categoryText, activeCategory.id === item.id && MainStyles.categoryTextActive]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const handleEditFood = (food) => {
        if (!user?.is_approved) {
            Alert.alert("Cảnh báo", "Bạn chưa được phê duyệt làm đầu bếp. Không thể chỉnh sửa món ăn. Vui lòng liên hệ quản trị viên.");
            return;
        }
        nav.navigate('chef_foods_manage', { screen: 'update_food', initial: false, params: { foodId: food.id } })
    };

    const renderFoodItem = ({ item }) => {



        if (user?.user_role === 'CHEF') {
            return (
                <View>
                    <SimpleFood
                        item={item}
                        next={() => handleEditFood(item)}
                    />
                </View>
            );
        }
        return (
            <View>
                <SimpleFood
                    item={item}
                    next={() => nav.navigate('menu', {
                        screen: 'food_detail',
                        initial: false,
                        params: { foodId: item.id }
                    })}
                />
            </View>
        );


    }

    return (
        <View style={MainStyles.container}>
            <View style={MainStyles.topSection}>
                <Text style={MainStyles.headerTitle}>Menu</Text>
                <View style={MainStyles.searchRow}>
                    <TextInput
                        style={MainStyles.searchInput}
                        placeholder="Tìm kiếm món ăn..."
                        value={searchQuery}
                        onChangeText={setSearchQuery} // Cập nhật state liên tục khi gõ
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={MainStyles.filterBtn} onPress={() => setShowFilter(true)}>
                        <Ionicons name="options" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={MainStyles.categoryContainer}>
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <FlatList
                data={getFilteredFoods()}
                renderItem={renderFoodItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={MainStyles.listContainer}
                showsVerticalScrollIndicator={false}
                // Thêm 3 thuộc tính cực kỳ quan trọng cho Infinite Scroll
                onEndReached={loadMore}
                onEndReachedThreshold={0.1} // Gọi loadMore khi cách đáy màn hình 10%
                ListFooterComponent={loading && <ActivityIndicator size="large" color="#1A5D4A" style={{ marginVertical: 20 }} />}
            />



            <Modal visible={showFilter} transparent={true} animationType="slide">
                {/* 1. Biến Overlay thành nút bấm đóng Modal */}
                <Pressable style={MainStyles.modalOverlay} onPress={() => setShowFilter(false)}>

                    {/* 2. Chặn sự kiện click xuyên qua khi bấm vào phần nội dung màu trắng */}
                    <Pressable
                        style={MainStyles.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Tiêu đề & Nút đóng */}
                        <View style={MainStyles.modalHeader}>
                            <Text style={MainStyles.modalTitle}>Bộ lọc nâng cao</Text>
                            <TouchableOpacity onPress={() => setShowFilter(false)}>
                                <Ionicons name="close" size={28} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {/* ... Toàn bộ giao diện ô nhập Giá, chọn Thời gian, nút Áp dụng giữ nguyên ... */}
                        {/* Mục 1: Lọc theo khoảng giá */}
                        <Text style={MainStyles.filterLabel}>Khoảng giá ($)</Text>
                        <View style={MainStyles.priceRow}>
                            <TextInput
                                style={MainStyles.priceInput}
                                placeholder="Tối thiểu"
                                keyboardType="numeric"
                                value={minPrice}
                                onChangeText={setMinPrice}
                            />
                            <Text style={MainStyles.priceDivider}>-</Text>
                            <TextInput
                                style={MainStyles.priceInput}
                                placeholder="Tối đa"
                                keyboardType="numeric"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                            />
                        </View>

                        {/* Mục 2: Lọc theo thời gian */}
                        <Text style={MainStyles.filterLabel}>Thời gian chuẩn bị</Text>
                        <View style={MainStyles.timeRow}>
                            {['15', '30', '60'].map(time => (
                                <TouchableOpacity
                                    key={time}
                                    style={[MainStyles.timeBtn, maxTime === time && MainStyles.timeBtnActive]}
                                    onPress={() => setMaxTime(maxTime === time ? '' : time)}
                                >
                                    <Text style={[MainStyles.timeBtnText, maxTime === time && MainStyles.timeBtnTextActive]}>
                                        &lt; {time} phút
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={MainStyles.filterLabel}>Đánh giá</Text>
                        <View style={MainStyles.timeRow}>
                            {['1', '2', '3', '4', '5'].map(rating => (
                                <TouchableOpacity
                                    key={rating}
                                    style={[MainStyles.timeBtn, minRating === rating && MainStyles.timeBtnActive]}
                                    onPress={() => setMinRating(minRating === rating ? '' : rating)}
                                >
                                    <Text style={[MainStyles.timeBtnText, minRating === rating && MainStyles.timeBtnTextActive]}>
                                        &ge; {rating} ⭐
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={MainStyles.filterLabel}>Đầu bếp</Text>

                        <SelectList
                            setSelected={(val) => setChefSelected(val)}
                            data={chefs}
                            save="key"
                            placeholder="Chọn đầu bếp"
                            search={false}
                        />

                        {/* Mục 3: Nút hành động */}
                        <View style={MainStyles.actionRow}>
                            <TouchableOpacity style={MainStyles.resetBtn} onPress={resetFilters}>
                                <Text style={MainStyles.resetBtnText}>Làm mới</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={MainStyles.applyBtn} onPress={applyFilters}>
                                <Text style={MainStyles.applyBtnText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>

                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

export default Menu;