import React, {FC, useContext, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {ExecutorContext} from '../contexts/ExecutorContext';
import {ExecutorType} from '../hooks/useExecutor';

type Props = {
  firestStepFinish: boolean;
};

const TypesList: FC<Props> = ({firestStepFinish}) => {
  const [type, setType] = useState('');
  const {
    loading,
    createNewExecutor,
    toFirstStep,
    executor,
    add,
    deleteExe,
  } = useContext(ExecutorContext);

  const onAddType = () => {
    const find = executor.serviceTypes.find(
      (oldType: string) =>
        oldType.toLocaleLowerCase() === type.toLocaleLowerCase(),
    );
    if (find) {
      return Alert.alert('Error', 'This type already exists.');
    }
    if (type === '' && !type) {
      return Alert.alert('Error', 'Please, enter type');
    }
    add(type, 'serviceTypes');
    setType('');
  };

  const onChangeType = (text: string) => {
    setType(text);
  };

  const onDeleteType = (item: string) => deleteExe(item, 'serviceTypes');

  const onSave = () => {
    createNewExecutor();
  };

  return (
    <>
      <Text style={styles.textDivider}>
        Enter the type of service provided.
      </Text>
      <FlatList
        keyboardDismissMode="on-drag"
        removeClippedSubviews={false}
        style={styles.list}
        data={executor.serviceTypes}
        keyExtractor={(item: any, index: number) => String(index)}
        renderItem={({item}: {item: any}) => (
          <View style={styles.selectedType}>
            {console.log(item)}
            <Text style={styles.selectedTypeText}>{item}</Text>
            <Button
              color="red"
              onPress={() => onDeleteType(item)}
              title="Delete"
            />
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter service type"
        value={type}
        onChangeText={(text) => onChangeType(text)}
        editable={firestStepFinish}
      />
      <View style={styles.typeAddButton}>
        <Button title="Add" color="green" onPress={() => onAddType()} />
      </View>
      {loading ? (
        <ActivityIndicator color="green" />
      ) : (
        <View style={styles.bottomButton}>
          <Button
            title="Create"
            onPress={onSave}
            color="green"
            disabled={!executor.serviceTypes.length}
          />
          <View style={styles.backButton}>
            <Button title="Back" onPress={toFirstStep} color="lightgrey" />
          </View>
        </View>
      )}
    </>
  );
};

export default TypesList;

const styles = StyleSheet.create({
  typeAddButton: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginVertical: 10,
  },
  selectedType: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  selectedTypeText: {
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'green',
    width: '100%',
  },
  textDivider: {
    marginVertical: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  list: {
    flex: 1,
  },
  bottomButton: {
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
  },
});
