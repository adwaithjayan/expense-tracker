import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {AuthContextType, UserType} from "@/types";
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import {auth, firestore} from "@/config/firebase";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {useRouter} from "expo-router";


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider:FC<{children:ReactNode}>=({children})=>{
      const [user, setUser] = useState<UserType>(null);
      const router = useRouter()
      useEffect(() => {
           const unSub = onAuthStateChanged(auth,(firebaseUser)=>{
                 if(firebaseUser){
                       setUser({
                             uid:firebaseUser?.uid,
                             email:firebaseUser?.email,
                             name:firebaseUser?.displayName
                       });
                       updateUserData(firebaseUser.uid)
                       router.replace("./(tabs)")
                 }else {
                       setUser(null);
                       router.replace('/(auth)/welcome')
                 }
           })
            return ()=>unSub();
      }, []);
      const login = async (email:string,password:string)=>{
            try {
                  await signInWithEmailAndPassword(auth,email,password);
                  console.log('success')
                  return {success :true}
            }
            catch (err:any){
                  let msg = err.message;
                  if(msg.includes("(auth/invalid-credential)")) msg = 'Wrong credentials'
                  if(msg.includes("(auth/invalid-email)")) msg = 'Invalid Email'
                  return {success:false,msg}
            }
      }

      const register = async (email:string,password:string,name:string)=>{
            try {
                  let res = await createUserWithEmailAndPassword(auth,email,password);
                  await setDoc(doc(firestore,"users",res?.user?.uid),{
                        name,email,uid:res?.user?.uid
                  })
                  return {success :true}
            }
            catch (err:any){
                  let msg = err.message;
                  if(msg.includes("(auth/email-already-in-use)")) msg = 'This email is already in use'
                  if(msg.includes("(auth/invalid-email)")) msg = 'Invalid Email'
                  return {success:false,msg}
            }
      }

      const updateUserData = async (uid:string)=>{
            try {
                  const docRef= doc(firestore,'users',uid);
                  const docSnap =await getDoc(docRef);
                  if(docSnap.exists()){
                        const data = docSnap.data();
                        const userData:UserType={
                              uid:data?.uid,
                              email:data?.email || null,
                              name:data?.name || null,
                              image:data?.name || null
                        }
                        setUser({...userData})
                  }
            }
            catch (err:any){
                  let msg = err.message;
                  console.log('error',msg)
            }
      }
      const contextValue:AuthContextType={
            user,setUser,login,register,updateUserData
      }
      return <AuthContext.Provider value={contextValue}>
            {children}
      </AuthContext.Provider>
}

export const  useAuth= ():AuthContextType=>{
      const context = useContext(AuthContext);
      if(!context){
            throw  new Error("useAuth must be wrapped inside AuthProvider");
      }
      return context;
}