import {Alert, ScrollView, StyleSheet, View} from 'react-native'
import {scale, verticalScale} from "@/utils/styling";
import {colors, spacingX, spacingY} from "@/constants/theme";
import ModuleWrapper from "@/components/ModuleWrapper";
import Header from "@/components/header";
import BackButton from "@/components/backButton";

import Typo from "@/components/Type";
import Input from "@/components/input";
import { useState} from "react";
import { WalletType} from "@/types";
import Button from "@/components/Button";
import {useAuth} from "@/context/authContext";
import {useRouter} from "expo-router";
import ImageUpload from '@/components/imageUpload';
import { createOrUpdateWallet } from '@/services/walletService';

const walletModal = () => {
      const {user} = useAuth();
      const router = useRouter();
      const [wallet, setWallet] = useState<WalletType>({
            name: "",
            image:null
      });
      const [isLoading, setIsLoading] = useState(false);


    

      const onSubmit = async () => {
            let {name,image} = wallet;
            if(!name.trim()){
                  Alert.alert('User','Please fill all the fields');
                  return;
            }
            const data:WalletType ={
              name,
              image,
              uid:user?.uid
            }
            setIsLoading(true);
            const res = await createOrUpdateWallet(data);
            setIsLoading(false);
            if(res.success){
                  router.back();
            }else {
                  Alert.alert('Wallet',res.msg)
            }
      }
      return (
          <ModuleWrapper>
                <View style={styles.container}>
                      <Header title={'New Wallet'} leftIcon={<BackButton/>} style={{marginBottom:spacingY._10}}/>
                      <ScrollView contentContainerStyle={styles.form}>
                            <View style={styles.inputContainer}>
                                  <Typo color={colors.neutral200}>Wallet Name</Typo>
                                  <Input placeholder='Salary' value={wallet.name} onChangeText={(value)=>setWallet({...wallet,name:value})}/>
                            </View>
                            <View style={styles.inputContainer}>
                                  <Typo color={colors.neutral200}>Wallet Icon</Typo>
                                  {/* image picker */}
                                  <ImageUpload placeholder='Upload Image' file={wallet.image} onSelect={file=>setWallet({...wallet,image:file})} onClear={()=>setWallet({...wallet,image:null})}/>
                            </View>
                      </ScrollView>
                </View>
                <View style={styles.footer}>
                      <Button onPress={onSubmit} style={{flex:1}} loading={isLoading}>
                            <Typo color={colors.black} fontWeight={'700'}>Add Wallet</Typo>
                      </Button>
                </View>
          </ModuleWrapper>
      )
}
export default walletModal
const styles = StyleSheet.create({
      avatar:{
            width:verticalScale(135),
            height:verticalScale(135),
            borderRadius:200,
            borderWidth:1,
            borderColor:colors.neutral500,
            backgroundColor:colors.neutral300,
            alignSelf:'center'
      },
      avatarContainer:{
            position:'relative',
            alignSelf:'center',
      },
      form:{
            marginTop:spacingY._15,
            gap:spacingY._30
      },
      footer:{
            alignItems:"center",
            justifyContent:'center',
            flexDirection:'row',
            paddingHorizontal:spacingX._20,
            gap:scale(12),
            paddingTop:spacingY._15,
            borderTopColor:colors.neutral700,
            marginBottom:spacingY._5,
            borderWidth:1
      },
      container:{
            paddingHorizontal:spacingY._20,
            justifyContent:'space-between',
            flex:1
      },
      editIcon:{
            position:"absolute",
            bottom:spacingY._5,
            right:spacingY._7,
            borderRadius:100,
            backgroundColor:colors.neutral100,
            shadowOffset:{width:0, height:0},
            shadowColor:colors.black,
            shadowOpacity:0.25,
            shadowRadius:10,
            elevation:4,
            padding:spacingY._7
      },
      inputContainer:{
            gap:spacingY._10
      }
})
