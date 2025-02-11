import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import ModuleWrapper from "@/components/ModuleWrapper";
import Header from "@/components/header";
import BackButton from "@/components/backButton";
import { Dropdown } from "react-native-element-dropdown";
import Typo from "@/components/Type";
import Input from "@/components/input";
import { useEffect, useState } from "react";
import { TransactionType, WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/imageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { Trash } from "phosphor-react-native";
import { expenseCategories, transactionTypes } from "@/constants/data";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DatePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { creatrOrUpdateTransaction } from "@/services/transactionService";

const TransactionModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    date: new Date(),
    category: "",
    walletId: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();

  const { data, loading, error } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const onSubmit = async () => {
    const {type,amount,date,description,category,walletId,image} = transaction
    if((type=='expense' && !category) || !amount || !date){
      Alert.alert("Transaction", "Please fill all the required fields");
      return;
    }

    let transactionData:TransactionType ={
      type,
      amount,
      date,
      description,
      category,
      walletId,
      image,
      uid: user?.uid,
    }
    setIsLoading(true);
    const res = await creatrOrUpdateTransaction(transactionData);
    setIsLoading(false);
    if (res.success) {
      router.back();
    }else{
      Alert.alert("Transaction", res.msg);
    }
  };

  const handleDelete = async () => {
    if (!oldTransaction.id) return;
    setIsLoading(true);
    const res = await deleteWallet(oldTransaction.id);
    setIsLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };
  const showDltAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this wallet?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDelete(),
        style: "destructive",
      },
    ]);
  };
  const onDateChange = (e: DateTimePickerEvent, date: any) => {
    const curr = date || transaction.date;
    setTransaction({ ...transaction, date: curr });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  return (
    <ModuleWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Type</Typo>
            {/**drop down */}

            <Dropdown
              style={styles.dropDownContainer}
              selectedTextStyle={styles.dropdownSelectText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField={"value"}
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral700}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet</Typo>

            <Dropdown
              style={styles.dropDownContainer}
              placeholderStyle={styles.dropdownPlaceHolder}
              placeholder="Select Wallet"
              selectedTextStyle={styles.dropdownSelectText}
              iconStyle={styles.dropdownIcon}
              data={data.map((wallet) => ({
                label: `${wallet.name} ($${wallet.amount})`,
                value: wallet.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField={"value"}
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropDownItemContainer}
              containerStyle={styles.dropdownListContainer}
              activeColor={colors.neutral700}
            />
          </View>
          {transaction.type == "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>Expense Category</Typo>

              <Dropdown
                style={styles.dropDownContainer}
                placeholderStyle={styles.dropdownPlaceHolder}
                placeholder="Select Wallet"
                selectedTextStyle={styles.dropdownSelectText}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField={"value"}
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropDownItemContainer}
                containerStyle={styles.dropdownListContainer}
                activeColor={colors.neutral700}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Date</Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View
                style={
                  Platform.OS === "ios"
                    ? styles.iosDatePicker
                    : styles.androidDatePicker
                }
              >
                <DatePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS == "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Amount</Typo>
            <Input
              value={transaction.amount.toString()}
              keyboardType="numeric"
              onChangeText={(text) =>
                setTransaction({...transaction, amount: Number(text.replace(/[,]/g, "")) })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
            <Typo color={colors.neutral200} size={16}>Discription</Typo>
            <Typo color={colors.neutral200} size={14}>(optional)</Typo>
            </View>
            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection:'row',
                height:verticalScale(100),
                alignItems:'flex-start',
                paddingVertical:15
              }}
              onChangeText={(text) =>
                setTransaction({...transaction, description:text})
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
            <Typo color={colors.neutral200} size={16}>Recepit</Typo>
            <Typo color={colors.neutral200} size={14}>(optional)</Typo>
            </View>
            <ImageUpload file={transaction.image} onClear={()=>setTransaction({...transaction,image:null})} onSelect={(file)=>setTransaction({...transaction,image:file})}
            placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {oldTransaction?.id && !isLoading && (
          <Button
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
            onPress={showDltAlert}
          >
            <Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={isLoading}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? "Update " : "Add "}
          </Typo>
        </Button>
      </View>
    </ModuleWrapper>
  );
};
export default TransactionModal;
const styles = StyleSheet.create({
  avatar: {
    width: verticalScale(135),
    height: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
    backgroundColor: colors.neutral300,
    alignSelf: "center",
  },
  androidDatePicker: {},
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  form: {
    paddingVertical: spacingY._15,
    gap: spacingY._20,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderWidth: 1,
  },
  container: {
    paddingHorizontal: spacingY._20,
    flex: 1,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
  },
  androidDropDown: {
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceHolder: {
    color: colors.white,
  },
  dropDownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
});
