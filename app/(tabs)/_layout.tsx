
import { Tabs } from 'expo-router';
import React from 'react';
import CustomeTab from "@/components/tabUi/CustomeTab";


export default function TabLayout() {

  return (
    <Tabs
      tabBar={props => <CustomeTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home/index"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="Upload/index"
        options={{ title: "Upload" }}
      />
      <Tabs.Screen
        name="Cart/index"
        options={{ title: "Cart" }}
      />
      <Tabs.Screen
        name="Dashbord/index"
        options={{ title: "Profile" }}
      />
    </Tabs>
  );
}

