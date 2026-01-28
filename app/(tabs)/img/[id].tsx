
import React, { useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { updateCart } from "@/store/slices/cartSlice";

const EachImage = () => {
    const [item, setItem] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const route = useRoute();
    const { id } = route.params;
    const navigation = useNavigation();

    useEffect(() => {
        const getSingleImgData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.EXPO_PUBLIC_PRODUCT_API_URL}/api/product/img/${id}`
                );
                setItem(res.data);
                setKeyword(res.data.keywords?.[0] || "");
            } catch (err) {
                Alert.alert("Error", err.message);
            } finally {
                setLoading(false);
            }
        };

        getSingleImgData();
    }, [id]);

    const addToCart = () => {
        const alreadyExists = cartItems.cart.some(
            (cartItem) => cartItem._id === item._id
        );

        if (alreadyExists) {
            Alert.alert("Info", "This item is already in your cart!");
        } else {
            dispatch(updateCart(item));
            Alert.alert("Success", "Picture added to cart");
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View className="w-full my-2 flex justify-between items-center flex-row " >
                <TouchableOpacity className="w-1/6" onPress={() => navigation.goBack()} >
                    <Ionicons name="caret-back-outline" size={28} color="black" />
                </TouchableOpacity>
            </View>

            {/* Image */}

            <View className="w-full my-2 flex justify-between items-center flex-col ">
                <View style={styles.imageBox} className="mb-1" >
                    <Image
                        source={{ uri: item.path }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
                <View className="flex flex-row justify-between items-center w-full" >
                    <View>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.username}>{item.userName}</Text>
                    </View>
                    <Pressable onPress={() => setLiked(!liked)}>
                        <Ionicons
                            name={liked ? "heart" : "heart-outline"}
                            size={28}
                            color={liked ? "red" : "black"}
                        />
                    </Pressable>

                </View>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>

                <Text style={styles.description}>{item.description}</Text>

                {/* Price + Cart */}
                <View style={styles.row}>
                    <Text style={styles.price}>₹ {item.price}</Text>

                    <Pressable style={styles.cartBtn} onPress={addToCart}>
                        <Text style={styles.cartText}>Add to Cart</Text>
                    </Pressable>
                </View>

                {/* Keywords */}
                <View style={styles.keywordBox}>
                    {keyword.split(",").map((word, index) => (
                        <Text key={index} style={styles.keyword}>
                            {word}
                        </Text>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default EachImage;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageBox: {
        width: "100%",
        height: 250,
        backgroundColor: "#e5e5e5",
        borderRadius: 16,
        padding: 8,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
    infoBox: {
        width: "100%",
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#207B20",
    },
    username: {
        fontSize: 16,
        marginVertical: 4,
    },
    description: {
        color: "#207B20",
        fontSize: 16,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12,
    },
    price: {
        fontSize: 22,
        color: "#207B20",
        fontWeight: "600",
    },
    cartBtn: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    cartText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#207B20",
    },
    keywordBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    keyword: {
        backgroundColor: "#e5e5e5",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        fontSize: 12,
        color: "#207B20",
    },
});

