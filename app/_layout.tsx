import { Stack } from "expo-router";
import {AuthContextProvider} from "@/context/authContext";
import { colors } from "@/constants/theme";

const StackLayout=()=> {
  return <Stack screenOptions={{headerShown: false}} >
        <Stack.Screen name='(modals)/profileModal' options={{presentation:'modal'}}/>
        <Stack.Screen name='(modals)/walletModals' options={{presentation:'modal'}}/>
        <Stack.Screen name='(modals)/transactionModel' options={{presentation:'modal'}}/>
  </Stack>;
}


 const RootLayout = ()=>{
  return <AuthContextProvider>
    <StackLayout/>
  </AuthContextProvider>
}

export default RootLayout;