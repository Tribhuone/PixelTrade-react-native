import { View, FlatList } from 'react-native';
import axios from 'axios';
import { useState, useEffect, useCallback } from "react";
import Hero from '@/components/Hero';
import ImageCard from '@/components/ImageCard';
import CardSkeleton from '@/components/SkeletonCard';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_PRODUCT_API_URL}/api/product`
      );

      setItems(res.data.slice().reverse());
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    const interval = setInterval(fetchProducts, 10000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={items}
        key="one-column"
        keyExtractor={(item) => item._id}
        numColumns={1}
        ListHeaderComponent={<Hero />}
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={({ item }) => <ImageCard item={item} />}
        showsVerticalScrollIndicator={false}

        refreshing={refreshing}
        onRefresh={onRefresh}

        ListEmptyComponent={
          loading ? (
            <View className="flex-row flex-wrap justify-around">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </View>
          ) : null
        }
      />
    </View>
  );
}
