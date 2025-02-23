import {Alert, ScrollView, StyleSheet, View} from 'react-native'
import {scale, verticalScale} from "@/utils/styling";
import {colors, spacingX, spacingY} from "@/constants/theme";
import ModuleWrapper from "@/components/ModuleWrapper";
import Header from "@/components/header";
import BackButton from "@/components/backButton";

import Typo from "@/components/Type";
import Input from "@/components/input";
import { useEffect, useState} from "react";
import {TransactionType, WalletType} from "@/types";
import Button from "@/components/Button";
import {useAuth} from "@/context/authContext";
import {useLocalSearchParams, useRouter} from "expo-router";
import ImageUpload from '@/components/imageUpload';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { Trash } from 'phosphor-react-native';
import {limit, orderBy, where} from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import TransactionList from "@/components/transactionList";
import items from "ajv/lib/vocabularies/applicator/items";

const SearchModal = () => {
      const {user} = useAuth();
      const router = useRouter();
      const [search, setSearch] = useState('')
      const [isLoading, setIsLoading] = useState(false);

      const constraints = [
            where("uid","==",user?.uid),
            orderBy("date","desc"),
            limit(30)
      ];

      const {data,error,loading}=useFetchData<TransactionType>("transactions",constraints);

      const filteredTransactions =data.filter((item)=>{
            if(search.length>1){
                  return !!(item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
                      item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
                      item.description?.toLowerCase()?.includes(search?.toLowerCase()));


            }
            return true;
      })

      return (
          <ModuleWrapper style={{backgroundColor:colors.neutral500}}>
                <View style={styles.container}>
                      <Header title={'Search'} leftIcon={<BackButton/>} style={{marginBottom:spacingY._10}}/>
                      <ScrollView contentContainerStyle={styles.form}>
                            <View style={styles.inputContainer}>
                                  <Input containerStyle={{backgroundColor:colors.neutral800}} placeholderTextColor={colors.neutral400} placeholder='Shoes..' value={search} onChangeText={(value)=>setSearch(value)}/>
                            </View>
                            <View >
                                  <TransactionList data={filteredTransactions} loading={loading} emptyListMessage='No transactions found' />
                            </View>
                      </ScrollView>
                </View>

          </ModuleWrapper>
      )
}
export default SearchModal
const styles = StyleSheet.create({

      form:{
            marginTop:spacingY._15,
            gap:spacingY._30
      },

      container:{
            paddingHorizontal:spacingY._20,
            justifyContent:'space-between',
            flex:1
      },

      inputContainer:{
            gap:spacingY._10
      }
})
