import {
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker, {getDefaultStyles} from 'react-native-ui-datepicker';
import moment from 'moment';
import {hp, isAndroid, normalize, wp} from '../../styles/responsiveScreen';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import FloatBottomSheet from '../../components/FloatingBottomSheet';

const AgeCalculatorScreen = (props: any) => {
  const [birthdate, setBirthDate] = useState<Date | null>(new Date());
  const [todayDate, setTodayDate] = useState<Date | null>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [type, setType] = useState('');
  const [ageYears, setAgeYears] = useState<any>('0');
  const [ageMonths, setAgeMonths] = useState<any>('0');
  const [totalDays, setTotalDays] = useState<any>('0');
  const [ageDays, setAgeDays] = useState<any>('0');
  const [totalHours, setTotalHours] = useState<any>('0');
  const [totalMinutes, setTotalMinutes] = useState<any>('0');
  const [totalSeconds, setTotalSeconds] = useState<any>('0');

  const calculateAge = () => {
    if (!birthdate || !todayDate) return;

    const birthDate = moment(birthdate).startOf('day');
    const targetDate = moment(todayDate).startOf('day');

    if (!birthDate.isValid() || !targetDate.isValid()) return;

    if (targetDate.isBefore(birthDate)) {
      Alert.alert(
        'Invalid Date',
        'Age at Date must be after the Date of Birth.',
      );
      return;
    }

    const years = targetDate.diff(birthDate, 'years');
    birthDate.add(years, 'years');
    const months = targetDate.diff(birthDate, 'months');
    birthDate.add(months, 'months');
    const days = targetDate.diff(birthDate, 'days');

    const totalMonths = targetDate.diff(moment(birthdate), 'months');
    const totalDays = targetDate.diff(moment(birthdate), 'days');
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    setAgeYears(years);
    setAgeMonths(months);
    setAgeDays(days);
    setTotalDays(totalDays);
    setTotalHours(totalHours);
    setTotalMinutes(totalMinutes);
    setTotalSeconds(totalSeconds);
  };

  const resetValues = () => {
    setBirthDate(new Date());
    setTodayDate(new Date());
    setAgeYears('0');
    setAgeMonths('0');
    setAgeDays('0');
    setTotalDays('0');
    setTotalHours('0');
    setTotalMinutes('0');
    setTotalSeconds('0');
  };

  const renderDatePicker = (label: string, date: any, type: string) => (
    <View style={{marginBottom: hp(1.5)}}>
      <FloatBottomSheet
        value={moment(date).format('DD - MM - YYYY')}
        label={label}
        bottomSheetPress={() => {
          setType(type);
          setShowPicker(true);
        }}
        icon={
          <SvgIcons.Calendar
            width={wp(6)}
            height={wp(6)}
            style={{left: wp(-10), top: hp(0.5)}}
          />
        }
        inputStyle={{backgroundColor: colors.white}}
        contentStyle={{marginLeft: isAndroid ? wp(4) : 0, color: colors.black}}
      />
    </View>
  );

  const renderAgeBox = (label: string, value: number) => (
    <View style={styles.squareBox}>
      <Text
        style={[
          styles.title,
          {color: colors.primary, fontSize: normalize(18)},
        ]}>
        {value}
      </Text>
      <Text style={[styles.label]}>{label}</Text>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={{marginHorizontal: wp(4)}}>
        {renderDatePicker('Date of Birth', birthdate, 'birthDay')}
        {renderDatePicker('Age at the Date of', todayDate, 'today')}

        <View style={[styles.rowContainer, {marginTop: hp(1)}]}>
          <TouchableOpacity style={styles.calculateBtn} onPress={calculateAge}>
            <Text style={[styles.title, {color: 'white'}]}>Calculate Age</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.calculateBtn, {width: '14%'}]}
            onPress={resetValues}>
            <SvgIcons.Reset />
          </TouchableOpacity>
        </View>
        {!(ageMonths == 0 && ageYears == 0) && (
          <View style={styles.squareBoxContainer}>
            {renderAgeBox('Years', ageYears)}
            {renderAgeBox('Months', ageMonths)}
            {renderAgeBox('Days', ageDays)}
          </View>
        )}

        <View style={styles.cardContainer}>
          <View style={{paddingHorizontal: wp(4), paddingVertical: hp(1.5)}}>
            <Text style={styles.title}>Age Details</Text>
          </View>
          <View
            style={{borderBottomWidth: 1, borderBottomColor: colors.neutral20}}
          />
          <View style={{paddingHorizontal: wp(4), paddingVertical: hp(0.5)}}>
            {[
              {label: 'Total Days', value: totalDays},
              {label: 'Total Hours', value: totalHours},
              {label: 'Total Minutes', value: totalMinutes},
              {label: 'Total Seconds', value: totalSeconds},
            ].map(({label, value}, index) => (
              <View key={index} style={styles.ageDetails}>
                <Text style={styles.label}>{label}</Text>
                <Text
                  style={[styles.label, {fontWeight: 'bold', color: 'black'}]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <Modal transparent visible={showPicker} animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <DateTimePicker
                mode="single"
                date={type === 'birthDay' ? birthdate : todayDate}
                onChange={({date}: any) => {
                  type === 'birthDay' ? setBirthDate(date) : setTodayDate(date);
                  setShowPicker(false);
                }}
                components={{
                  IconPrev: (
                    <Image
                      source={require('../../assets/images/Icon.png')}
                      style={{
                        width: wp(7),
                        height: wp(7),
                        resizeMode: 'contain',
                      }}
                    />
                  ),
                  IconNext: (
                    <Image
                      source={require('../../assets/images/Icon.png')}
                      style={{
                        width: wp(7),
                        height: wp(7),
                        resizeMode: 'contain',
                        transform: [{rotate: '180deg'}],
                      }}
                    />
                  ),
                }}
                styles={{
                  ...getDefaultStyles,
                  today: {
                    borderColor: colors.primary,
                    fontWeight: 'bold',
                    color: colors.primary,
                  },
                  selected: {
                    backgroundColor: colors.primary,
                    borderRadius: normalize(100),
                  },
                  selected_label: {color: 'white'},
                }}
              />
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowPicker(false)}>
                <Text style={[styles.title, {color: 'white'}]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default AgeCalculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    marginTop: hp(1.5),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 5,
  },
  label: {
    fontSize: normalize(14),
    color: colors.neutral30,
    fontWeight: '500',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: wp(4),
    marginHorizontal: wp(5),
    height: '60%',
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1),
    backgroundColor: colors.white,
    padding: wp(3),
    borderRadius: normalize(5),
  },
  title: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: colors.neutralDark,
  },
  calculateBtn: {
    backgroundColor: colors.primary,
    borderRadius: normalize(10),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    // marginTop: hp(2),
    marginBottom: hp(1),
    width: '81%',
  },
  ageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  squareBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
    marginTop: hp(1),
  },
  squareBox: {
    width: wp(26),
    height: wp(16),
    backgroundColor: colors.primary50,
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    height: hp(5),
    backgroundColor: colors.primary,
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
    paddingHorizontal: wp(4),
  },
});
