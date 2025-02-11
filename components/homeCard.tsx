import { ImageBackground, StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import Typo from './Type'
import { ArrowDown, ArrowUp, DotsThreeOutline } from 'phosphor-react-native'
import { useAuth } from '@/context/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { orderBy, where } from 'firebase/firestore'

const HomeCard = () => {
    const {user} = useAuth();
    const {data:wallets,error,loading}=useFetchData<WalletType>("wallets",[where("uid","==",user?.uid),orderBy("created","desc")]);
    const totalBalance = () =>{
        return wallets.reduce((total:any,item:WalletType)=>{
            total.balance = total.balance + Number(item.amount);
            total.income = total.income + Number(item.totalIncome);
            total.expenses = total.expenses + Number(item.totalExpenses);
            return total;
        },{balance:0,income:0,expenses:0})
    }
  return (
    <ImageBackground source={require('@/assets/images/card.png')} style={styles.bgImage} resizeMode='stretch'>
        <View style={styles.container}>
            <View >
                <View style={styles.totalBalanceRow}>
                    <Typo color={colors.neutral800} size={17} fontWeight={'500'}>Total Balance</Typo>
                    <DotsThreeOutline size={verticalScale(23)} color={colors.black} weight='fill'/>
                </View>
                <Typo color={colors.black} size={30} fontWeight={'bold'}>$ {loading ?"----": totalBalance()?.balance?.toFixed(2)}</Typo>
            </View>

            <View style={styles.stats}>
        

                <View style={{gap:verticalScale(5)}}>
                    <View style={styles.incomeExpense}>
                        <View style={styles.statsIcon}>
                            <ArrowDown size={verticalScale(15)} color={colors.black} weight='bold'/>
                        </View>
                        <Typo size={16} color={colors.neutral700} fontWeight={'500'}>Income</Typo>
                    </View>
                    <View style={{alignSelf:'center'}}>
                        <Typo size={17} color={colors.green} fontWeight={'600'}>$ {loading ?"----":totalBalance()?.income?.toFixed(2)}</Typo>
                    </View>
                </View>

                <View style={{gap:verticalScale(5)}}>
                    <View style={styles.incomeExpense}>
                        <View style={styles.statsIcon}>
                            <ArrowUp size={verticalScale(15)} color={colors.black} weight='bold'/>
                        </View>
                        <Typo size={16} color={colors.neutral700} fontWeight={'500'}>Expense</Typo>
                    </View>
                    <View style={{alignSelf:'center'}}>
                        <Typo size={17} color={colors.rose} fontWeight={'600'}>$ {loading ?"----":totalBalance()?.expenses?.toFixed(2)}</Typo>
                    </View>
                </View>


            </View>

        </View>
    </ImageBackground>
  )
}

export default HomeCard

const styles = StyleSheet.create({
    bgImage:{
        height:scale(210),
        width:'100%',
    },
    container:{
        padding:spacingX._20,
        paddingHorizontal:scale(23),
        height:'87%',
        width:'100%',
        justifyContent:"space-between"
    },
    totalBalanceRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:spacingY._5
    },
    stats:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    statsIcon:{
        backgroundColor:colors.neutral350,
        padding:spacingY._5,
        borderRadius:50
    },
    incomeExpense:{
        flexDirection:'row',
        alignItems:'center',
        gap:spacingY._7
    }
})