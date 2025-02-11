import {View, Platform, Dimensions, StatusBar} from 'react-native'
import React from 'react'
import {ScreenWrapperProps} from "@/types";
import {colors} from "@/constants/theme";


const {height} = Dimensions.get("window");
const ScreenWrapper = ({style={backgroundColor:colors.neutral900},children}:ScreenWrapperProps) => {
      let pT = Platform.OS === 'ios'?height*0.06 :15
      return (
          <View style={[{paddingTop:pT,flex:1},style]}>
                <StatusBar barStyle={'light-content'} backgroundColor={style&& style.backgroundColor} />
                {children}
          </View>
      )
}
export default ScreenWrapper

