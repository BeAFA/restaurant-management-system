import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Style from "../../User/Style";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImgPicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import React, { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list'
import UserContext from "../../../contexts/UserContext";


const CreateFood = () => {

    const foodInfo = [{
        field: 'dish',
        title: 'Tên',
        icon: 'text',
    }, {
        field: 'description',
        title: 'Mô tả',
        icon: 'text',
    }, {
        field: 'price',
        title: 'Giá',
        icon: 'text',
    }, {
        field: 'time',
        title: 'Thời gian',
        icon: 'clock',
    }];

    const { user } = useContext(UserContext);
    const [food, setFood] = useState({});
    const [err, setErr] = useState(null);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState("");

    const picker = async () => {
        let { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImgPicker.launchImageLibraryAsync();
            if (!result.canceled)
                setFood({ ...food, 'illustration': result.assets[0] })
        }
    }

    const validate = () => {
        setErr(null);
        if (!food.dish) {
            setErr('Vui lòng nhập tên món');
            return false;
        }
        if (!food.description) {
            setErr('Vui lòng nhập mô tả');
            return false;
        }
        if (!food.price) {
            setErr('Vui lòng nhập giá');
            return false;
        }
        if (!food.time) {
            setErr('Vui lòng nhập thời gian');
            return false;
        }
        if (!selectedCategory) {
            setErr("Vui lòng chọn danh mục");
            return false;
        }

        if (selectedIngredients.length === 0) {
            setErr("Vui lòng chọn nguyên liệu");
            return false;
        }
        return true;
    }

    const register = async () => {
        if (!validate()) return;

        const form = new FormData();

        try {
            setLoading(true);

            for (const key of Object.keys(food)) {

                if (key === 'illustration') {
                    form.append('illustration', {
                        uri: food.illustration.uri,
                        name: food.illustration.fileName || 'illustration.jpg',
                        type: food.illustration.mimeType || 'image/jpeg',
                    });
                } else {
                    form.append(key, food[key]);
                }
            }

            const ingredientIds = selectedIngredients.map(id => Number(id));

            form.append('category_id', Number(selectedCategory));

            ingredientIds.forEach(id => {
                form.append('ingredient_ids', id);
            });

            const token = await SecureStore.getItemAsync('token');
            const res = await authApis(token).post(endpoints['food_create'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                alert('Tạo món ăn thành công!');
                // nav.navigate('chef_home');
            }

        } catch (ex) {
            const data = ex.response?.data;
            if (data) {
                const firstError = Object.values(data)[0];
                setErr(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                setErr('Tạo món ăn thất bại, vui lòng thử lại!');
            }
            console.error(ex.response?.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCategories = await Apis.get(endpoints['categories']);
                const resIngredients = await Apis.get(endpoints['ingredients']);

                // Lấy dữ liệu an toàn: Nếu có res.data.results thì dùng, không thì lấy res.data
                const categoryData = resCategories.data.results || resCategories.data;
                const ingredientData = resIngredients.data.results || resIngredients.data;

                setCategories(categoryData);
                setIngredients(ingredientData);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục", error);
            }
        };
        fetchData();
    }, []);


    return (
        <View style={[Style.container, { paddingLeft: 0, paddingRight: 0 }]}>
            {/* Dùng ScrollView để chống tràn màn hình khi mở bàn phím */}
            <View style={Style.headerContainer}>
                <Text style={Style.titleText}>Tạo món ăn mới</Text>
                <Text style={Style.subText}>Nhập thông tin món ăn để tạo mới</Text>
            </View>

            <HelperText style={Style.errorText} type="error" visible={!!err}>
                {err}
            </HelperText>
            <ScrollView contentContainerStyle={Style.scrollContent}>



                <View style={Style.formContainer}>
                    {foodInfo.map(f => (
                        <TextInput
                            value={food[f.field]}
                            key={f.field}
                            onChangeText={(t) => setFood({ ...food, [f.field]: t })}
                            style={Style.input}
                            label={f.title}
                            placeholder={`Nhập ${f.title.toLowerCase()}`}
                            secureTextEntry={f.secureTextEntry}
                            mode="outlined" // Kiểu viền bao quanh
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#FF6347" // Màu viền cam khi gõ
                            right={<TextInput.Icon icon={f.icon} color="#FF6347" />}
                        />
                    ))}

                    <SelectList
                        setSelected={(val) => setSelectedCategory(val)}
                        data={categories.map(c => ({ key: c.id, value: c.name }))}
                        save="key"

                        boxStyles={{
                            borderColor: "#E0E0E0",
                            borderRadius: 10,
                            marginTop: 10,
                            paddingHorizontal: 10,
                            minHeight: 55,
                        }}

                        inputStyles={{
                            color: "#000",
                            fontSize: 16,
                        }}

                        dropdownStyles={{
                            borderColor: "#E0E0E0",
                        }}
                    />

                    <MultipleSelectList style={{ marginTop: 10 }}
                        setSelected={(val) => setSelectedIngredients(val)}
                        data={ingredients.map(i => ({ key: i.id, value: i.name }))}
                        save="key"
                        onSelect={() => alert(selectedIngredients)}
                        label="Ingredients"

                        boxStyles={{
                            borderColor: "#E0E0E0",
                            borderRadius: 10,
                            marginTop: 10,
                            paddingHorizontal: 10,
                            minHeight: 55,
                        }}

                        inputStyles={{
                            color: "#000",
                            fontSize: 16,
                        }}

                        dropdownStyles={{
                            borderColor: "#E0E0E0",
                        }}

                        dropdownTextStyles={{
                            color: "#333",
                        }}
                    />

                    {/* Khu vực chọn ảnh đại diện được thiết kế lại */}
                    <TouchableOpacity style={Style.avatarPickerBtn} onPress={picker}>
                        {/* Dùng icon camera của react-native-paper nếu bạn muốn, ở đây dùng text cho đơn giản */}
                        <Text style={Style.avatarPickerText}>Chọn ảnh minh họa</Text>
                    </TouchableOpacity>

                    {food.illustration && (
                        <Image source={{ uri: food.illustration.uri }} style={Style.avatarPreview} />
                    )}

                    <Button
                        loading={loading}
                        disabled={loading}
                        mode="contained"
                        onPress={register}
                        style={Style.primaryButton}
                        labelStyle={Style.buttonLabel}
                    >
                        Tạo món ăn
                    </Button>
                </View>
            </ScrollView>
        </View>

    );
}

export default CreateFood;