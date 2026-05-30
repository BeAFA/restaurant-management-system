import { Image, Text, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import Style from "../../../styles/UserStyles";
import { Button, HelperText, TextInput, ActivityIndicator } from "react-native-paper";
import * as ImgPicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';

const UpdateFood = () => {
    const route = useRoute();
    const nav = useNavigation();

    const { foodId } = route.params;

    const [food, setFood] = useState({
        dish: '',
        description: '',
        price: '',
        time: '',
        illustration: null,
    });

    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    // State cho Dropdown
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const foodInfo = [
        { field: 'dish', title: 'Tên', icon: 'text' },
        { field: 'description', title: 'Mô tả', icon: 'text' },
        { field: 'price', title: 'Giá', icon: 'cash' },
        { field: 'time', title: 'Thời gian', icon: 'clock' },
    ];

    // 3. Gom việc gọi dữ liệu vào chung một useEffect
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // Gọi 3 API cùng lúc bằng Promise.all để tăng tốc độ
                const [resCategories, resIngredients, resFoodDetail] = await Promise.all([
                    Apis.get(endpoints['categories']),
                    Apis.get(endpoints['ingredients']),
                    Apis.get(endpoints['food_detail'](foodId))
                ]);

                // Set Data cho Dropdown
                setCategories(resCategories.data.results || resCategories.data);
                setIngredients(resIngredients.data.results || resIngredients.data);

                // Lấy dữ liệu món ăn chi tiết
                const foodData = resFoodDetail.data;

                // 4. Bơm dữ liệu cũ vào các State để hiển thị lên Form
                setFood({
                    dish: foodData.dish || '',
                    description: foodData.description || '',
                    price: foodData.price ? String(foodData.price) : '',
                    time: foodData.time ? String(foodData.time) : '',
                    illustration: foodData.illustration || null,
                });

                setSelectedCategory(foodData.category?.id || "");

                const initialIngredientIds = foodData.food_ingredients
                    ? foodData.food_ingredients.map(item => item.ingredient.id)
                    : [];
                setSelectedIngredients(initialIngredientIds);

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu khởi tạo:", error);
                setErr("Không thể tải dữ liệu món ăn. Vui lòng thử lại!");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [foodId]);

    const picker = async () => {
        let { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Vui lòng cấp quyền truy cập ảnh!");
        } else {
            const result = await ImgPicker.launchImageLibraryAsync({
                mediaTypes: ImgPicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });
            if (!result.canceled)
                setFood({ ...food, 'illustration': result.assets[0] });
        }
    }

    const validate = () => {
        setErr(null);
        if (!food.dish || !food.description || !food.price || !food.time) {
            setErr('Vui lòng nhập đầy đủ thông tin (Tên, Mô tả, Giá, Thời gian)');
            return false;
        }
        if (!selectedCategory) {
            setErr("Vui lòng chọn danh mục");
            return false;
        }
        return true;
    }

    const handleUpdateFood = async () => {
        if (!validate()) return;
        const form = new FormData();

        try {
            setUpdateLoading(true);

            form.append('dish', food.dish);
            form.append('description', food.description);
            form.append('price', food.price);
            form.append('time', food.time);
            form.append('category_id', Number(selectedCategory));

            if (food.illustration && typeof food.illustration !== 'string') {
                form.append('illustration', {
                    uri: food.illustration.uri,
                    name: food.illustration.fileName || 'illustration.jpg',
                    type: food.illustration.mimeType || 'image/jpeg',
                });
            }

            if (selectedIngredients.length > 0) {
                selectedIngredients.forEach(id => {
                    form.append('ingredient_ids', Number(id));
                });
            }

            const token = await SecureStore.getItemAsync('token');

            const res = await authApis(token).patch(`${endpoints['foods']}${foodId}/chef_manage_food/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                Alert.alert('Thành công', 'Cập nhật món ăn thành công!', [
                    { text: 'OK', onPress: () => nav.goBack() }
                ]);
            }

        } catch (ex) {
            console.error("Lỗi cập nhật:", ex.response?.data);
            const errorMsg = ex.response?.data?.error || 'Cập nhật thất bại, vui lòng thử lại!';
            setErr(errorMsg);
        } finally {
            setUpdateLoading(false);
        }
    }

    const handleDeleteFood = () => {
        Alert.alert(
            "Cảnh báo nguy hiểm",
            `Bạn có chắc chắn muốn xóa (ẩn) món "${food.dish}" không?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa món",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setDeleteLoading(true);
                            const token = await SecureStore.getItemAsync('token');

                            // Dùng foodId từ route
                            await authApis(token).delete(`${endpoints['foods']}${foodId}/chef_manage_food/`);

                            Alert.alert('Thành công', 'Đã xóa món ăn!', [
                                { text: 'OK', onPress: () => nav.goBack() }
                            ]);
                        } catch (ex) {
                            console.error("Lỗi xóa:", ex.response?.data);
                            Alert.alert("Lỗi", ex.response?.data?.error || "Không thể xóa món ăn này.");
                        } finally {
                            setDeleteLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const getImageUri = () => {
        if (!food.illustration) return null;
        if (typeof food.illustration === 'string') return food.illustration;
        return food.illustration.uri;
    };

    // Hiện loading spinner khi đang tải dữ liệu API lúc mới vào màn hình
    if (loading) {
        return (
            <View style={[Style.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={{ marginTop: 10 }}>Đang tải dữ liệu món ăn...</Text>
            </View>
        );
    }

    return (
        <View style={[Style.container, { paddingLeft: 0, paddingRight: 0 }]}>
            <View style={Style.headerContainer}>
                <Text style={Style.titleText}>Chỉnh sửa món ăn</Text>
                <Text style={Style.subText}>Cập nhật thông tin cho món {food.dish}</Text>
            </View>

            <HelperText style={Style.errorText} type="error" visible={!!err}>
                {err}
            </HelperText>

            <ScrollView contentContainerStyle={Style.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={Style.formContainer}>
                    {foodInfo.map(f => (
                        <TextInput
                            value={food[f.field]}
                            key={f.field}
                            onChangeText={(t) => setFood({ ...food, [f.field]: t })}
                            style={Style.input}
                            label={f.title}
                            placeholder={`Nhập ${f.title.toLowerCase()}`}
                            mode="outlined"
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#FF6347"
                            right={<TextInput.Icon icon={f.icon} color="#FF6347" />}
                        />
                    ))}

                    <SelectList
                        setSelected={(val) => setSelectedCategory(val)}
                        data={categories.map(c => ({ key: c.id, value: c.name }))}
                        save="key"
                        placeholder="Chọn danh mục"
                        // Cập nhật defaultOption an toàn sau khi API tải xong
                        defaultOption={categories.find(c => c.id === selectedCategory) ? { key: selectedCategory, value: categories.find(c => c.id === selectedCategory).name } : null}
                        boxStyles={{ borderColor: "#E0E0E0", borderRadius: 10, marginTop: 10, minHeight: 55 }}
                        inputStyles={{ color: "#000", fontSize: 16 }}
                        dropdownStyles={{ borderColor: "#E0E0E0" }}
                    />
                    
                    <Text style={{ marginTop: 10 }}>*Chú ý: Nếu không cần chỉnh nguyên liệu nấu thì không cần chọn lại</Text>
                    <MultipleSelectList
                        style={{ marginTop: 10 }}
                        setSelected={(val) => setSelectedIngredients(val)}
                        data={ingredients.map(i => ({ key: i.id, value: i.name }))}
                        save="key"
                        label="Nguyên liệu đã chọn"
                        placeholder="Chọn nguyên liệu"
                        boxStyles={{ borderColor: "#E0E0E0", borderRadius: 10, marginTop: 10, minHeight: 55 }}
                        inputStyles={{ color: "#000", fontSize: 16 }}
                        dropdownStyles={{ borderColor: "#E0E0E0" }}
                        dropdownTextStyles={{ color: "#333" }}
                    />

                    <TouchableOpacity style={Style.avatarPickerBtn} onPress={picker}>
                        <Text style={Style.avatarPickerText}>Thay đổi ảnh minh họa</Text>
                    </TouchableOpacity>

                    {getImageUri() && (
                        <Image source={{ uri: getImageUri() }} style={Style.avatarPreview} />
                    )}

                    <Button
                        loading={updateLoading}
                        disabled={updateLoading || deleteLoading}
                        mode="contained"
                        onPress={handleUpdateFood}
                        style={Style.primaryButton}
                        labelStyle={Style.buttonLabel}
                    >
                        Cập nhật thông tin
                    </Button>

                    <Button
                        loading={deleteLoading}
                        disabled={updateLoading || deleteLoading}
                        mode="outlined"
                        onPress={handleDeleteFood}
                        icon="delete"
                        textColor="#d32f2f"
                        style={[Style.primaryButton, { backgroundColor: 'transparent', borderColor: '#d32f2f', marginTop: 10 }]}
                        labelStyle={[Style.buttonLabel, { color: '#d32f2f' }]}
                    >
                        Xóa món ăn
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default UpdateFood;