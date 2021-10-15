import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Button } from 'react-native';

class App1 extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {text: 'Jim', key: '1'},
        {text: 'Jen', key: '2'},
        {text: 'Jia', key: '3'},
      ]
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputBox}
          />
          <Button title='Add'/>
        </View>
        <FlatList
          data = {this.state.data}
          renderItem = {({item}) => {
            return (
              <View style={styles.itemContainer}>
                <Text>{item.text}</Text>
                <Button title='Edit'/>
                <Button title='Delete'/>
              </View>            );
          }}
        />
      </View>
    );
  }
}

class App2 extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {text: 'Jim', key: '1'},
        {text: 'Jen', key: '2'},
        {text: 'Jia', key: '3'},
      ],
      inputText: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputBox}
            onChangeText={(text) => {
              this.setState(
                {inputText: text}
              )
            }}
            value={this.state.inputText}
          />
          <Button title='Add'
            onPress={()=>{
              this.state.data.push({
                text: this.state.inputText, 
                key: '' + this.state.data.length + 1 // not a great solution
              });
              this.setState({
                data: this.state.data
              })
            }}
          
          />
        </View>
        <FlatList
          data = {this.state.data}
          renderItem = {({item}) => {
            return (
              <View style={styles.itemContainer}>
                <Text>{item.text}</Text>
                <Button title='Edit'/>
                <Button title='Delete'/>
              </View>            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: '25%'
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  inputBox: {
    borderWidth: 2,
    borderColor: 'black',
    width: '50%',
    alignSelf: 'center'
  }, 
  inputRow: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    paddingBottom: '15%'
  }
});

//export default App1;
export default App2;
