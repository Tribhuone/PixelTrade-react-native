import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from "expo-router";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { BASE_URL } from '@/constants/api';
import { updateUser } from '../../store/slices/userSlice';

const UpdateProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state: any) => state.user);

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    const handleUpdate = async () => {
        if (!name || !email || !phone) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            // Assuming the endpoint is /api/user/update or similar
            // Adjust the endpoint as per your actual backend API
            const res = await axios.patch(
                `${BASE_URL}/api/user/update`,
                {
                    name,
                    email,
                    phone,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            // Update Redux state
            // Assuming response contains the updated user object
            // If the API returns the updated user directly or inside data key
            const updatedUser = res.data.user || res.data;

            dispatch(updateUser({ user: updatedUser, token: token }));

            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (err: any) {
            console.error(err);
            Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50">
            <View className="p-6">
                <Text className="text-2xl font-bold text-gray-800 mb-6">Update Profile</Text>

                <View className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <View>
                        <Text className="text-gray-600 mb-2 font-medium">Full Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-800"
                            placeholder="Enter your name"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-2 font-medium">Email Address</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-800"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-600 mb-2 font-medium">Phone Number</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-800"
                            placeholder="Enter your phone"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <Pressable
                        onPress={handleUpdate}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl mt-4 ${loading ? 'bg-gray-400' : 'bg-green-600 active:bg-green-700'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center text-lg font-semibold">Save Changes</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

export default UpdateProfile;
