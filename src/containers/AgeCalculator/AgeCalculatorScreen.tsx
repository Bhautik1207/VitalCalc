import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker, {getDefaultStyles} from 'react-native-ui-datepicker';
import moment from 'moment';
import {TextInput} from 'react-native-paper';
import MaskInput from 'react-native-mask-input';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';

const AgeCalculatorScreen = (props: any) => {
  const today = moment().format('DD-MM-YYYY');
  const [birthDate, setBirthDate] = useState(today);
  const [todayDate, setTodayDate] = useState(today);
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
    if (!birthDate || !todayDate) return;

    const bDate = moment(birthDate, 'DD-MM-YYYY').startOf('day');
    const targetDate = moment(todayDate, 'DD-MM-YYYY').startOf('day');

    if (!bDate.isValid()) {
      Alert.alert(
        'Invalid Date of Birth',
        'Please enter a valid date of birth.',
      );
      return;
    }

    if (!targetDate.isValid()) {
      Alert.alert("Invalid Today's Date", "Please enter a valid today's date.");
      return;
    }

    console.log('birthDate: ', birthDate, todayDate);
    console.log('targetDate: ', bDate, targetDate);

    if (targetDate.isBefore(bDate)) {
      Alert.alert(
        'Invalid Date',
        'Age at Date must be after the Date of Birth.',
      );
      return;
    }

    const tempDate = bDate.clone();

    const years = targetDate.diff(tempDate, 'years');
    tempDate.add(years, 'years');
    const months = targetDate.diff(tempDate, 'months');
    tempDate.add(months, 'months');
    const days = targetDate.diff(tempDate, 'days');

    const totalDays = targetDate.diff(bDate, 'days');
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    console.log(`Age: ${years} years, ${months} months, ${days} days`);
    console.log(
      `Total Days: ${totalDays}, Weeks: ${totalWeeks} + ${remainingDays} days`,
    );
    console.log(
      `Total Hours: ${totalHours}, Minutes: ${totalMinutes}, Seconds: ${totalSeconds}`,
    );

    setAgeYears(years);
    setAgeMonths(months);
    setAgeDays(days);
    setTotalDays(totalDays);
    setTotalHours(totalHours);
    setTotalMinutes(totalMinutes);
    setTotalSeconds(totalSeconds);
  };

  const resetValues = () => {
    setBirthDate(today);
    setTodayDate(today);
    setAgeYears('0');
    setAgeMonths('0');
    setAgeDays('0');
    setTotalDays('0');
    setTotalHours('0');
    setTotalMinutes('0');
    setTotalSeconds('0');
  };

  const cleanDate = (masked: string, type: 'birthDay' | 'today') => {
    let parts = masked.split('-');
    let day = parts[0] || '';
    let month = parts[1] || '';
    let year = parts[2] || '';

    if (day.length === 2 && (parseInt(day) < 1 || parseInt(day) > 31)) {
      day = day.slice(0, 1);
    }

    if (month.length === 2 && (parseInt(month) < 1 || parseInt(month) > 12)) {
      month = month.slice(0, 1);
    }

    if (year.length === 4 && (parseInt(year) < 1900 || parseInt(year) > 2099)) {
      year = year.slice(0, 3);
    }

    const newDate = [day, month, year].filter(Boolean).join('-');

    type === 'birthDay' ? setBirthDate(newDate) : setTodayDate(newDate);
  };

  const handleDateSelect = ({date}: any) => {
    console.log('date: ', date);
    const formattedDate = moment(date).format('DD-MM-YYYY');
    console.log('formattedDate: ', formattedDate);
    if (type === 'birthDay') {
      setBirthDate(formattedDate);
    } else {
      setTodayDate(formattedDate);
    }
    setShowPicker(false);
  };

  const getParsedDate = (dateString: string) => {
    const parsedDate = moment(dateString, 'DD-MM-YYYY', true);
    return parsedDate.isValid() ? parsedDate.toDate() : new Date();
  };

  const renderDatePicker = (label: string, date: any, type: string) => (
    <View
      style={{
        marginBottom: hp(1.5),
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TextInput
        label={label}
        value={date}
        placeholder="DD-MM-YYYY"
        placeholderTextColor={colors.neutral40}
        mode="outlined"
        outlineColor={colors.neutral20}
        activeOutlineColor={colors.primary}
        outlineStyle={{borderWidth: 1}}
        textColor={colors.neutralDark}
        style={{
          width: '100%',
          backgroundColor: colors.white,
        }}
        render={props => (
          <MaskInput
            {...props}
            keyboardType="number-pad"
            placeholder="DD-MM-YYYY"
            mask={[/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            onChangeText={masked => cleanDate(masked, type)}
            returnKeyType="done"
            placeholderTextColor={colors.neutral40}
          />
        )}
      />
      <TouchableOpacity
        style={{left: wp(-12), top: hp(0.5), padding: wp(2)}}
        onPress={() => {
          console.log('type: ', type);
          setType(type);
          setShowPicker(true);
        }}>
        <SvgIcons.Calendar width={wp(6)} height={wp(6)} />
      </TouchableOpacity>
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
        {renderDatePicker("Today's Date", todayDate, 'today')}
        {renderDatePicker('Date of Birth', birthDate, 'birthDay')}

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
                date={getParsedDate(
                  type === 'birthDay' ? birthDate : todayDate,
                )}
                onChange={handleDateSelect}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
