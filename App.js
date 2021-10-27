import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Button } from 'react-native';

function App1 () { // version with Hooks

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

export default App1;

