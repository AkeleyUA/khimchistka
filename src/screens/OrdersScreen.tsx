import React, {FC, useContext, useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {OrdersContext} from '../contexts/OrdersContext';
import {UserContext} from '../contexts/UserContext';
import {OrderType} from '../hooks/useOrders';

type Props = {
  navigation: any;
};

const OrdersScreen: FC<Props> = ({navigation}) => {
  const {orders, orderLoading, getOrders, loading} = useContext(OrdersContext);
  const {user} = useContext(UserContext);

  useEffect(() => {
    getOrders();
  }, []);

  const toCurrentOreder = (item: OrderType) => {
    navigation.navigate('CurrentOrder', item);
  };

  const checkStatusAdmin = (item: OrderType) => {
    switch (item.status) {
      case 0:
        return (
          <View style={styles.statusButton}>
            <Button
              title="New"
              color="green"
              onPress={() => toCurrentOreder(item)}
            />
          </View>
        );
      case 1: {
        return (
          <View style={styles.rejectedBlock}>
            <Text style={styles.inProgress}>In progress</Text>
          </View>
        );
      }
      case 2: {
        return (
          <View style={styles.rejectedBlock}>
            <Text style={styles.rejected}>Rejected</Text>
            <Text style={styles.reason}>{item?.rejectReason || ''}</Text>
          </View>
        );
      }
      case 3: {
        return (
          <View style={styles.rejectedBlock}>
            <Text style={styles.finished}>finished</Text>
          </View>
        );
      }
      default:
        <Text>{item.status}</Text>;
    }
  };

  const checkStatusUser = (item: OrderType) => {
    switch (item.status) {
      case 0:
      case 1: {
        return (
          <View style={styles.rejectedBlock}>
            <Text style={styles.inProgress}>In progress</Text>
          </View>
        );
      }
      case 2: {
        return (
          <View style={styles.rejectedBlock}>
            <Text style={styles.rejected}>Rejected</Text>
            <Text style={styles.reason}>{item?.rejectReason || ''}</Text>
          </View>
        );
      }
      case 3: {
        return (
          <View style={styles.rejectedBlock}>
            <Text style={styles.finished}>finished</Text>
          </View>
        );
      }
      default:
        <Text>{item.status}</Text>;
    }
  };

  const renderItem = ({item}: {item: OrderType}) => {
    return (
      <TouchableWithoutFeedback
        style={styles.row}
        onPress={() => toCurrentOreder(item)}>
        <View style={styles.namesBlock}>
          <Text style={styles.serviceTypeName}>{item.executor.name}</Text>
          <Text style={styles.executorName}>{item.serviceType.name}</Text>
        </View>
        <Text style={styles.price}>{item.serviceType.price} $</Text>
        {orderLoading.find((id) => id === item._id) ? (
          <View style={styles.statusButton}>
            <ActivityIndicator color="green" />
          </View>
        ) : user?.role === 'admin' ? (
          checkStatusAdmin(item)
        ) : (
          checkStatusUser(item)
        )}
      </TouchableWithoutFeedback>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="green" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>No orders yet.</Text>
        )}
      />
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  namesBlock: {
    width: Dimensions.get('window').width * 0.4,
  },
  serviceTypeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  executorName: {
    fontSize: 12,
    color: 'grey',
    fontStyle: 'italic',
  },
  rejectedText: {
    color: 'white',
  },
  statusButton: {
    width: Dimensions.get('window').width * 0.4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    marginRight: 5,
    fontSize: 10,
    color: 'grey',
    fontStyle: 'italic',
  },
  price: {
    width: Dimensions.get('window').width * 0.2,
    marginRight: 'auto',
    color: 'green',
    fontWeight: '600',
    fontSize: 16,
  },
  finished: {
    textAlign: 'right',
    color: 'green',
    textTransform: 'uppercase',
    fontWeight: '600',
    padding: 10,
  },
  rejected: {
    textAlign: 'right',
    color: '#DB4437',
    textTransform: 'uppercase',
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  inProgress: {
    textAlign: 'right',
    color: 'darkorange',
    textTransform: 'uppercase',
    fontWeight: '600',
    padding: 10,
  },
  reason: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: 'grey',
    textAlign: 'right',
    maxWidth: Dimensions.get('window').width * 0.3,
  },
  rejectedBlock: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 20,
    color: 'grey',
    fontStyle: 'italic',
  },
});
