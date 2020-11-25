import React, {
  FC,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Dialog from 'react-native-dialog';
import {OrderType} from '../hooks/useOrders';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import editSVG from '../assets/edit.svg';
import doneSVG from '../assets/done.svg';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {OrdersContext} from '../contexts/OrdersContext';
import _ from 'lodash';
import {UserContext} from '../contexts/UserContext';

type Props = {
  route: {
    params: OrderType;
  };
  navigation: any;
};

type keyType = 'firstName' | 'secondName' | 'service' | 'price';

const CurrentOrderScreen: FC<Props> = ({route, navigation}) => {
  const {params} = route;
  const [order, setOreder] = useState({
    _id: params._id,
    date: params.date,
    user: {
      _id: params.user._id,
      firstName: params.user?.firstName || '',
      secondName: params.user?.secondName || '',
      role: params.user.role,
    },
    serviceType: {
      name: params.serviceType.name,
      price: params.serviceType.price,
    },
    status: params.status === 0 ? 1 : params.status,
  });
  const [edit, setEdit] = useState(false);
  const [reason, setReason] = useState(params?.rejectReason || '');
  const [rejectDialog, setRejectDialog] = useState(false);
  const [changed, setChanged] = useState(false);
  const {changeOrder, orderLoading} = useContext(OrdersContext);
  const {user} = useContext(UserContext);
  const secondNameRef = useRef(null);
  const serviceRef = useRef(null);
  const priceRef = useRef(null);
  let cecheOrder = {
    _id: params._id,
    date: params.date,
    user: {
      _id: params.user._id,
      firstName: params.user.firstName,
      secondName: params.user.secondName,
      role: params.user.role,
    },
    serviceType: {
      name: params.serviceType.name,
      price: params.serviceType.price,
    },
    status: params.status === 0 ? 1 : params.status,
  };

  const loading = orderLoading.find((item) => item === params._id);

  useEffect(() => {
    if (params.status === 0) {
      changeOrder({...order, status: 1});
    }
  }, []);

  const toRef = (ref: MutableRefObject<null | any>) => {
    if (ref?.current) {
      ref.current.focus();
    } else {
      console.log('ref missing');
    }
  };

  useEffect(() => {
    if (!edit) {
      const isEqual = _.isEqual(cecheOrder, order);
      if (!isEqual) {
        setChanged(true);
      }
    } else {
      setChanged(false);
    }
  }, [edit]);

  // TODO: numberic input

  const onChangeNumberic = (text: string) => {
    const number = Number(text.replace(/[^0-9]/g, ''));
    setOreder((prevState) => ({
      ...prevState,
      serviceType: {...prevState.serviceType, price: +number},
    }));
  };

  const onChangeUser = (text: string, key: 'firstName' | 'secondName') => {
    setOreder((prevState) => ({
      ...prevState,
      user: {...prevState.user},
      [key]: text,
    }));
  };

  const onChangeServiceType = (text: string) => {
    setOreder((prevState) => ({
      ...prevState,
      serviceType: {...prevState.serviceType, name: text},
    }));
  };

  const onRejectConfirm = () => {
    if (reason !== '') {
      const rejectedOrder = {...order, status: 2};
      setOreder(rejectedOrder);
      changeOrder(rejectedOrder, reason);
      setReason('');
      setRejectDialog(false);
      navigation.goBack();
    }
  };

  const onUpdate = () => {
    changeOrder(order);
    cecheOrder = order;
    setChanged(false);
  };

  const onFinish = () => {
    changeOrder({...order, status: 3});
    setOreder((prevState) => ({...prevState, status: 3}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {new Date(order.date).toLocaleDateString()}
        </Text>
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEdit((prevState) => !prevState)}>
            {edit ? (
              <SvgXml xml={doneSVG} width={25} height={25} />
            ) : (
              <SvgXml xml={editSVG} width={25} height={25} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.row}>
        <Text>First name: </Text>
        <TextInput
          onChangeText={(text) => onChangeUser(text, 'firstName')}
          onSubmitEditing={() => toRef(secondNameRef)}
          returnKeyType="next"
          editable={edit}
          value={order.user.firstName}
          style={{
            ...styles.input,
            borderBottomColor: edit ? 'green' : 'transparent',
          }}
        />
      </View>

      <View style={styles.row}>
        <Text>Second name: </Text>
        <TextInput
          ref={secondNameRef}
          onSubmitEditing={() => toRef(serviceRef)}
          onChangeText={(text) => onChangeUser(text, 'secondName')}
          returnKeyType="next"
          editable={edit}
          value={order.user.secondName}
          style={{
            ...styles.input,
            borderBottomColor: edit ? 'green' : 'transparent',
          }}
        />
      </View>
      <View style={styles.row}>
        <Text>Service: </Text>
        <TextInput
          ref={serviceRef}
          onSubmitEditing={() => toRef(priceRef)}
          onChangeText={(text) => onChangeServiceType(text)}
          editable={edit}
          returnKeyType="next"
          value={order.serviceType.name}
          style={{
            ...styles.input,
            borderBottomColor: edit ? 'green' : 'transparent',
          }}
        />
      </View>
      <View style={styles.row}>
        <Text>Price: </Text>
        <TextInput
          ref={priceRef}
          onChangeText={onChangeNumberic}
          onSubmitEditing={() => setEdit(false)}
          returnKeyType="done"
          keyboardType="numeric"
          editable={edit}
          value={`${order.serviceType.price}`}
          style={{
            ...styles.input,
            borderBottomColor: edit ? 'green' : 'transparent',
          }}
        />
      </View>
      {user?.role === 'admin' ? (
        <>
          {order.status === 1 && (
            <View style={styles.bottomButton}>
              {changed ? (
                <View style={styles.buttonWrapper}>
                  {loading ? (
                    <ActivityIndicator color="blue" />
                  ) : (
                    <Button
                      disabled={!changed}
                      color="blue"
                      onPress={onUpdate}
                      title="Update"
                    />
                  )}
                </View>
              ) : (
                <>
                  <View style={styles.buttonWrapper}>
                    {loading ? (
                      <ActivityIndicator color="green" />
                    ) : (
                      <Button
                        title="finish"
                        color="green"
                        disabled={edit}
                        onPress={onFinish}
                      />
                    )}
                  </View>
                  <View style={styles.buttonWrapper}>
                    {loading ? (
                      <ActivityIndicator color="#DB4437" />
                    ) : (
                      <Button
                        title="Reject"
                        disabled={edit}
                        color="#DB4437"
                        onPress={() => setRejectDialog(true)}
                      />
                    )}
                  </View>
                </>
              )}
            </View>
          )}
        </>
      ) : (
        (order.status === 1 || order.status === 0) && (
          <View style={styles.rejectedBlock}>
            <Text style={styles.inProgress}>In progress</Text>
          </View>
        )
      )}

      {order.status === 2 && (
        <View style={styles.rejectedBlock}>
          <Text style={styles.reason}>{reason}</Text>
          <Text style={styles.rejected}>Rejected</Text>
        </View>
      )}
      {order.status === 3 && (
        <View style={styles.rejectedBlock}>
          <Text style={styles.finished}>Finished</Text>
        </View>
      )}
      <Dialog.Container visible={rejectDialog}>
        <Dialog.Title>Reject?</Dialog.Title>
        <Dialog.Description>Please tell me why?</Dialog.Description>
        <Dialog.Input
          wrapperStyle={{borderBottomWidth: 2, borderBottomColor: 'green'}}
          value={reason}
          onChangeText={(text) => setReason(text)}
        />
        <Dialog.Button
          style={styles.dialogbutton}
          label="Cancel"
          color="black"
          onPress={() => {
            setRejectDialog(false);
            setReason('');
          }}
        />
        <Dialog.Button
          style={
            reason === '' ? styles.dialogButtonDisabled : styles.dialogbutton
          }
          label="OK"
          color={reason === '' ? '#dbdbdb' : 'black'}
          disabled={reason === ''}
          onPress={onRejectConfirm}
        />
      </Dialog.Container>
    </View>
  );
};

export default CurrentOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editButton: {
    width: 35,
    height: 35,
    backgroundColor: 'lightgrey',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '60%',
  },
  space: {
    width: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bottomButton: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  dialogbutton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 10,
  },

  dialogButtonDisabled: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    marginHorizontal: 10,
  },
  rejectedBlock: {
    marginHorizontal: 10,
    marginTop: 'auto',
    alignItems: 'center',
  },
  rejected: {
    color: '#DB4437',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginVertical: 10,
  },
  finished: {
    color: 'green',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginVertical: 10,
  },
  inProgress: {
    color: 'darkorange',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginVertical: 10,
  },
  reason: {
    marginVertical: 10,
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
  },
});
