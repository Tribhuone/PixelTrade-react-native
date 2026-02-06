
import { View, Image, ActivityIndicator, Text } from "react-native";
import { verticalScale, scale } from 'react-native-size-matters';
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
            <Image
                source={require("../assets/images/landing-logo.png")}
                style={{
                    width: scale(300),
                    height: verticalScale(300),
                    objectFit: "contain",
                }}
            />

            <ActivityIndicator size="large" color="#227922" style={{ marginTop: 20 }} />
        </View>
    );
}
