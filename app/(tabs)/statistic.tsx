import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import ScreenWrapper from "@/components/ScreenWrapper";
import {colors, radius, spacingX, spacingY} from "@/constants/theme";
import {scale, verticalScale} from "@/utils/styling";
import Header from "@/components/header";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {BarChart} from "react-native-gifted-charts";
import Loading from "@/components/Loading";
import {useAuth} from "@/context/authContext";
import {monthlyStats, weeklyStats, yearlyStats} from "@/services/transactionService";
import TransactionList from "@/components/transactionList";

export default function Statistic() {
      const [activeIndex, setActiveIndex] = useState(0);
      const [chartData, setChartData] = useState([]);
      const {user} = useAuth();
      const [chartLoading, setChartLoading] = useState(false);
      const [transactions, setTransactions] = useState([])
      useEffect(() => {
            if(activeIndex ==0){
                  getWeeklyStats()
            }
            if(activeIndex ==1){
                  getMonthlyStats()
            }
            if(activeIndex ==2){
                  getYearlyStats()
            }
      }, [activeIndex]);
    const getWeeklyStats =async ()=>{
      setChartLoading(true);
      let res = await weeklyStats(user?.uid as string);
      setChartLoading(false);
      if(res.success){
            setChartData(res?.data?.stats);
            setTransactions(res?.data?.transactions);
      } else {
            Alert.alert("Error",res.msg)
      }
    }
    const getMonthlyStats =async ()=>{
          setChartLoading(true);
          let res = await monthlyStats(user?.uid as string);
          setChartLoading(false);
          if(res.success){
                setChartData(res?.data?.stats);
                setTransactions(res?.data?.transactions);
          } else {
                Alert.alert("Error",res.msg)
          }
    }
    const getYearlyStats =async ()=>{
          setChartLoading(true);
          let res = await yearlyStats(user?.uid as string);
          setChartLoading(false);
          if(res.success){
                setChartData(res?.data?.stats);
                setTransactions(res?.data?.transactions);
          } else {
                Alert.alert("Error",res.msg)
          }

    }
      return (
          <ScreenWrapper>
                <View style={styles.container}>
                      <View >
                            <Header title='Statistics'/>
                      </View>
                      <ScrollView contentContainerStyle={{gap:spacingY._20,paddingTop:spacingY._5,paddingBottom:verticalScale(100)}} showsVerticalScrollIndicator={false}>
                            <SegmentedControl values={['Weekly','Monthly','Yearly']} selectedIndex={activeIndex} onChange={(e)=>{
                                  setActiveIndex(e.nativeEvent.selectedSegmentIndex);
                            }}
                                              tintColor={colors.neutral200}
                                              backgroundColor={colors.neutral800}
                                              appearance='dark'
                                              activeFontStyle={styles.segmentFontStyle}
                                              style={styles.segmentStyle}
                                              fontStyle={{...styles.segmentFontStyle,color:colors.white}}
                            />
                            <View style={styles.chartContainer}>
                                  {
                                        chartData.length>0 ?
                                            <BarChart data={chartData}
                                            barWidth={scale(12)}
                                                      spacing={[1,2].includes(activeIndex) ? scale(25) : scale(16)} roundedTop roundedBottom hideRules yAxisLabelPrefix='$' yAxisThickness={0} xAxisThickness={0} yAxisLabelWidth={[1,2].includes(activeIndex)? scale(38) :scale(35)}
                                                      yAxisTextStyle={{color:colors.neutral350}}
                                                      xAxisLabelTextStyle={{
                                                            color: colors.neutral350,
                                                            fontSize:verticalScale(12),
                                                      }}
                                                      isAnimated={true}
                                                      animationDuration={1000}

                                                      noOfSections={3}
                                                      minHeight={5}
                                            />

                                            :<View style={styles.onChart} ></View>
                                  }
                                  {chartLoading && <View style={styles.chartLoadingContainer}>
                                      <Loading color={colors.white}/>
                                  </View> }
                            </View>
                            
                            <View>
                                  <TransactionList data={transactions} title='Transactions' emptyListMessage='No transactions found' loading={chartLoading} />
                            </View>
                            
                      </ScrollView>
                </View>
          </ScreenWrapper>
      )
}
const styles = StyleSheet.create({
      container: {
            paddingHorizontal:spacingX._20,
            paddingVertical:spacingY._5,
            gap:spacingY._10
      },
      segmentFontStyle:{
            fontSize:verticalScale(13),
            fontWeight:'bold',
            color:colors.black
      },
      segmentStyle:{
            height:scale(37)
      },
      searchIcon:{
            backgroundColor:colors.neutral700,
            alignItems:"center",
            justifyContent:'center',
            borderRadius:100,
            height:verticalScale(35),
            width:verticalScale(35),
            borderCurve:"continuous",
      },
      onChart:{
            height:verticalScale(210),
            backgroundColor:"rgba(0,0,0,0.6)"
      },
      chartLoadingContainer:{
            position:"absolute",
            width:"100%",
            height:"100%",
            backgroundColor:"rgba(0,0,0,0.6)",
            borderRadius:radius._12,
      },
      chartContainer:{
            position:"relative",
            justifyContent:"center",
            alignItems:"center",
      }
})
