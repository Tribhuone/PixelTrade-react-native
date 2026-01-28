
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

const SingleTab = ({ focused, label, iconName }) => {

    const animStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: withTiming(focused ? -6 : 0, { duration: 300 }) },
            ],
            opacity: withTiming(focused ? 1 : 0.6, { duration: 300 }),
        };
    }, [focused]);

    const icons = iconName.toLowerCase();

    return (

        <Animated.View
            // className={justify-center items-center}
            style={[
                {
                    // flexDirection: "row",
                    height: "100%",
                    paddingHorizontal: focused ? 1 : 0,
                    borderRadius: 25,
                    // backgroundColor: focused ? "#9fc9ff86" : "transparent",
                    width: "100%",
                    // borderWidth: 1,
                    // borderColor:"black",
                    justifyContent: "center",
                    alignItems: "center",
                    position: focused ? "relative" : "static",
                    bottom: -4,
                },
                animStyle,
            ]}
        >
            {
                // <Icons name={iconName} color={ focused ? "#24599e" : "#7d7d7d"} size={focused ? 20 : 22} />
                <AntDesign name={icons} color={focused ? "#3E8D3E" : "#7d7d7d"} size={focused ? 20 : 22} />
            }
            {focused ? <Text
                // className="text-xs color-[#24599e] font-bold" 
                style={{ color: "#3E8D3E", fontSize: 14, fontWeight: "bold" }}
            >{label}</Text> : ""}
        </Animated.View>
    )
}

export default SingleTab;