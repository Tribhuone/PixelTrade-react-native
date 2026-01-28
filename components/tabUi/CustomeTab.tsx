
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import SingleTab from './SingleTab';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const CustomTab = ({ state, descriptors, navigation }) => {

    const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
    const buttonWidth = dimensions.width / 4;

    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        })
    };

    const LEFT_PADDING = 10;
    const RIGHT_PADDING = 12;

    const tabPositionsX = useSharedValue(0);
    const animatStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionsX.value }],
        }
    });

    useEffect(() => {
        const currentRoute = state.routes[state.index];

        const filteredIndex = filteredRoutes.findIndex(
            (r) => r.name === currentRoute.name
        );

        if (filteredIndex < 0) return;

        let offset = buttonWidth * filteredIndex;

        if (state.index === 0) {
            offset += LEFT_PADDING - 10;
        }
        else if (state.index === 1) {
            offset += LEFT_PADDING - 6;
        }
        else if (state.index === 2) {
            offset -= (RIGHT_PADDING - 14);
        }
        else if (state.index === 3) {
            offset -= (RIGHT_PADDING - 16);
        }

        tabPositionsX.value = withSpring(offset, { duration: 300 });

    }, [state.index, buttonWidth]);

    const iconName = ["home", "cloud-upload", "shopping-cart", "profile"];

    let removeElements = ["EachImage/index", "img/[id]", "profile/update", "profile/liked-posts"];

    const filteredRoutes = state.routes.filter(
        (r) => !removeElements.includes(r.name)
    );

    const shouldHideTabBar = removeElements.includes(state.routes[state.index]?.name);
    if (shouldHideTabBar) {
        return null; // Don't render anything
    }

    return (
        <View
            onLayout={onTabBarLayout}
            style={styles.tabView}
        >
            <Animated.View
                style={[animatStyle, {
                    position: "absolute",
                    height: dimensions.height - 0.5,
                    width: buttonWidth - 4,
                    backgroundColor: "#f3fffeff",
                    borderRadius: 25,
                    marginLeft: 0,
                    marginTop: 0,
                }]
                }
            />

            {filteredRoutes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === state.routes.findIndex((r) => r.name === route.name);
                // console.log(label);
                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabButton}
                    >
                        <SingleTab focused={isFocused} label={label} iconName={iconName[index]} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default CustomTab;

const styles = StyleSheet.create({
    tabView: {
        flexDirection: "row",
        position: "absolute",
        bottom: 20,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 10,
    },
    tabButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },
});