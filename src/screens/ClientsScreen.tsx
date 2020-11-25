import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {};

const ClientsScreen: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text>Clients list</Text>
    </View>
  );
};

export default ClientsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
