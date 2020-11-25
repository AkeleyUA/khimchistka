/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {FC, useContext, useEffect} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LoginScreen from './src/screens/LoginScreen';
import UserScreen from './src/screens/UserScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAuth} from './src/hooks/useAuth';
import {AuthContext} from './src/contexts/AuthContext';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import {UserContext} from './src/contexts/UserContext';
import {useUser} from './src/hooks/useUser';
import ClientsScreen from './src/screens/ClientsScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import CreateExecutorScreen from './src/screens/CreateExecutorScreen';
import {ExecutorContext} from './src/contexts/ExecutorContext';
import {OrdersContext} from './src/contexts/OrdersContext';
import {useExecutor} from './src/hooks/useExecutor';
import DryСleanersScreen from './src/screens/DryСleanersScreen';
import {useOrders} from './src/hooks/useOrders';
import CurrentOrderScreen from './src/screens/CurrentOrderScreen';
import {SelectServiceContext} from './src/contexts/SelectServiceContext';
import {useSelectService} from './src/hooks/useSelectService';
import SelectServiceScreen from './src/screens/SelectServiceScreen';
import PreOrederScreen from './src/screens/PreOrderScreen';

const Stack = createStackNavigator();
const HomeStack = createDrawerNavigator();
const PrivatStack = createStackNavigator();

const PrivateScreen = () => {
  const {user} = useContext(UserContext);
  return (
    <HomeStack.Navigator
      initialRouteName="DryСleaners"
      drawerContentOptions={{activeTintColor: 'green'}}
      screenOptions={{
        headerShown: true,
        unmountOnBlur: true,
      }}>
      {user?.role === 'admin' && (
        <HomeStack.Screen
          name="CreateExecutor"
          options={{title: 'Create executor'}}
          component={CreateExecutorScreen}
        />
      )}
      <HomeStack.Screen
        name="DryСleaners"
        component={DryСleanersScreen}
        options={{title: 'Dry cleaners'}}
      />
      <HomeStack.Screen name="Orders" component={OrdersScreen} />
      <HomeStack.Screen name="User" component={UserScreen} />
    </HomeStack.Navigator>
  );
};

// ? issue https://github.com/react-navigation/react-navigation/issues/6773
// ! Пока через ref

export const navigationRef = React.createRef<any>();
export const navigateWithRef = (name: string, params?: any) => {
  if (navigationRef?.current) {
    navigationRef.current.navigate(name, params);
  } else {
    Alert.alert('Faild navigate, reload app');
  }
};

const App: FC = () => {
  const auth = useAuth();
  const user = useUser();
  const executor = useExecutor();
  const orders = useOrders();
  const selectService = useSelectService();

  useEffect(() => {
    auth.checkAuth();
  }, []);

  useEffect(() => {
    if (auth.isAuth) {
      user.getUser();
    }
  }, [auth.isAuth]);

  if (auth.loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="green" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AuthContext.Provider value={auth}>
        {auth.isAuth ? (
          <UserContext.Provider value={user}>
            <ExecutorContext.Provider value={executor}>
              <OrdersContext.Provider value={orders}>
                <SelectServiceContext.Provider value={selectService}>
                  <PrivatStack.Navigator>
                    <PrivatStack.Screen
                      component={PrivateScreen}
                      options={{headerShown: false}}
                      name="Privat"
                    />
                    <PrivatStack.Screen
                      name="CurrentOrder"
                      options={{title: 'Order data'}}
                      component={CurrentOrderScreen}
                    />
                    <PrivatStack.Screen
                      name="SelectService"
                      options={{title: 'Please select service'}}
                      component={SelectServiceScreen}
                    />
                    <PrivatStack.Screen
                      name="PreOrder"
                      options={{title: 'Enter order data'}}
                      component={PreOrederScreen}
                    />
                  </PrivatStack.Navigator>
                </SelectServiceContext.Provider>
              </OrdersContext.Provider>
            </ExecutorContext.Provider>
          </UserContext.Provider>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              options={{
                title: 'Welcome to Khimchistka',
                headerTitleStyle: {textAlign: 'center'},
              }}
              component={LoginScreen}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{
                title: 'Reset password',
              }}
            />
          </Stack.Navigator>
        )}
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
