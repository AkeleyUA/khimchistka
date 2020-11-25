import React, {FC, useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ExecutorContext} from '../contexts/ExecutorContext';

import {randomColor} from '../helpers/GetRandomColor';
import {ExecutorUpdatedType} from '../hooks/useExecutor';

type Props = {
  navigation: any;
};

const DryСleanersScreen: FC<Props> = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const {executors, getAll} = useContext(ExecutorContext);

  const refreshHandler = () => {
    setRefreshing(true);
    getAll();
    setRefreshing(false);
  };

  useEffect(() => {
    getAll();
  }, []);

  const RenderItem: FC<{item: ExecutorUpdatedType}> = ({item}) => {
    const backgroundColor = randomColor();
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('SelectService', item._id)}>
        <View style={styles.row}>
          <View style={{...styles.avatar, backgroundColor}}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            {!!item.images.length && (
              <FastImage
                style={{...styles.image}}
                source={{
                  uri: item.images[0],
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </View>
          <Text>{item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={refreshing}
        onRefresh={refreshHandler}
        data={executors}
        keyExtractor={({_id}) => _id}
        renderItem={RenderItem}
      />
    </View>
  );
};

export default DryСleanersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    display: 'flex',
    marginRight: 30,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  image: {
    position: 'absolute',
    width: 60,
    height: 60,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
    borderRadius: 50,
  },
});
