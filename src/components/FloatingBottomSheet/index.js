import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {IconButton, TextInput} from 'react-native-paper';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';

const FloatBottomSheet = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        props.bottomSheetPress();
      }}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        ...props.containerStyle,
      }}>
      <TextInput
        ref={props.ref}
        mode="outlined"
        // dense={true}
        label={props.label}
        placeholder={props.label}
        value={props.value?.length == 0 ? null : props.value}
        keyboardType={'numeric'}
        returnKeyType="done"
        editable={false}
        pointerEvents="none"
        outlineColor={colors.neutral20}
        activeOutlineColor={colors.primary}
        contentStyle={props.contentStyle}
        style={{
          width: '100%',
          ...props.inputStyle,
        }}
        theme={{
          roundness: normalize(10),
          // colors: {
          //   background: colors.white,
          //   placeholder: props.value.length > 0 ? colors.primary : colors.black,
          // },
          // fonts: {medium: {fontWeight: '700'}},
        }}
      />
      {props.icon ? (
        props.icon
      ) : (
        <IconButton
          color={colors.neutralDark}
          icon={'chevron-down'}
          size={wp(8)}
          style={{left: wp(-14), top: hp(0.5)}}
        />
      )}
    </TouchableOpacity>
  );
};

export default FloatBottomSheet;

const styles = StyleSheet.create({});
