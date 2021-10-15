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
              </View>            
            );
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
                key: '' + Math.floor(Math.random() * 10000000)
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
              </View>            
            );
          }}
        />
      </View>
    );
  }
}


class App3 extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {text: 'Jim', key: '1'},
        {text: 'Jen', key: '2'},
        {text: 'Jia', key: '3'},
      ],
      inputText: '',
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
          <Button title={'Add'}
            onPress={()=>{
              this.state.data.push({
                text: this.state.inputText, 
                key: '' + Math.floor(Math.random() * 10000000)
              });
              this.setState({
                data: this.state.data,
                inputText: ''
              })
            }}          
          />
        </View>
        <FlatList
          data = {this.state.data}
          renderItem = {({item}) => {
            return (
              <View style={styles.itemContainer}>
                <Text>
                  {item.text}  
                </Text>
                <Button title='Edit'/>
                <Button title='Delete'
                  onPress={()=> {
                    let idx = this.state.data.findIndex((elem)=>elem.key === item.key);
                    this.state.data.splice(idx, 1);
                    this.setState({
                      data: this.state.data
                    })
                  }}
                />
              </View>            
            );
          }}
        />
      </View>
    );
  }
}


class App4 extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [
        {text: 'Jim', key: '1'},
        {text: 'Jen', key: '2'},
        {text: 'Jia', key: '3'},
      ],
      inputText: '',
      mode: 'add',
      selectedItemKey: 'none'
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
          <Button title={this.state.mode === 'add'? 'Add' : 'Save'}
            onPress={()=>{

              if (this.state.mode === 'add') {
                this.state.data.push({
                  text: this.state.inputText, 
                  key: '' + Math.floor(Math.random() * 10000000)
                });
                this.setState({
                  data: this.state.data,
                  inputText: ''
                })
              } else {
                let idx = this.state.data.findIndex((elem)=>elem.key === this.state.selectedItemKey);
                this.state.data[idx].text = this.state.inputText;
                this.setState({
                  data: this.state.data,
                  inputText: '',
                  mode: 'add',
                  selectedItemKey: 'none'
                })
              }
            }}          
          />
        </View>
        <FlatList
          data = {this.state.data}
          renderItem = {({item}) => {
            return (
              <View style={styles.itemContainer}>
                <Text style={this.state.selectedItemKey === item.key ? 
                    {color: 'red'}: {}}>
                  {item.text}  
                </Text>
                <Button title='Edit'
                  onPress={()=>{
                    this.setState({
                      selectedItemKey: item.key,
                      mode: 'edit',
                      inputText: item.text
                    })
                  }}
                
                />
                <Button title='Delete'
                  onPress={()=> {
                    let idx = this.state.data.findIndex((elem)=>elem.key === item.key);
                    this.state.data.splice(idx, 1);
                    this.setState({
                      data: this.state.data
                    })
                  }}
                />
              </View>            
            );
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
//export default App2;
//export default App3;
export default App4;
