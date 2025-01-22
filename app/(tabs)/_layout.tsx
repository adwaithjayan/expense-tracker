import React from 'react'
import {Tabs} from "expo-router";
import CustomTabs from "@/components/customeTabs";

export default function TabLayout() {
      return (
          <Tabs screenOptions={{headerShown: false}} tabBar={CustomTabs}>
                <Tabs.Screen name='index'/>
                <Tabs.Screen name='statistic'/>
                <Tabs.Screen name='wallet'/>
                <Tabs.Screen name='profile'/>
          </Tabs>
      )
}
