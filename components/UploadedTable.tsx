import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { Feather } from '@expo/vector-icons';
// import { API_URL } from '../constants/api'; // Needs definition

const UploadedTable = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const authorize = useSelector((state: any) => state.user);
    const token = authorize.token;

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const getUserProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/product/uploaded`, {
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
        getUserProduct();
    }, [token]);

    const handleDelete = async (_id: string) => {
        Alert.alert("Delete", "Are you sure you want to delete this product?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    const originalProducts = [...products];
                    setProducts(products.filter((p) => p._id !== _id));

                    try {
                        const res = await axios.delete(`${API_URL}/api/product/delete/post/${_id}`);
                        Alert.alert("Success", res.data.message);
                    } catch (err) {
                        console.log(err);
                        setProducts(originalProducts); // Revert on failure
                        Alert.alert("Error", "Failed to delete product");
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex-col gap-3">
            <View className="flex-row items-center gap-4">
                <Image
                    source={{ uri: item.path }}
                    className="w-20 h-16 rounded bg-gray-200"
                    resizeMode="cover"
                />
                <Text className="text-gray-800 font-semibold text-lg flex-1" numberOfLines={1}>
                    {item.title}
                </Text>
            </View>

            <View className="flex-row justify-between text-gray-700">
                <Text className="text-gray-600">Price:</Text>
                <Text className="font-medium text-black">₹{item.price.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between text-gray-700">
                <Text className="text-gray-600">Sales:</Text>
                <Text className="font-medium text-black">{item.sales}</Text>
            </View>

            <View className="flex-row gap-3 justify-end mt-2">
                <TouchableOpacity className="p-2 rounded-lg bg-gray-100 border border-gray-200">
                    <Feather name="edit-2" size={20} color="#14532d" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDelete(item._id)}
                    className="p-2 rounded-lg bg-red-500"
                >
                    <Feather name="trash-2" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#fcd34d" />;
    }

    return (
        <View className="flex-1 bg-[#f9f8f4] p-4">
            {products.length === 0 ? (
                <Text className="text-center text-gray-500 mt-10">No products uploaded yet.</Text>
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

export default UploadedTable;
