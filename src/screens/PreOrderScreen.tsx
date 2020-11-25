import React, {FC, useContext, useEffect, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {ActivityIndicator, Button, Text, TextInput, View} from 'react-native';
import {ExecutorContext} from '../contexts/ExecutorContext';
import {SelectServiceContext} from '../contexts/SelectServiceContext';
import {UserContext} from '../contexts/UserContext';

type Props = {
  route: any;
  navigation: any;
};

const PreOrederScreen: FC<Props> = ({route}) => {
  const {current, currentService} = route.params;
  const {executors} = useContext(ExecutorContext);
  const {user} = useContext(UserContext);
  const {createOrder, loading} = useContext(SelectServiceContext);
  const [orderData, setOrederData] = useState({
    firstName: '',
    secondName: '',
    date: new Date(),
  });

  useEffect(() => {
    if (user?.firstName && user?.secondName) {
      setOrederData((prevState) => ({
        ...prevState,
        firstName: user?.firstName!,
        secondName: user?.secondName!,
      }));
    }
  }, [user]);

  const onChange = (text: string, key: string) => {
    setOrederData((prevState) => ({...prevState, [key]: text}));
  };

  const data = executors.find((exec) => exec._id === current);
  const currentServiceData = data?.serviceTypes.find(
    (service) => service.name === currentService,
  );

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <TextInput
          clearTextOnFocus
          style={styles.input}
          value={orderData.firstName}
          onChangeText={(text) => onChange(text, 'firstName')}
          placeholder="Enter first name"
        />
        <TextInput
          clearTextOnFocus
          value={orderData.secondName}
          style={styles.input}
          onChangeText={(text) => onChange(text, 'secondName')}
          placeholder="Enter second name"
        />
        <Text style={styles.orderText}>
          Service: {currentService ? currentService : ''}
        </Text>
        <Text style={styles.orderText}>
          {' '}
          Date: {orderData.date.toLocaleDateString()}
        </Text>
        <Text style={styles.orderText}>
          Price:{' '}
          {currentServiceData ? `${currentServiceData.price} $` : `${0} $`}
        </Text>
        <Text style={styles.orderText}>
          Balanse:{' '}
          {`${
            user && currentServiceData
              ? user?.credits - currentServiceData.price
              : 0
          } $`}
        </Text>
      </View>
      <View style={styles.bottomButton}>
        {loading ? (
          <ActivityIndicator color="green" />
        ) : (
          <Button
            title="Create order"
            color="green"
            onPress={() =>
              data?._id && currentServiceData?.name && user?._id
                ? createOrder({
                    creator: {
                      id: user._id,
                      firstName: orderData.firstName,
                      secondName: orderData.secondName,
                    },
                    orderData: {
                      date: orderData.date,
                      executorId: data._id,
                      serviceType: currentServiceData.name,
                    },
                  })
                : {}
            }
          />
        )}
      </View>
    </View>
  );
};

export default PreOrederScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
