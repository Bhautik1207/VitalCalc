import React, {useRef, useState} from 'react';
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput as TextInputR,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Circle} from 'react-native-svg';
import {Divider, Menu, TextInput} from 'react-native-paper';
import {normalize, wp, hp, isAndroid} from '../../styles/responsiveScreen';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';

const bmiCategories = [
  {label: 'Very Severely Underweight', range: '< 16', color: colors.skyMist},
  {label: 'Severely Underweight', range: '16.0-16.9', color: colors.oceanWave},
  {label: 'Underweight', range: '17.0-18.4', color: colors.azureGlow},
  {label: 'Normal weight', range: '18.5-24.9', color: colors.leafGreen},
  {label: 'Overweight', range: '25.0-29.9', color: colors.goldenSun},
  {label: 'Obese I', range: '30.0-34.9', color: colors.sunsetOrange},
  {label: 'Obese II', range: '35.0-39.9', color: colors.emberGlow},
  {label: 'Obese III', range: '> 39.9', color: colors.crimsonFlame},
];

const BMICalculatorScreen = () => {
  const weightRef = useRef<TextInputR>(null);
  const feetRef: any = useRef<TextInputR>(null);
  const inchRef: any = useRef<TextInputR>(null);

  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');
  const [isMale, setIsMale] = useState<boolean>(true);
  const [bmi, setBmi] = useState<any>(0);
  const [category, setCategory] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [heightType, setHeightType] = useState<string>('ft');
  const [cm, setCm] = useState<string>('');
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const calculateBMI = () => {
    let heightInMeters: any;

    if (heightType === 'ft') {
      if (!feet || !inches || !weight) return;
      const totalInches = parseFloat(feet) * 12 + parseFloat(inches); 
      heightInMeters = totalInches * 0.0254; 
    }
    else if (heightType === 'cm') {
      if (!cm || !weight) return;
      heightInMeters = parseFloat(cm) / 100;
    }

    const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
    const finalValue: any = bmiValue.toFixed(1);
    setBmi(finalValue);
    setCategory(getBMICategory(finalValue));
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 16) return 'Very Severely Underweight';
    if (bmi >= 16 && bmi <= 16.9) return 'Severely Underweight';
    if (bmi >= 17 && bmi <= 18.4) return 'Underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    if (bmi >= 30 && bmi <= 34.9) return 'Obese I';
    if (bmi >= 35 && bmi <= 39.9) return 'Obese II';
    return 'Obese III';
  };

  const getColorByBMI = (bmi: any) => {
    return bmi < 16
      ? colors.skyMist
      : bmi < 17
      ? colors.oceanWave
      : bmi < 18.5
      ? colors.azureGlow
      : bmi < 25
      ? colors.leafGreen
      : bmi < 30
      ? colors.goldenSun
      : bmi < 35
      ? colors.sunsetOrange
      : bmi < 40
      ? colors.emberGlow
      : colors.crimsonFlame;
  };

  const resetValues = () => {
    setAge('');
    setWeight('');
    setFeet('');
    setInches('');
    setCm('');
    setBmi(0);
    setCategory('');
    setHeightType('ft');
    setIsMale(true);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={{marginHorizontal: wp(4)}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AnimatedCircularProgress
            key={bmi}
            size={wp(45)}
            width={wp(5)}
            fill={bmi}
            tintColor={getColorByBMI(bmi)}
            backgroundColor={colors.neutral10}
            padding={10}
            rotation={-360}
            renderCap={({center}) => (
              <Circle
                cx={center.x}
                cy={center.y}
                r="10"
                fill={getColorByBMI(bmi)}
              />
            )}>
            {() => (
              <Text style={[styles.resultText, {color: getColorByBMI(bmi)}]}>
                {`${bmi}\nBMI`}
              </Text>
            )}
          </AnimatedCircularProgress>
          {/* <TouchableOpacity
            style={styles.infoView}
            onPress={() => setShowInfo(true)}>
            <SvgIcons.Info width={wp(6)} height={wp(6)} />
          </TouchableOpacity> */}
        </View>
        {category ? (
          <Text style={[styles.resultText, {color: getColorByBMI(bmi)}]}>
            {category}
          </Text>
        ) : null}
        <View style={styles.rowContainer}>
          <View style={{width: '47%'}}>
            <TextInput
              label={'Age'}
              value={age}
              onChangeText={text => {
                if (text === '' || /^(?:[1-9]\d?|1[0-4]\d|150)$/.test(text)) {
                  setAge(text);
                }
              }}
              mode="outlined"
              placeholderTextColor={colors.neutral40}
              outlineColor={colors.neutral20}
              activeOutlineColor={colors.primary}
              outlineStyle={{borderWidth: 1}}
              returnKeyType={'next'}
              keyboardType="numeric"
              onSubmitEditing={() => weightRef.current?.focus()}
              style={{backgroundColor: colors.white}}
              textColor={colors.neutralDark}
              theme={{
                roundness: normalize(10),
              }}
            />
          </View>
          <View style={{width: '47%'}}>
            <TextInput
              ref={weightRef}
              label={'Weight (kg)'}
              value={weight}
              onChangeText={text => {
                if (text === '' || /^(?:[1-9]\d?|1[0-4]\d|150)$/.test(text)) {
                  setWeight(text);
                }
              }}
              mode="outlined"
              placeholderTextColor={colors.neutral40}
              outlineColor={colors.neutral20}
              activeOutlineColor={colors.primary}
              outlineStyle={{borderWidth: 1}}
              returnKeyType={'next'}
              keyboardType="numeric"
              onSubmitEditing={() => feetRef?.current.focus()}
              style={{backgroundColor: colors.white}}
              textColor={colors.neutralDark}
              theme={{
                roundness: normalize(10),
              }}
            />
          </View>
        </View>
        <View style={[styles.rowContainer, {marginTop: hp(1)}]}>
          {heightType === 'ft' ? (
            <>
              <View style={{width: '38%'}}>
                <TextInput
                  ref={feetRef}
                  label={'Feet'}
                  value={feet}
                  onChangeText={text => {
                    if (text === '' || /^[1-9]$/.test(text)) {
                      setFeet(text);
                    }
                  }}
                  mode="outlined"
                  placeholderTextColor={colors.neutral40}
                  outlineColor={colors.neutral20}
                  activeOutlineColor={colors.primary}
                  outlineStyle={{borderWidth: 1}}
                  returnKeyType={'next'}
                  keyboardType="numeric"
                  onSubmitEditing={() => inchRef?.current.focus()}
                  style={{backgroundColor: colors.white}}
                  textColor={colors.neutralDark}
                  theme={{
                    roundness: normalize(10),
                  }}
                />
              </View>
              <View style={{width: '38%'}}>
                <TextInput
                  ref={inchRef}
                  label={'Inch'}
                  value={inches}
                  onChangeText={text => {
                    if (text === '' || /^(1[0-2]|[0-9])$/.test(text)) {
                      setInches(text);
                    }
                  }}
                  mode="outlined"
                  placeholderTextColor={colors.neutral40}
                  outlineColor={colors.neutral20}
                  activeOutlineColor={colors.primary}
                  outlineStyle={{borderWidth: 1}}
                  returnKeyType={'done'}
                  keyboardType="numeric"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  style={{backgroundColor: colors.white}}
                  textColor={colors.neutralDark}
                  theme={{
                    roundness: normalize(10),
                  }}
                />
              </View>
            </>
          ) : (
            <View style={{width: '75%'}}>
              <TextInput
                ref={feetRef}
                label={'Cm'}
                value={cm}
                onChangeText={text => {
                  if (
                    text === '' ||
                    /^(?:[1-9]\d?|1\d{2}|2[0-9]{2}|300)$/.test(text)
                  ) {
                    setCm(text);
                  }
                }}
                mode="outlined"
                placeholderTextColor={colors.neutral40}
                outlineColor={colors.neutral20}
                activeOutlineColor={colors.primary}
                outlineStyle={{borderWidth: 1}}
                returnKeyType={'done'}
                keyboardType="numeric"
                onSubmitEditing={() => Keyboard.dismiss()}
                style={{backgroundColor: colors.white}}
                textColor={colors.neutralDark}
                theme={{
                  roundness: normalize(10),
                }}
              />
            </View>
          )}
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            contentStyle={styles.menuItemContent}
            anchor={
              <TouchableOpacity
                style={styles.menuView}
                onPress={() => {
                  setShowMenu(!showMenu);
                }}>
                <Text
                  style={[
                    styles.title,
                    {color: colors.white, marginTop: 0, marginRight: wp(0.5)},
                  ]}>
                  {heightType}
                </Text>
                <SvgIcons.DownArrow width={wp(6)} height={wp(5)} />
              </TouchableOpacity>
            }>
            <Menu.Item
              onPress={() => {
                setHeightType('ft');
                setShowMenu(false);
              }}
              title="ft"
              style={styles.menuItem}
              rippleColor={'transparent'}
              titleStyle={{color: colors.neutralDark}}
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setHeightType('cm');
                setShowMenu(false);
              }}
              title="cm"
              style={styles.menuItem}
              rippleColor={'transparent'}
              titleStyle={{color: colors.neutralDark}}
            />
          </Menu>
        </View>
        <View style={[styles.radioContainer, {marginTop: hp(1.5)}]}>
          <TouchableOpacity
            style={[styles.radioContainer, {marginRight: wp(5)}]}
            onPress={() => setIsMale(true)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.radioCircle,
                isMale && styles.radioCircleSelected,
              ]}>
              {isMale && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setIsMale(false)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.radioCircle,
                !isMale && styles.radioCircleSelected,
              ]}>
              {!isMale && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={[styles.calculateBtn, {width: '81%'}]}
            onPress={calculateBMI}>
            <Text style={[styles.title, {color: colors.white, marginTop: 0}]}>
              Calculate BMI
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.calculateBtn, {width: '14%'}]}
            onPress={resetValues}>
            <SvgIcons.Reset />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginHorizontal: wp(4)}}>
        {bmiCategories.map(({label, range, color}, i) => (
          <View key={i} style={styles.ageDetails}>
            <View style={styles.rowContainer}>
              <View style={[styles.badge, {backgroundColor: color}]} />
              <Text
                style={[
                  styles.selectedDate,
                  {
                    color:
                      bmi != 0 && getBMICategory(bmi) == label
                        ? color
                        : colors.black,
                    fontWeight:
                      bmi != 0 && getBMICategory(bmi) == label
                        ? 'bold'
                        : 'normal',
                    fontSize:
                      bmi != 0 && getBMICategory(bmi) == label
                        ? normalize(18)
                        : normalize(16),
                  },
                ]}>
                {label}
              </Text>
            </View>
            <Text
              style={[
                styles.selectedDate,
                {
                  color:
                    bmi != 0 && getBMICategory(bmi) == label
                      ? color
                      : colors.black,
                  fontWeight:
                    bmi != 0 && getBMICategory(bmi) == label
                      ? 'bold'
                      : 'normal',
                  fontSize:
                    bmi != 0 && getBMICategory(bmi) == label
                      ? normalize(18)
                      : normalize(16),
                },
              ]}>
              {range}
            </Text>
          </View>
        ))}
      </View>
      {/* <Modal transparent visible={showInfo} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={[styles.rowContainer, {marginBottom: hp(1.5)}]}>
              <Text
                style={[
                  styles.title,
                  {fontSize: normalize(18), color: colors.primary},
                ]}>
                BMI Info
              </Text>
              <TouchableOpacity onPress={() => setShowInfo(false)}>
                <SvgIcons.Close
                  stroke={colors.primary}
                  strokeWidth={2}
                  width={wp(4)}
                  height={wp(4)}
                />
              </TouchableOpacity>
            </View>
            {bmiCategories.map(({label, range, color}, i) => (
              <View key={i} style={styles.ageDetails}>
                <View style={styles.rowContainer}>
                  <View style={[styles.badge, {backgroundColor: color}]} />
                  <Text style={styles.selectedDate}>{label}</Text>
                </View>
                <Text style={[styles.selectedDate, {color: colors.black}]}>
                  {range}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Modal> */}
    </ScrollView>
  );
};

export default BMICalculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoView: {
    backgroundColor: colors.primary50,
    borderColor: colors.primary100,
    borderWidth: 1,
    borderRadius: normalize(10),
    padding: wp(2),
    position: 'absolute',
    right: 0,
    top: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginTop: hp(1),
    color: colors.neutralDark,
  },
  calculateBtn: {
    backgroundColor: colors.primary,
    borderRadius: normalize(8),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
    width: '47%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(0.5),
  },
  selectedDate: {
    fontSize: normalize(16),
    color: colors.primaryBlue,
    marginLeft: wp(1.5),
    textAlign: 'right',
  },
  badge: {
    width: hp(1.5),
    height: hp(1.5),
    borderRadius: hp(1.5) / 2,
    backgroundColor: colors.primaryBlue,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: hp(2.6),
    height: hp(2.6),
    borderRadius: hp(1.5),
    borderWidth: 2,
    borderColor: colors.neutral40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  innerCircle: {
    width: hp(1.6),
    height: hp(1.6),
    borderRadius: hp(0.8),
    backgroundColor: colors.primary,
  },
  radioText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: colors.black2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    marginHorizontal: wp(6),
    borderRadius: normalize(10),
    justifyContent: 'center',
  },
  resultText: {
    fontSize: normalize(18),
    textAlign: 'center',
    marginBottom: hp(2),
    fontWeight: 'bold',
    marginTop: hp(1),
  },
  menuItem: {
    height: hp(4),
  },
  menuView: {
    backgroundColor: colors.primary,
    borderRadius: normalize(8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    height: isAndroid ? hp(6.2) : hp(5.7),
    // flex: 1,
  },
  menuItemContent: {
    backgroundColor: colors.white,
    marginTop: hp(7),
    width: wp(20),
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
