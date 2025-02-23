import {Alert, Pressable, StyleSheet, View} from 'react-native'
import ScreenWrapper from "@/components/ScreenWrapper";
import {verticalScale} from "@/utils/styling";
import {colors, spacingX, spacingY} from "@/constants/theme";
import BackButton from "@/components/backButton";
import Typo from "@/components/Type";
import Input from "@/components/input";
import {At, Lock} from "phosphor-react-native";
import {useRef, useState} from "react";
import Button from "@/components/Button";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/authContext";

const Login = () => {
      const emailRef = useRef("");
      const passwordRef = useRef("");
      const [isLoading, setIsLoading] = useState(false)
      const router = useRouter();
      const {login} = useAuth();
      const handleSubmit = async () => {

            if(!emailRef.current || !passwordRef.current) {
                  Alert.alert('Login','Please fill all the fields')
            }
            setIsLoading(true);
            const res = await login(emailRef.current, passwordRef.current);
            setIsLoading(false);
            if(!res.success){
                  Alert.alert("Login",res.msg);
            }
      }
      return (
          <ScreenWrapper>
                <View style={styles.container}>
                      <BackButton/>
                      <View style={{gap:5,marginTop:spacingY._20}}>
                            <Typo size={30} fontWeight={'800'}>Hey,</Typo>
                            <Typo size={30} fontWeight={'800'}>Welcome BBack</Typo>
                      </View>

                      <View style={styles.form}>
                            <Typo size={16} color={colors.textLighter}>Login now to track all your expense</Typo>
                            <Input onChangeText={value=>emailRef.current=value} placeholder={'Enter your email'} icon={<At size={verticalScale(26)} color={colors.neutral300}  weight={'fill'}/> }/>
                            <Input onChangeText={value=>passwordRef.current=value} secureTextEntry placeholder={'Enter your password'} icon={<Lock size={verticalScale(26)} color={colors.neutral300}  weight={'fill'}/> }/>
                            <Typo size={14} color={colors.text} style={{alignSelf:'flex-end'}}>Forgot Password?</Typo>
                            <Button onPress={handleSubmit} loading={isLoading}>
                                  <Typo color={colors.black} size={21} fontWeight={'700'}>Login</Typo>
                            </Button>
                      </View>
                      <View style={styles.footer}>
                            <Typo size={15}>Don&apos;t have an account?</Typo>
                            <Pressable onPress={()=>router.navigate('/(auth)/register')}>
                                  <Typo size={15} fontWeight={'700'} color={colors.primary}>Sign up</Typo>
                            </Pressable>
                      </View>
                </View>
          </ScreenWrapper>
      )
}
export default Login

const styles =StyleSheet.create({
      container: {
            flex: 1,
            gap:spacingY._30,
            paddingHorizontal: spacingX._20,
      },
      welcomeText:{
            fontSize:verticalScale(20),
            fontWeight:"bold",
            color:colors.text,
      },
      form:{
            gap:spacingY._20
      },
      forget:{
            textAlign:"right",
            fontWeight:'500',
            color:colors.text,
      },
      footer:{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            gap:5,
      },
      footerText:{
            color:colors.text,
            fontSize:verticalScale(15),
            textAlign:'center',
      }
})