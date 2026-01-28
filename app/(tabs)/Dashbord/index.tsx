import { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { logoutUser } from "@/store/slices/userSlice";
import axios from "axios";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as FileSystem from "expo-file-system";


export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: any) => state.user);

    const [viewMode, setViewMode] = useState<"listings" | "purchases">("listings");

    const [listings, setListings] = useState([]);
    const [purchases, setPurchases] = useState([]);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            router.replace("/auth/login");
        } else {
            fetchData();
        }
    }, [viewMode, token]);

    const fetchData = async () => {
        setLoading(true);

        try {
            if (viewMode === "listings") {
                const res = await axios.get(
                    `${process.env.EXPO_PUBLIC_PRODUCT_API_URL}/api/product/uploaded`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setListings(res.data.userProduct || []);
            }

            if (viewMode === "purchases") {
                const res = await axios.get(
                    `${process.env.EXPO_PUBLIC_ORDER_API_URL}/api/order/purchased`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setPurchases(res.data.orders || []);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const renderData = viewMode === "listings" ? listings : purchases;

    // product delete function...
    const handleDelete = async (_id: string) => {
        setListings(listings.filter((p: any) => p._id !== _id));

        await axios
            .delete(
                `${process.env.EXPO_PUBLIC_PRODUCT_API_URL}/api/product/delete/post/${_id}`
            )
            .then(() => {
                Alert.alert("Delete successful");
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Delete failed");
            });
    };

    // logout function...
    const handleLogout = () => {
        dispatch(logoutUser());
        router.replace("/auth/login");
    };

    // download function...
    const handleDownload = async (item: any) => {
        try {
            const fileUri =
                FileSystem.documentDirectory +
                `${item.title || "image"}-${item._id}.jpg`;

            const { uri } = await FileSystem.downloadAsync(item.path, fileUri, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert("Downloaded", "File saved successfully");
            console.log("Saved at:", uri);
        } catch (err) {
            console.log(err);
            Alert.alert("Download failed");
        }
    };


    return (
        <View className="flex-1 bg-white">
            <View className="p-6 bg-gray-100 flex justify-between items-center flex-row">
                <View className="w-20 h-20 bg-[#1d611dff] rounded-full justify-center items-center mb-3">
                    <Text className="text-white text-4xl font-bold">U</Text>
                </View>

                <View className="flex flex-row justify-between items-start h-full w-[70%] -mt-1">
                    <View className="flex flex-col justify-between items-center px-2">
                        <Text className="text-xl font-bold">{user?.name}</Text>
                        <Text className="text-gray-600">{user?.email}</Text>
                    </View>

                    <TouchableOpacity onPress={() => setSettingsOpen(true)}>
                        <Feather name="settings" size={17} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row border-b border-gray-200">
                <Pressable
                    onPress={() => setViewMode("listings")}
                    className={`flex-1 p-4 items-center ${viewMode === "listings" ? "border-b-2 border-[#227922]" : ""
                        }`}
                >
                    <Text
                        className={`font-semibold ${viewMode === "listings" ? "text-[#227922]" : "text-gray-500"
                            }`}
                    >
                        My Listings
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setViewMode("purchases")}
                    className={`flex-1 p-4 items-center ${viewMode === "purchases" ? "border-b-2 border-[#227922]" : ""
                        }`}
                >
                    <Text
                        className={`font-semibold ${viewMode === "purchases" ? "text-[#227922]" : "text-gray-500"
                            }`}
                    >
                        My Purchases
                    </Text>
                </Pressable>
            </View>

            <ScrollView className="flex-1 p-4">
                {loading ? (
                    <ActivityIndicator size="large" color="#227922" />
                ) : (
                    <>
                        {renderData.length === 0 ? (
                            <Text className="text-center text-gray-500 mt-10">
                                No {viewMode} found.
                            </Text>
                        ) : (
                            renderData.map((item: any, index) => (
                                <View key={index} className="mb-4">
                                    <View className="flex flex-row justify-between items-center bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-3 mb-3 mx-2">
                                        <Image
                                            source={{ uri: item.path }}
                                            className="w-14 h-14 rounded-lg bg-gray-200"
                                        />

                                        <View className="flex-1 ml-3">
                                            <Text className="text-base font-semibold">
                                                {item.title || item._id}
                                            </Text>

                                            <Text className="text-sm font-bold mt-1">
                                                {item.price
                                                    ? `₹${item.price}`
                                                    : `Total: ₹${item.totalAmount}`}
                                            </Text>
                                        </View>

                                        {viewMode === "listings" && (
                                            <Pressable
                                                onPress={() => handleDelete(item._id)}
                                                className="bg-red-500 px-3 py-2 rounded-lg"
                                            >
                                                <Feather name="trash-2" size={16} color="white" />
                                            </Pressable>
                                        )}
                                        {viewMode === "purchases" && (
                                            <Pressable
                                                onPress={() => handleDownload(item)}
                                                className="bg-green-700 px-3 py-2 rounded-lg"
                                            >
                                                <Feather name="download" size={16} color="white" />
                                            </Pressable>
                                        )}

                                    </View>
                                </View>
                            ))
                        )}
                    </>
                )}
            </ScrollView>

            <Modal animationType="slide" transparent visible={settingsOpen}>
                <View className="flex-1 justify-end">
                    <Pressable
                        className="absolute inset-0 bg-black/40"
                        onPress={() => setSettingsOpen(false)}
                    />

                    <View className="bg-white p-6 rounded-t-2xl">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-lg font-bold">Settings</Text>
                            <TouchableOpacity onPress={() => setSettingsOpen(false)}>
                                <AntDesign name="close-circle" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setSettingsOpen(false);
                                router.push("/profile/update");
                            }}
                            className="py-3"
                        >
                            <Text>Update Profile</Text>
                        </TouchableOpacity>

                        <View className="h-px bg-gray-200 my-2" />

                        <TouchableOpacity
                            onPress={() => {
                                setSettingsOpen(false);
                                router.push("/profile/liked-posts");
                            }}
                            className="py-3"
                        >
                            <Text>Likes</Text>
                        </TouchableOpacity>

                        <View className="h-px bg-gray-200 my-2" />

                        <TouchableOpacity onPress={handleLogout} className="py-3">
                            <Text className="text-red-500 font-semibold">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
