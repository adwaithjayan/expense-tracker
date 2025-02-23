import { Stack } from "expo-router";
import {AuthContextProvider} from "@/context/authContext";

const StackLayout=()=> {
  return <Stack screenOptions={{headerShown: false}} >
        <Stack.Screen name='(modals)/profileModal' options={{presentation:'modal'}}/>
        <Stack.Screen name='(modals)/walletModals' options={{presentation:'modal'}}/>
        <Stack.Screen name='(modals)/transactionModal' options={{presentation:'modal'}}/>
        <Stack.Screen name='(modals)/searchModal' options={{presentation:'modal'}}/>
  </Stack>;
}


 const RootLayout = ()=>{
  return <AuthContextProvider>
    <StackLayout/>
  </AuthContextProvider>
}

export default RootLayout;