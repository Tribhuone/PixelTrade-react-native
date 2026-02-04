
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
    StyleSheet
} from "react-native";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { logoutUser } from "@/store/slices/userSlice";
import axios from "axios";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-toast-message";
import { Animated } from "react-native";


export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { user, token } = useSelector((state: any) => state.user);

    const [viewMode, setViewMode] = useState<"listings" | "purchases">("listings");
    const [listings, setListings] = useState([]);
    const [purchases, setPurchases] = useState([]);

    const [loading, setLoading] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0)).current;

    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadTask, setDownloadTask] = useState(null);


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

                setPurchases(res.data.userProduct || []);
            }
        } catch (error: any) {
            console.log("Axios Error Full:", error);
            // console.log("Axios Error Response:", error?.response);
            // console.log("Axios Error Data:", error?.response?.data);
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
    const handleDownload = async (item) => {
        try {
            setDownloading(true);
            setProgress(0);

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") return;

            const fileUri =
                FileSystem.documentDirectory +
                `${item.title.replace(/\s/g, "_")}-${item._id}.jpg`;

            const resumable = FileSystem.createDownloadResumable(
                item.path,
                fileUri,
                {},
                (dp) => {
                    const percent =
                        dp.totalBytesWritten / dp.totalBytesExpectedToWrite;
                    setProgress(percent);
                }
            );

            setDownloadTask(resumable);

            const { uri } = await resumable.downloadAsync();

            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync("PixelTrade", asset, false);

            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }),

                Animated.delay(200), // 200ms stay

                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();


            Toast.show({
                type: "success",
                text1: "Download complete 🎉",
            });

        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Download cancelled",
            });
        } finally {
            setDownloading(false);
        }
    };

    // cancel donwload function...
    const cancelDownload = async () => {
        if (downloadTask) {
            await downloadTask.pauseAsync();
            setDownloading(false);

            Toast.show({
                type: "info",
                text1: "Download cancelled",
            });
        }
    };


    return (
        <View className="flex-1 bg-white">
            <View className="p-6 bg-gray-100 flex justify-between items-center flex-row">
                <View className="w-20 h-20 bg-[#1d611dff] rounded-full justify-center items-center mb-3">
                    <Text className="text-white text-4xl font-bold">{user?.name.charAt(0).toUpperCase()}</Text>
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

            {/* Settings Overlay ... */}
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

                        {/* <TouchableOpacity
                            onPress={() => {
                                setSettingsOpen(false);
                                router.push("/profile/liked-posts");
                            }}
                            className="py-3"
                        >
                            <Text>Likes</Text>
                        </TouchableOpacity> */}

                        <View className="h-px bg-gray-200 my-2" />

                        <TouchableOpacity onPress={handleLogout} className="py-3">
                            <Text className="text-red-500 font-semibold">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Download Overlay */}
            {downloading && (
                <BlurView intensity={70} style={styles.overlay}>

                    <View style={styles.card}>

                        <Text style={{ color: "#fff", marginBottom: 10 }}>
                            Downloading...
                        </Text>

                        {/* Progress Bar */}
                        <View style={styles.bar}>
                            <View
                                style={[
                                    styles.fill,
                                    { width: `${progress * 100}%` },
                                ]}
                            />
                        </View>

                        <Text style={{ color: "#FFD230", marginVertical: 6 }}>
                            {Math.floor(progress * 100)}%
                        </Text>

                        <Pressable onPress={cancelDownload} style={styles.cancelBtn}>
                            <Text style={{ color: "#fff" }}>Cancel</Text>
                        </Pressable>

                    </View>

                </BlurView>
            )}

            {/* animation execute after download */}
            <Animated.View
                style={[
                    styles.check,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <Text style={{ fontSize: 40 }}>✅</Text>
            </Animated.View>


        </View>
    );
}


const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        width: "80%",
        backgroundColor: "#000000cc",
        padding: 20,
        borderRadius: 14,
        alignItems: "center",
    },

    bar: {
        width: "100%",
        height: 6,
        backgroundColor: "#333",
        borderRadius: 6,
        overflow: "hidden",
    },

    fill: {
        height: "100%",
        backgroundColor: "#FFE45B",
    },

    cancelBtn: {
        marginTop: 10,
        padding: 8,
    },

    check: {
        position: "absolute",
        top: "45%",
        alignSelf: "center",
    },
});

