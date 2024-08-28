import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from 'react-native';

import {fetchCharacters} from './src/api/api';

const { width } = Dimensions.get('window');

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [genderFilter, setGenderFilter] = useState<string | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);

  useEffect(() => {
    fetchFilteredCharacters();
  }, [genderFilter, statusFilter]);

  const fetchFilteredCharacters = async () => {
    setLoading(true);
    try {
      const data = await fetchCharacters(genderFilter, statusFilter);
      setCharacters(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const numColumns = 2;

  const ITEM_WIDTH = (width - 40 - (numColumns - 1) * 10) / numColumns;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rick and Morty Karakterleri</Text>

      <View style={styles.filters}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setGenderModalVisible(true)}>
          <Text>
            {genderFilter
              ? genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)
              : 'Gender'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setStatusModalVisible(true)}>
          <Text>
            {statusFilter
              ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
              : 'Status'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isGenderModalVisible}
        onRequestClose={() => setGenderModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setGenderFilter(undefined);
                setGenderModalVisible(false);
              }}>
              <Text style={styles.modalButtonText}>All</Text>
            </TouchableOpacity>
            {['male', 'female', 'genderless', 'unknown'].map(gender => (
              <TouchableOpacity
                key={gender}
                style={styles.modalButton}
                onPress={() => {
                  setGenderFilter(gender);
                  setGenderModalVisible(false);
                }}>
                <Text style={styles.modalButtonText}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setGenderModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isStatusModalVisible}
        onRequestClose={() => setStatusModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Status</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setStatusFilter(undefined);
                setStatusModalVisible(false);
              }}>
              <Text style={styles.modalButtonText}>All</Text>
            </TouchableOpacity>
            {['alive', 'dead', 'unknown'].map(status => (
              <TouchableOpacity
                key={status}
                style={styles.modalButton}
                onPress={() => {
                  setStatusFilter(status);
                  setStatusModalVisible(false);
                }}>
                <Text style={styles.modalButtonText}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setStatusModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        contentContainerStyle={{gap: 10}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={characters}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity style={[styles.item, { width: ITEM_WIDTH }]}>
            <Image style={styles.itemImage} source={{uri: item.image}}/>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemSmallText}>{item.gender}</Text>
            <Text style={[styles.itemSmallText,{color:item.status==='Dead'?'red':item.status==='Alive'?'green':'black'}]}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalButtonText: {
    fontSize: 16,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 250,
  },
  itemText: {
    fontSize: 16,
  },
  itemSmallText:{
    fontSize:12,
  },
  itemImage:{
    width:'100%',
    aspectRatio:1,
  },
});

export default App;
