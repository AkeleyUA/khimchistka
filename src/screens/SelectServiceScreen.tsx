import {StackNavigationProp} from '@react-navigation/stack';
import React, {FC, ReactElement, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ExecutorContext} from '../contexts/ExecutorContext';
import {UserContext} from '../contexts/UserContext';

type Props = {
  route: any;
  navigation: any;
};

const SelectServiceScreen: FC<Props> = ({route, navigation}) => {
  const current: string = route.params;

  const {user} = useContext(UserContext);
  const {executors} = useContext(ExecutorContext);

  const goToBuy = (service: string) => {
    navigation.navigate('PreOrder', {current, currentService: service});
  };

  const data = executors.find((exec) => exec._id === current);

  const userHasMoney = (price: number) => {
    return price && user ? price > user?.credits : false;
  };

  const sectionPhotos = {
    title: 'Photos',
    data: data?.images ? data.images : ([] as string[]),
    renderItem: ({item}: {item: string}) => (
      <FastImage
        source={{uri: item}}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />
    ),
  };

  type serviceType = {
    name: string;
    price: number;
  };

  const sectionServices = {
    title: 'Services',
    data: data?.serviceTypes ? data.serviceTypes : ([] as serviceType[]),
    renderItem: ({item}: {item: serviceType}) => (
      <View style={styles.row}>
        <Text style={styles.serviceName}>{item?.name ? item.name : ''}</Text>
        <Button
          color="green"
          disabled={item ? userHasMoney(item.price) : false}
          title={`${item?.price ? item.price : 0} $`}
          onPress={() => goToBuy(item.name)}
        />
      </View>
    ),
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.header}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{data?.name}</Text>
          <Text style={styles.description}>{data?.description}</Text>
        </View>
        <Text>Balanse: {user?.credits ? user.credits : 0} $</Text>
      </View>
      <SectionList
        stickySectionHeadersEnabled
        renderSectionHeader={({section}) => (
          <Text style={styles.headerText}>
            {section?.title ? section.title : ''}
          </Text>
        )}
        sections={[sectionServices, sectionPhotos]}
        keyExtractor={(_item, index) => String(index)}
      />
    </View>
  );
};

export default SelectServiceScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: {
    paddingHorizontal: 5,
  },
  description: {},
  closeButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    margin: 10,
    width: Dimensions.get('window').width - 30,
    height: Dimensions.get('window').width - 30,
  },
  headerText: {
    padding: 10,
    backgroundColor: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  serviceName: {
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    color: 'darkgreen',
  },
  modalContainer: {
    paddingHorizontal: 5,
    height: Dimensions.get('window').height,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'green',
    width: '100%',
  },
  orderText: {
    borderBottomWidth: 1,
    borderColor: 'green',
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 15,
    backgroundColor: '#cecece',
  },
  bottomButton: {
    marginTop: 'auto',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
