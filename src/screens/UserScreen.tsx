import React, {FC, useContext} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import {UserContext} from '../contexts/UserContext';

const HomeScreen: FC = () => {
  const auth = useContext(AuthContext);
  const {user} = useContext(UserContext);

  const onLogout = () => {
    auth.logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>
          {user?.firstName || ''} {user?.secondName || ''}
        </Text>
        <Text>{user?.role || ''}</Text>
      </View>

      <Text> Balans: {user?.credits || 0} $</Text>
      <View style={styles.bottomButton}>
        <Button title="Logout" color="green" onPress={onLogout} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  bottomButton: {
    marginTop: 'auto',
    marginBottom: 15,
  },
});
