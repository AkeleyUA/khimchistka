import React, {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Register: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation?: ProfileScreenNavigationProp;
};
const LoginScreen: FC<Props> = ({navigation}: Props) => {
  const toRegisterHandler = () => {
    navigation?.navigate('Register');
  };

  return (
    <View>
      <Text>Sign In Screen</Text>
      <TouchableOpacity onPress={toRegisterHandler}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
