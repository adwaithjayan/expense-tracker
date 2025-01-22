import {Alert, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {scale, verticalScale} from "@/utils/styling";
import {colors, spacingX, spacingY} from "@/constants/theme";
import ModuleWrapper from "@/components/ModuleWrapper";
import Header from "@/components/header";
import BackButton from "@/components/backButton";
import {Image} from "expo-image";
import {getProfileImage} from "@/services/imageService";
import {Pencil} from "phosphor-react-native";
import Typo from "@/components/Type";
import Input from "@/components/input";
import {useEffect, useState} from "react";
import {UserDataType} from "@/types";
import Button from "@/components/Button";
import {useAuth} from "@/context/authContext";
import {updateUser} from "@/services/userService";
import {useRouter} from "expo-router";
import * as ImagePicker from "expo-image-picker";

const ProfileModal = () => {
      const {user,updateUserData} = useAuth();
      const router = useRouter();
      const [userData, setUserData] = useState<UserDataType>({
            name: "",
            image:null
      });
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
            setUserData({
                  name:user?.name || "",
                  image:user?.image || null
            })
      }, [user]);

      const onPick =async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes:['images'],
                  allowsEditing:false,
                  aspect:[4,3],
                  quality:0.5
            })

            if(!result.canceled){
                  setUserData({...userData,image:result.assets[0]})
            }
      }

      const onSubmit = async () => {
            let {name,image} = userData;
            if(!name.trim()){
                  Alert.alert('User','Please fill all the fields');
                  return;
            }
            setIsLoading(true);
            const res = await updateUser(user?.uid as string, userData);
            setIsLoading(false);
            if(res.success){
                  await updateUserData(user?.uid as string);
                  router.back();
            }else {
                  Alert.alert('User',res.msg)
            }
      }
      return (
          <ModuleWrapper>
                <View style={styles.container}>
                      <Header title={'Update Profile'} leftIcon={<BackButton/>} style={{marginBottom:spacingY._10}}/>
                      <ScrollView contentContainerStyle={styles.form}>
                            <View style={styles.avatarContainer}>
                                  <Image style={styles.avatar} source={getProfileImage(null)} contentFit={'cover'} transition={100}/>
                                  <TouchableOpacity style={styles.editIcon} onPress={onPick}>
                                        <Pencil size={verticalScale(20)} color={colors.neutral800}/>
                                  </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainer}>
                                  <Typo color={colors.neutral200}>Name</Typo>
                                  <Input placeholder='Name' value={userData.name} onChangeText={(value)=>setUserData({...userData,name:value})}/>
                            </View>
                      </ScrollView>
                </View>
                <View style={styles.footer}>
                      <Button onPress={onSubmit} style={{flex:1}} loading={isLoading}>
                            <Typo color={colors.black} fontWeight={'700'}>Update</Typo>
                      </Button>
                </View>
          </ModuleWrapper>
      )
}
export default ProfileModal
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
