import React, {FC, useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
import {ExecutorContext} from '../contexts/ExecutorContext';
import TypesList from '../components/TypesList';
import {ExecutorType} from '../hooks/useExecutor';

type Props = {};

const CreateExecutorScreen: FC<Props> = () => {
  const {
    loading,
    saveFirstStep,
    firstStepFinish,
    executor,
    deleteExe,
    add,
    change,
  } = useContext(ExecutorContext);

  const onCreate = () => {
    const {name, description, type, images} = executor;
    if (!executor.images.length) {
      Alert.alert(
        'Need images',
        'Do you really want to create a new dry cleaner without a photo?',
        [
          {
            text: 'Yes',
            onPress: () => saveFirstStep({name, description, type, images}),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    } else {
      saveFirstStep({name, description, type, images});
    }
  };

  const onDelete = (item: string) => {
    Alert.alert('Delete?', 'You whant delete this photo', [
      {
        text: 'Yes',
        onPress: () => deleteExe(item, 'images'),
      },
      {
        text: 'No',
      },
    ]);
  };

  const onMakePhoto = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permission',
        message: 'Need permissions "Camera", "photo"',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.launchCamera(
        {storageOptions: {path: 'khimchistka'}},
        (response) => {
          console.log(response.origURL, response.uri);
          if (response?.uri) {
            add(response.uri, 'images');
          }
        },
      );
    }
  };

  const onTakeFromGallery = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Camera permission',
        message: 'Need permission',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      ImagePicker.launchImageLibrary({}, (response) => {
        console.log(response.origURL, response.uri);
        if (response?.uri) {
          if (response?.uri) {
            add(response.uri, 'images');
          }
        }
      });
    }
  };

  const checkDisagle = () =>
    executor.name === '' ||
    executor.description === '' ||
    executor.type == '' ||
    executor.name === ' ' ||
    executor.description === ' ' ||
    executor.type === ' ' ||
    loading;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={executor.name}
        placeholder="Enter the name of the dry cleaner."
        onChangeText={(text) => change(text, 'name')}
        editable={!firstStepFinish}
      />
      <TextInput
        style={styles.input}
        value={executor.description}
        onChangeText={(text) => change(text, 'description')}
        placeholder="Description"
        editable={!firstStepFinish}
      />
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={executor.type}
        onChangeText={(text) => change(text, 'type')}
        editable={!firstStepFinish}
      />
      {executor.images.length > 0 && !firstStepFinish && (
        <ScrollView
          style={styles.imageContainer}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag">
          {executor.images.map((uri: string, index: number) => (
            <View key={`${index}`}>
              <Image source={{uri}} style={styles.image} resizeMode="cover" />
              <View style={styles.absoluteButton}>
                <Button
                  onPress={() => onDelete(uri)}
                  title="Delete"
                  color="red"
                  disabled={firstStepFinish}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {firstStepFinish ? (
        <TypesList firestStepFinish={firstStepFinish} />
      ) : (
        <>
          <View style={styles.buttonGroup}>
            <Button
              title="To make a photo"
              onPress={onMakePhoto}
              color="green"
              disabled={firstStepFinish}
            />
            <Button
              title="Get from gallery"
              onPress={onTakeFromGallery}
              color="green"
              disabled={firstStepFinish}
            />
          </View>
          <View style={styles.bottomButton}>
            <Button
              title="Next"
              onPress={onCreate}
              color="green"
              disabled={checkDisagle()}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default CreateExecutorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'green',
    width: '100%',
  },
  absoluteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonGroup: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottomButton: {
    marginTop: 'auto',
    marginBottom: 10,
  },
  imageContainer: {
    width: Dimensions.get('window').width - 10,
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  image: {
    height: Dimensions.get('window').width - 10,
    width: Dimensions.get('window').width - 10,
    marginBottom: 10,
  },
});
