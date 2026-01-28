import { View, FlatList } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from "react";
import Hero from '@/components/Hero';
import ImageCard from '@/components/ImageCard';
import CardSkeleton from '@/components/SkeletonCard';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchProducts = async () => {
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
    };

    // First load
    fetchProducts();

    // Refresh every 10 seconds
    interval = setInterval(fetchProducts, 10000);

    return () => clearInterval(interval);
  }, []);

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
