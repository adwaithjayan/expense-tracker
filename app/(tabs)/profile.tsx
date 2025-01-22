import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Image} from 'expo-image'
import ScreenWrapper from "@/components/ScreenWrapper";
import {verticalScale} from "@/utils/styling";
import {colors, radius, spacingX, spacingY} from "@/constants/theme";
import Header from "@/components/header";
import Typo from "@/components/Type";
import {useAuth} from "@/context/authContext";
import {getProfileImage} from "@/services/imageService";
import {accountOptionType} from "@/types";
import {CaretRight, GearSix, Log, Power, User} from "phosphor-react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import {signOut} from "@firebase/auth";
import {auth} from "@/config/firebase";
import {useRouter} from "expo-router";

export default function Profile() {
      const {user} =useAuth();
      const router = useRouter();
      const accountOption:accountOptionType[]=[
            {
                  title:'Edit Profile',
                  icon:(<User size={26} color={colors.white} weight={'fill'}/>),
                  routeName:'/(modals)/profileModal',
                  bgColor:'#6366f1'
            },
            {
                  title:'Settings',
                  icon:(<GearSix size={26} color={colors.white} weight={'fill'}/>),
                  // routeName:'/(modals)/profileModal',
                  bgColor:'#059669'
            },
            {
                  title:'Privacy Policy',
                  icon:(<Log size={26} color={colors.white} weight={'fill'}/>),
                  // routeName:'/(modals)/profileModal',
                  bgColor:colors.neutral600
            },
            {
                  title:'Logout',
                  icon:(<Power size={26} color={colors.white} weight={'fill'}/>),
                  // routeName:'/(modals)/profileModal',
                  bgColor:'#e11d48'
            },
      ];
      const handleLogOut = async () => {
            await signOut(auth)
      }
      const showAlert =()=>{
            Alert.alert('Conform','Are you sure you want to logout',[
                  {
                        text: 'Cancel',
                        onPress: ()=>{},
                        style:'cancel'
                  },
                  {
                        text:'Logout',
                        onPress:()=>handleLogOut(),
                        style:'destructive'
                  }
            ])
      }

      const handlePress =  (item:accountOptionType)=>{
            if(item.title==='Logout'){
                  showAlert();
            }
            if(item.routeName){
                  router.push(item.routeName);
            }
      }
      return (
          <ScreenWrapper>
                <View style={styles.container}>
                      <Header title={"Profile"} />

                      <View style={styles.userInfo}>
                            <View>
                                  <Image source={getProfileImage(user?.image)} style={styles.avatar} contentFit='cover' transition={100}/>
                            </View>
                            <View style={styles.nameContainer}>
                                  <Typo size={24} fontWeight={'600'} color={colors.neutral100}>{user?.name}</Typo>
                                  <Typo size={15} color={colors.neutral400}>{user?.email}</Typo>
                            </View>
                      </View>

                      <View style={styles.accountOption}>
                            {
                                  accountOption.map((item,index) => (
                                      <Animated.View key={index.toString()} entering={FadeInDown.delay(index*50).springify().damping(14)} style={styles.listItem}>
                                            <TouchableOpacity style={styles.flexRow} onPress={()=>handlePress(item)}>
                                                  <View style={[styles.listIcon,{backgroundColor: item?.bgColor}]}>{item.icon && item.icon}</View>
                                                  <Typo size={16} style={{flex:1}} fontWeight={'500'}>{item.title}</Typo>
                                                  <CaretRight size={verticalScale(20)} weight={'bold'} color={colors.white}/>
                                            </TouchableOpacity>
                                      </Animated.View>
                                  ))
                            }
                      </View>
                </View>
          </ScreenWrapper>
      )
}
const styles = StyleSheet.create({
      container:{
            flex: 1,
            paddingHorizontal:spacingX._20
      },
      userInfo:{
            marginTop:verticalScale(30),
            alignItems:"center",
            gap:spacingY._15
      },
      avatarContainer:{
        position:'relative',
        alignSelf:'center',
      },
      avatar:{
            alignSelf:'center',
            backgroundColor:colors.neutral300,
            height:verticalScale(135),
            width:verticalScale(135),
            borderRadius:200
      },
      editIcon:{
            position: "absolute",
            bottom: 5,
            right: 0,
            borderRadius:50,
            backgroundColor:colors.neutral100,
            shadowColor:colors.black,
            shadowOffset:{width: 0, height: 0},
            shadowOpacity: 0.25,
            shadowRadius:10,
            elevation:4,
            padding: 5,
      },
      nameContainer:{
            gap:verticalScale(4),
            alignItems:"center",
      },
      listIcon:{
            height:verticalScale(44),
            width:verticalScale(44),
            backgroundColor:colors.neutral500,
            alignItems:"center",
            justifyContent:"center",
            borderRadius:radius._15,
            borderCurve:'continuous',
      },
      listItem:{
            marginBottom:verticalScale(17),
      },
      accountOption:{
            marginTop:spacingY._35
      },
      flexRow:{
            flexDirection:"row",
            alignItems:"center",
            gap:spacingX._10
      }
})
