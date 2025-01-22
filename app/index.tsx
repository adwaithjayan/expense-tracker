import {Image, Text, View} from "react-native";
import {colors} from "@/constants/theme";
import {useRouter} from "expo-router";
import {useEffect} from "react";

export default function Index() {
      const router = useRouter();
      useEffect(() => {
            const timeOut = setTimeout(()=>{
                  router.push('./(auth)/welcome')
            },2000)
            return()=>clearTimeout(timeOut)
      }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:colors.neutral900
      }}
    >
      <Image style={{height:'20%',aspectRatio:1}} resizeMode="contain" source={require('@/assets/images/splashImage.png')}/>
    </View>
  );
}
