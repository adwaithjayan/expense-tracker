import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native'
import React from 'react'
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import Typo from '@/components/Type';
import { PlusCircle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import useFetchData from '@/hooks/useFetchData';
import { WalletType } from '@/types';
import { orderBy, where } from 'firebase/firestore';
import { useAuth } from '@/context/authContext';
import Loading from '@/components/Loading';
import WalletItem from '@/components/walletItem';

const Wallet = () => {
      const router = useRouter();
      const {user} = useAuth();
      const {data,loading,error} = useFetchData<WalletType>("wallets",[where("uid","==",user?.uid),orderBy("created","desc")]);
      const getTotalBalence=()=>data.reduce((total,item)=>{
                  total = total + (item.amount ||0);
                  return total;
            },0)
      
      return (
          <ScreenWrapper style={{backgroundColor:colors.black}}>
                <View style={styles.container}>
                  <View style={styles.balencedView}>
                        <View style={{alignItems:'center'}}>
                              <Typo size={45} fontWeight={'500'}>${getTotalBalence()?.toFixed(2)}</Typo>
                              <Typo size={16} color={colors.neutral300}>Total Balance</Typo>
                        </View>
                  </View>
                  <View style={styles.wallets}>
                        <View style={styles.flexRow}>
                              <Typo size={20} fontWeight={'500'}>My Wallets</Typo>
                              <TouchableOpacity onPress={()=>router.push('/(modals)/walletModals')}>
                                    <PlusCircle weight='fill' color={colors.primary} size={verticalScale(33)}/>
                              </TouchableOpacity>
                        </View>

                        {loading && <Loading/>}
                        <FlatList data={data} renderItem={({item,index})=><WalletItem item={item} index={index} router={router}/>} contentContainerStyle={styles.listStyle}/>

                  </View>
                </View>
          </ScreenWrapper>
      )
}
export default Wallet
const styles = StyleSheet.create({
      balencedView: {
            backgroundColor: colors.black,
            justifyContent: 'center',
            alignItems: 'center',
            height:verticalScale(160)
      },
      flexRow:{
            flexDirection: 'row',
            justifyContent:'space-between',
            marginBottom: spacingY._10,
            alignItems: 'center'
      },
      wallets:{
            flex:1,
            backgroundColor:colors.neutral900,
            borderTopRightRadius:radius._30,
            borderTopLeftRadius:radius._30,
            padding:spacingX._20,
            paddingTop:spacingX._25
      },
      listStyle:{
            paddingVertical:spacingY._25,
            paddingTop:spacingY._15
      },
      container:{
            flex:1,
            justifyContent:'space-between'
      }
})
