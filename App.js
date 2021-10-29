import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { firebaseConfig } from './Secrets';
import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, collection, query,
  doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc
} from "firebase/firestore";

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
}
const db = initializeFirestore(app, {
  useFetchStreams: false
});

function App1NoFirebase () { 

  const initPeopleList = [
    {firstName: 'John', lastName: 'Doe', key: '1'},
    {firstName: 'Jen', lastName: 'Buck', key: '2'},
    {firstName: 'Jia', lastName: 'Li', key: '3'},
  ];
  const [peopleList, setPeopleList] = React.useState(initPeopleList);
  const [firstNameInput, setFirstNameInput] = React.useState('');
  const [lastNameInput, setLastNameInput] = React.useState('');
  const [mode, setMode] = React.useState('add');
  const [selectedItemKey, setSelectedItemKey] = React.useState('none');

  return (
    <View style={styles.container}>

      {/* Input Header */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setFirstNameInput(text);
          }}
          value={firstNameInput}
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setLastNameInput(text);
          }}
          value={lastNameInput}
        />
        <Button title={mode === 'add'? 'Add' : 'Save'}
          onPress={()=>{
            if (mode === 'add') {
              let d = Array.from(peopleList);
              d.push({
                firstName: firstNameInput,
                lastName: lastNameInput, 
                key: '' + Math.floor(Math.random() * 10000000)
              });
              setPeopleList(d);
              setFirstNameInput('');
              setLastNameInput('');
            } else {
              let d = Array.from(peopleList);
              let idx = d.findIndex((elem)=>elem.key === selectedItemKey);
              d[idx].firstName = firstNameInput;
              d[idx].lastName = lastNameInput;
              setPeopleList(d);
              setFirstNameInput('');
              setLastNameInput('');
              setMode('add');
              setSelectedItemKey('none');
            }
          }}          
        />
      </View>

      {/* List Display */}
      <FlatList
        data = {peopleList}
        renderItem = {({item}) => {
          return (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={[
                    styles.itemText, 
                    selectedItemKey === item.key ? {color: 'red'}: {}
                  ]}>
                  {item.firstName} {item.lastName}  
                </Text>
              </View>
              <View style={styles.itemButtonContainer}>
                <Button title='Edit'
                  onPress={()=>{
                    setSelectedItemKey(item.key);
                    setFirstNameInput(item.firstName);
                    setLastNameInput(item.lastName);
                    setMode('edit');
                  }}              
                />
                <Button title='Delete'
                  onPress={()=> {
                    let d = Array.from(peopleList);
                    let idx = d.findIndex((elem)=>elem.key === item.key);
                    d.splice(idx, 1);
                    setPeopleList(d);
                  }}
                />
              </View>
            </View>            
          );
        }}
      />
    </View>
  );
}

function App2FirebaseCR () { 

  const initPeopleList = [
    {firstName: 'John', lastName: 'Doe', key: '1'},
    {firstName: 'Jen', lastName: 'Buck', key: '2'},
    {firstName: 'Jia', lastName: 'Li', key: '3'},
  ];
  const [peopleList, setPeopleList] = React.useState(initPeopleList);
  const [firstNameInput, setFirstNameInput] = React.useState('');
  const [lastNameInput, setLastNameInput] = React.useState('');
  const [mode, setMode] = React.useState('add');
  const [selectedItemKey, setSelectedItemKey] = React.useState('none');

  useEffect(()=>{
    
    // a function inside a function!
    async function loadInitList() {
      const initList = [];
      const collRef = collection(db, 'people');
      const q = query(collRef);
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((docSnapshot)=>{
        let person = docSnapshot.data();
        person.key = docSnapshot.id;
        initList.push(person);
      });
      setPeopleList(initList);
    }

    loadInitList();

  }, []);

  async function addPerson(firstName, lastName) {
    const collRef = collection(db, 'people');
    let personObj = {
      firstName: firstName, 
      lastName: lastName
    }; // leave the key out for now
    let docRef = await addDoc(collRef, personObj);
    personObj.key = docRef.id;
    let d = Array.from(peopleList);
    d.push(personObj);
    setPeopleList(d);
    setFirstNameInput('');
    setLastNameInput('');
  }

  return (
    <View style={styles.container}>

      {/* Input Header */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setFirstNameInput(text);
          }}
          value={firstNameInput}
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setLastNameInput(text);
          }}
          value={lastNameInput}
        />
        <Button title={mode === 'add'? 'Add' : 'Save'}
          onPress={()=>{
            if (mode === 'add') {
              addPerson(firstNameInput, lastNameInput);
            } else {
              let d = Array.from(peopleList);
              let idx = d.findIndex((elem)=>elem.key === selectedItemKey);
              d[idx].firstName = firstNameInput;
              d[idx].lastName = lastNameInput;
              setPeopleList(d);
              setFirstNameInput('');
              setLastNameInput('');
              setMode('add');
              setSelectedItemKey('none');
            }
          }}          
        />
      </View>

      {/* List Display */}
      <FlatList
        data = {peopleList}
        renderItem = {({item}) => {
          return (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={[
                    styles.itemText, 
                    selectedItemKey === item.key ? {color: 'red'}: {}
                  ]}>
                  {item.firstName} {item.lastName}  
                </Text>
              </View>
              <View style={styles.itemButtonContainer}>
                <Button title='Edit'
                  onPress={()=>{
                    setSelectedItemKey(item.key);
                    setFirstNameInput(item.firstName);
                    setLastNameInput(item.lastName);
                    setMode('edit');
                  }}              
                />
                <Button title='Delete'
                  onPress={()=> {
                    let d = Array.from(peopleList);
                    let idx = d.findIndex((elem)=>elem.key === item.key);
                    d.splice(idx, 1);
                    setPeopleList(d);
                  }}
                />
              </View>
            </View>            
          );
        }}
      />
    </View>
  );
}

function App3FirebaseCRD () { 

  const initPeopleList = [
    {firstName: 'John', lastName: 'Doe', key: '1'},
    {firstName: 'Jen', lastName: 'Buck', key: '2'},
    {firstName: 'Jia', lastName: 'Li', key: '3'},
  ];
  const [peopleList, setPeopleList] = React.useState(initPeopleList);
  const [firstNameInput, setFirstNameInput] = React.useState('');
  const [lastNameInput, setLastNameInput] = React.useState('');
  const [mode, setMode] = React.useState('add');
  const [selectedItemKey, setSelectedItemKey] = React.useState('none');

  useEffect(()=>{
    
    // a function inside a function!
    async function loadInitList() {
      const initList = [];
      const collRef = collection(db, 'people');
      const q = query(collRef);
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((docSnapshot)=>{
        let person = docSnapshot.data();
        person.key = docSnapshot.id;
        initList.push(person);
      });
      setPeopleList(initList);
    }

    loadInitList();

  }, []);

  async function addPerson(firstName, lastName) {
    const collRef = collection(db, 'people');
    let personObj = {
      firstName: firstName, 
      lastName: lastName
    }; // leave the key out for now
    let docRef = await addDoc(collRef, personObj);
    console.log("added person", docRef.id);
    personObj.key = docRef.id;
    let pList = Array.from(peopleList);
    setPeopleList(pList);
    pList.push(personObj);
    setFirstNameInput('');
    setLastNameInput('');
  }

  async function deletePerson(person) {
    const docRef = doc(db, "people", person.key);
    await deleteDoc(docRef);
    let pList = Array.from(peopleList);
    let idx = pList.findIndex((elem)=>elem.key === person.key);
    pList.splice(idx, 1);
    setPeopleList(pList);
  }

  return (
    <View style={styles.container}>

      {/* Input Header */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setFirstNameInput(text);
          }}
          value={firstNameInput}
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setLastNameInput(text);
          }}
          value={lastNameInput}
        />
        <Button title={mode === 'add'? 'Add' : 'Save'}
          onPress={()=>{
            if (mode === 'add') {
              addPerson(firstNameInput, lastNameInput);
            } else {
              let d = Array.from(peopleList);
              let idx = d.findIndex((elem)=>elem.key === selectedItemKey);
              d[idx].firstName = firstNameInput;
              d[idx].lastName = lastNameInput;
              setPeopleList(d);
              setFirstNameInput('');
              setLastNameInput('');
              setMode('add');
              setSelectedItemKey('none');
            }
          }}          
        />
      </View>

      {/* List Display */}
      <FlatList
        data = {peopleList}
        renderItem = {({item}) => {
          return (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={[
                    styles.itemText, 
                    selectedItemKey === item.key ? {color: 'red'}: {}
                  ]}>
                  {item.firstName} {item.lastName}  
                </Text>
              </View>
              <View style={styles.itemButtonContainer}>
                <Button title='Edit'
                  onPress={()=>{
                    setSelectedItemKey(item.key);
                    setFirstNameInput(item.firstName);
                    setLastNameInput(item.lastName);
                    setMode('edit');
                  }}              
                />
                <Button title='Delete'
                  onPress={()=> {
                    deletePerson(item);
                  }}
                />
              </View>
            </View>            
          );
        }}
      />
    </View>
  );
}

function App4FirebaseCRUD () { 

  const initPeopleList = [
    {firstName: 'John', lastName: 'Doe', key: '1'},
    {firstName: 'Jen', lastName: 'Buck', key: '2'},
    {firstName: 'Jia', lastName: 'Li', key: '3'},
  ];
  const [peopleList, setPeopleList] = React.useState(initPeopleList);
  const [firstNameInput, setFirstNameInput] = React.useState('');
  const [lastNameInput, setLastNameInput] = React.useState('');
  const [mode, setMode] = React.useState('add');
  const [selectedItemKey, setSelectedItemKey] = React.useState('none');

  useEffect(()=>{
    
    // a function inside a function!
    async function loadInitList() {
      const initList = [];
      const collRef = collection(db, 'people');
      const q = query(collRef);
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((docSnapshot)=>{
        let person = docSnapshot.data();
        person.key = docSnapshot.id;
        initList.push(person);
      });
      setPeopleList(initList);
    }

    loadInitList();

  }, []);

  async function addPerson(firstName, lastName) {
    const collRef = collection(db, 'people');
    let personObj = {
      firstName: firstName, 
      lastName: lastName
    }; // leave the key out for now
    let docRef = await addDoc(collRef, personObj);
    console.log("added person", docRef.id);
    personObj.key = docRef.id;
    let pList = Array.from(peopleList);
    setPeopleList(pList);
    pList.push(personObj);
    setFirstNameInput('');
    setLastNameInput('');
  }

  async function deletePerson(person) {
    const docRef = doc(db, "people", person.key);
    await deleteDoc(docRef);
    let pList = Array.from(peopleList);
    let idx = pList.findIndex((elem)=>elem.key === person.key);
    pList.splice(idx, 1);
    setPeopleList(pList);
  }

  async function updatePerson(key, firstName, lastName) {
    const docRef = doc(db, "people", key);
    await updateDoc(docRef, {firstName: firstName, lastName: lastName});
    let pList = Array.from(peopleList);
    let idx = pList.findIndex((elem)=>elem.key === key);
    pList[idx].firstName = firstNameInput;
    pList[idx].lastName = lastNameInput;
    setPeopleList(pList);

    // reset ui
    setFirstNameInput('');
    setLastNameInput('');
    setMode('add');
    setSelectedItemKey('none');
  }

  return (
    <View style={styles.container}>

      {/* Input Header */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setFirstNameInput(text);
          }}
          value={firstNameInput}
        />
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            setLastNameInput(text);
          }}
          value={lastNameInput}
        />
        <Button title={mode === 'add'? 'Add' : 'Save'}
          onPress={()=>{
            if (mode === 'add') {
              addPerson(firstNameInput, lastNameInput);
            } else {
              updatePerson(selectedItemKey, firstNameInput, lastNameInput);
            }
          }}          
        />
      </View>

      {/* List Display */}
      <FlatList
        data = {peopleList}
        renderItem = {({item}) => {
          return (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={[
                    styles.itemText, 
                    selectedItemKey === item.key ? {color: 'red'}: {}
                  ]}>
                  {item.firstName} {item.lastName}  
                </Text>
              </View>
              <View style={styles.itemButtonContainer}>
                <Button title='Edit'
                  onPress={()=>{
                    setSelectedItemKey(item.key);
                    setFirstNameInput(item.firstName);
                    setLastNameInput(item.lastName);
                    setMode('edit');
                  }}              
                />
                <Button title='Delete'
                  onPress={()=> {
                    deletePerson(item);
                  }}
                />
              </View>
            </View>            
          );
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: '25%'
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingBottom: '15%',
    paddingHorizontal: '3%'
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'lightgray',
    width: '30%',
    alignSelf: 'center',
    fontSize: 24
  }, 
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  itemTextContainer: {
    flex: 0.6,
    paddingLeft: '5%'
  },
  itemText: {
    fontSize: 24
  },
  itemButtonContainer: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }

});

//export default App1NoFirebase;
export default App2FirebaseCR;
//export default App3FirebaseCRD;
//export default App4FirebaseCRUD;

