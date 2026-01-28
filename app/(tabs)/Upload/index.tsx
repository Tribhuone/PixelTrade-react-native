
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, updateImageFile, resetAllValues, addKeywords, removeKeywords } from "@/store/slices/formSlice";
import axios from 'axios';
import { BASE_URL } from '@/constants/api';
import Entypo from '@expo/vector-icons/Entypo';

export default function UploadScreen() {
    const dispatch = useDispatch();
    const form = useSelector((state: any) => state.form);
    const { token } = useSelector((state: any) => state.user);

    // Local state for tags input string
    // const [tagsInput, setTagsInput] = useState(form.keywords.join(", "));

    const [keywordText, setKeywordText] = useState("");

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            // Store the asset uri and info in redux
            dispatch(updateImageFile({
                image: {
                    uri: asset.uri,
                    type: asset.mimeType || 'image/jpeg',
                    name: asset.fileName || 'upload.jpg',
                },
                imgPreview: asset.uri
            }));
        }
    };

    const handleAddKeyword = () => {
        const value = keywordText.trim();
        if (!value) return;

        dispatch(addKeywords(value));
        setKeywordText("");
    };

    const handleRemoveKeyword = (index: number) => {
        dispatch(removeKeywords(index));
    };

    const handleChange = (name: string, value: string) => {
        dispatch(updateField({ name, value }));
    }

    const handleSubmit = async () => {
        if (!token) {
            Alert.alert("Permission Denied", "You must be logged in to upload.");
            return;
        }
        if (!form.title || !form.description || !form.price || !form.imgFile) {
            Alert.alert("Error", "Please fill all fields and select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("price", form.price);

        // Process tags
        // const keywords = tagsInput.split(",").map(k => k.trim());
        // keywords.forEach(key => formData.append("keywords[]", key));

        form.keywords.forEach(key => {
            formData.append("keywords[]", key);
        });

        // Append Image
        // @ts-ignore
        formData.append("image", {
            uri: form.imgFile.uri,
            name: form.imgFile.name,
            type: form.imgFile.type,
        });

        try {
            const res = await axios.post(`${process.env.EXPO_PUBLIC_PRODUCT_API_URL}/api/product/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });

            Alert.alert("Success", "Product uploaded successfully!");
            dispatch(resetAllValues());
            // setTagsInput("Nature");
        } catch (err: any) {
            console.log("Upload error:", err);
            Alert.alert("Error", err.response?.data?.message || "Upload failed");
        }
    }

    return (
        <ScrollView
            className="flex-1 bg-white p-4"
            contentContainerStyle={{ paddingBottom: 80 }}
        >
            <Text className="text-2xl font-bold mb-6 text-center">Upload Image</Text>

            <View className="mb-4">
                <Text className="mb-1 font-medium">Title</Text>
                <TextInput
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Image Title"
                    value={form.title}
                    onChangeText={(text) => handleChange("title", text)}
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-medium">Description</Text>
                <TextInput
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Description and details"
                    multiline
                    numberOfLines={4}
                    maxLength={300}
                    textAlignVertical="top"
                    value={form.description}
                    onChangeText={(text) => handleChange("description", text)}
                />
            </View>

            <View className="mb-4">
                <Text className="mb-1 font-medium">Price (₹)</Text>
                <TextInput
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Price"
                    keyboardType="numeric"
                    value={form.price}
                    onChangeText={(text) => handleChange("price", text)}
                />
            </View>

            {/* <View className="mb-4">
                <Text className="mb-1 font-medium">Tags (comma separated)</Text>
                <TextInput
                    className="border border-gray-300 p-3 rounded-lg bg-gray-50"
                    placeholder="Nature, Abstract, etc."
                    value={tagsInput}
                    onChangeText={setTagsInput}
                />
            </View> */}

            <View className="mb-4">
                <Text className="mb-1 font-medium">Tags</Text>

                {/* Input + Add */}
                <View className="flex-row gap-2">
                    <TextInput
                        className="flex-1 border border-gray-300 p-3 rounded-lg bg-gray-50"
                        placeholder="Add keyword"
                        value={keywordText}
                        onChangeText={setKeywordText}
                    />
                    <Pressable
                        onPress={handleAddKeyword}
                        className="px-4 justify-center bg-green-700 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Add</Text>
                    </Pressable>
                </View>

                {/* Selected keywords */}
                <View className="flex-row flex-wrap gap-2 mb-2">
                    {form.keywords.map((word: string, index: number) => (
                        <View
                            key={index}
                            className="flex-row items-center bg-gray-200 px-2 py-1 rounded-lg"
                        >
                            <Pressable onPress={() => handleRemoveKeyword(index)}>
                                <Entypo name="cross" size={14} color="red" />
                            </Pressable>
                            <Text className="ml-1 text-sm">{word}</Text>
                        </View>
                    ))}
                </View>
            </View>


            <View className="mb-6 items-center">
                <Pressable
                    onPress={pickImage}
                    className="bg-gray-200 px-6 py-3 rounded-lg mb-4 w-full flex-row justify-center items-center"
                >
                    <Text className="font-medium">
                        <Entypo name="camera" size={16} color="black" />
                        &nbsp;&nbsp;
                        Select Image
                    </Text>
                </Pressable>

                {form.imgPreview ? (
                    <Image
                        source={{ uri: form.imgPreview }}
                        className="w-full h-60 rounded-lg object-contain bg-gray-100"
                    />
                ) : (
                    <View className="w-full h-60 rounded-lg bg-gray-100 justify-center items-center border border-dashed border-gray-400">
                        <Text className="text-gray-400">No Image Selected</Text>
                    </View>
                )}
            </View>

            <Pressable
                onPress={handleSubmit}
                className="py-4 rounded-lg mb-10 bg-[#207B20] mb-100"
            >
                <Text className="text-white text-center font-bold text-lg">Upload Product</Text>
            </Pressable>
        </ScrollView>
    );
}
