import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import Typo from '@/components/Type';
import { useAuth } from '@/context/authContext';
import { MagnifyingGlass, Plus } from 'phosphor-react-native';
import HomeCard from '@/components/homeCard';
import TransactionList from '@/components/transactionList';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { limit, orderBy, where } from 'firebase/firestore';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType } from '@/types';

const Home = () => {
      const {user } = useAuth();
      const router = useRouter();
      const constraints = [
            where("uid","==",user?.uid),
            orderBy("date","desc"),
            limit(30)
      ];

      const {data,error,loading}=useFetchData<TransactionType>("transactions",constraints);

      return (
          <ScreenWrapper>
            <View style={styles.container}>
                  <View style={styles.header}>
                        <View style={{gap:4}}>
                              <Typo size={16} color={colors.neutral400}>Hello,</Typo>
                              <Typo size={20} fontWeight={'500'}>{user?.name}</Typo>
                        </View>
                        <TouchableOpacity style={styles.searchIcon} onPress={()=>router.push('./(modals)/searchModal)')}>
                              <MagnifyingGlass size={verticalScale(22)} color={colors.neutral200} weight='bold'/>
                        </TouchableOpacity>
                  </View>
                  <ScrollView contentContainerStyle={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                        <View>
                              <HomeCard/>
                        </View>
                        <TransactionList loading={loading} data={data} emptyListMessage='No Recent Transactions' title='Recent Transactions'/>
                  </ScrollView>
                  <Button style={styles.flotingButton} onPress={()=>router.push('./(modals)/transactionModal')}>
                        <Plus color={colors.black} weight='bold' size={verticalScale(24)}/>
                  </Button>
            </View>
          </ScreenWrapper>
      )
}
export default Home

const styles = StyleSheet.create({
      container:{
            flex:1,
            paddingHorizontal:spacingX._20,
            marginTop:verticalScale(8)
      },
      header:{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems: 'center',
            marginBottom:spacingY._10,
      },
      searchIcon:{
            backgroundColor:colors.neutral700,
            padding:spacingX._10,
            borderRadius:50
      },
      flotingButton:{
            height:verticalScale(50),
            width:verticalScale(50),
            borderRadius:100,
            position: 'absolute',
            bottom:verticalScale(30),
            right:verticalScale(30),
      },
      scrollViewStyle:{
            marginTop:spacingY._10,
            paddingBottom:verticalScale(100),
            gap:spacingY._25
      }
})
