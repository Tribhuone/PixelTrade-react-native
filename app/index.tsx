
import { View, Image, ActivityIndicator, Text } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

export default function Splash() {
    const router = useRouter();

    const { token } = useSelector((state: any) => state.user);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (token) {
                router.replace("/(tabs)/Home");
            } else {
                router.replace("/auth/login");
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [token]);

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff"
        }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#227922", marginBottom: 5 }}>
                Pixel Trade
            </Text>
            <Image
                source={require("../assets/images/favicon.png")}
                style={{ width: 120, height: 120 }}
            />

            <ActivityIndicator size="large" color="#227922" style={{ marginTop: 20 }} />
        </View>
    );
}
