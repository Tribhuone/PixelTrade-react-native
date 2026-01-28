import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// import { API_URL } from '../constants/api';

const PurchasedTable = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const authorize = useSelector((state: any) => state.user);
    const token = authorize.token;

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const getPurchasedItems = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/order/purchased`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setProducts(res.data.userProduct);
            } catch (er) {
                console.log(er);
            } finally {
                setLoading(false);
            }
        }
        getPurchasedItems();
    }, [token]);

    const handleDownload = async (item: any) => {
        // Basic download implementation
        // For actual secure file downloads, authentication headers might need to be passed differently 
        // depending on how the backend serves files (signed URLs vs direct auth).
        try {
            const fileName = `${item.title || "image"}-${item._id}.jpg`;
            const fileUri = FileSystem.documentDirectory + fileName;

            const downloadRes = await FileSystem.downloadAsync(
                item.path, // Ensure this is a full URL
                fileUri,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (downloadRes.status === 200) {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(downloadRes.uri);
                } else {
                    Alert.alert("Success", "File downloaded to: " + downloadRes.uri);
                }
            } else {
                Alert.alert("Error", "Failed to download file.");
            }
        } catch (error) {
            console.error("Download failed:", error);
            Alert.alert("Error", "Download failed");
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex-col gap-3">
            <View className="flex-row items-center gap-4">
                <Image
                    source={{ uri: item.path }}
                    className="w-16 h-16 rounded bg-gray-200"
                    resizeMode="cover"
                />
                <View className="flex-1">
                    <Text className="text-gray-800 font-semibold text-lg" numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">{item.userName}</Text>
                </View>
            </View>

            <View className="flex-row justify-between text-gray-700">
                <Text className="text-gray-600">Price:</Text>
                <Text className="font-medium text-black">₹{item.price}</Text>
            </View>

            <TouchableOpacity
                onPress={() => handleDownload(item)}
                className="bg-green-700 rounded-lg py-2 flex-row justify-center items-center mt-2 active:bg-green-800"
            >
                <Feather name="download" size={18} color="white" />
                <Text className="text-white ml-2 font-medium">Download</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#fcd34d" />; // Amber-300 hex approx
    }

    return (
        <View className="flex-1 p-4">
            {products.length === 0 ? (
                <Text className="text-center text-gray-500 mt-10">No purchased items found.</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

export default PurchasedTable;
