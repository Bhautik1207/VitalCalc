import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {TabView, SceneMap} from 'react-native-tab-view';
import AgeCalculatorScreen from '../AgeCalculator/AgeCalculatorScreen';
import BMICalculatorScreen from '../BMICalculator/BMICalculatorScreen';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';

const renderScene = SceneMap({
  ageCalculator: AgeCalculatorScreen,
  bmiCalculator: BMICalculatorScreen,
});

const HomeScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'ageCalculator', title: 'Age Calculator'},
    {key: 'bmiCalculator', title: 'BMI Calculator'},
  ]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{routes[index].title}</Text>
      </View>
      <View style={styles.tabBar}>
        {routes.map((route, i) => (
            <TouchableOpacity
              key={route.key}
              style={[styles.tabButton]}
              onPress={() => setIndex(i)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, index === i && styles.activeTabText]}>
                {route.title}
              </Text>
              <View
                style={[
                  styles.bottomBorder,
                  {backgroundColor: index === i ? colors.primary : colors.gray},
                ]}
              />
            </TouchableOpacity>
        ))}
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={() => null}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: hp(2),
  },
  headerText: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: 'black',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: normalize(10),
    marginHorizontal: wp(4),
    marginBottom: hp(1),
  },
  tabButton: {
    paddingVertical: hp(1.5),
    width: wp(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(10),
    marginHorizontal: wp(2),
  },
  tabText: {
    fontSize: normalize(16),
    color: colors.black,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  bottomBorder: {
    width: '100%',
    height: wp(1),
    backgroundColor: colors.primary,
    marginTop: hp(1.2),
  },
});
