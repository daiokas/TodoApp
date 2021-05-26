import React, {useState, useEffect} from 'react';
import { Text, SafeAreaView, StatusBar, FlatList, View, TouchableHighlight, TouchableOpacity, StyleSheet, Button, AsyncStorage } from 'react-native';
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";

const App = () => {


  const [isVisibleCompleted, setVisibleCompleted] = useState(false);

  const [todoItems, setTodoItems] = useState([]);

  async function addTodoItem(_text) {
    let json = []
    try {
      let response = await fetch(
        'http://192.168.0.27:4000/post', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: _text,
            completed: false
          })
        }
      )
      json = await response.json()
    } catch (error) {
      console.error(error)
    }

    setTodoItems([ ...todoItems, json ])

    // await AsyncStorage.setItem('todos', JSON.stringify([...todoItems, {text: _text, completed: false}]))
    // setTodoItems([...todoItems, {text: _text, completed: false}]);
  }

  async function deleteTodoItem(_index){
    let json = []
    try {
      let response = await fetch(
        'http://192.168.0.27:4000/get'
      )
      json = await response.json()
    } catch (error) {
      console.error(error)
    }
    json.splice(_index, 1)
    console.log(json)
    setTodoItems(json)
    console.log(todoItems)

    // try {
    //   let response = await fetch(
    //     'http://192.168.0.27:4000/post', {
    //       method: 'POST',
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({json})
    //     }
    //   )
    //   json = await response.json()
    // } catch (error) {
    //   console.error(error)
    // }
    // console.log(json)
    // setTodoItems(json)
      
  }

    // let tempArr = [...todoItems];
    // tempArr.splice(_index, 1);
    // await AsyncStorage.setItem('todos', JSON.stringify(tempArr))
    // setTodoItems(tempArr)
  

  async function completeTodoItem(_index){
    let tempArr = [...todoItems];
    tempArr[_index].completed = true;
    await AsyncStorage.setItem('todos', JSON.stringify(tempArr))
    setTodoItems(tempArr)
  }

  async function deleteAllCompleted() {
    let tempArr = [...todoItems.filter((item) => !item.completed)]
    await AsyncStorage.setItem('todos', JSON.stringify(tempArr))
    setTodoItems(tempArr)
  }

  async function showAll() {
    const todos = await AsyncStorage.getItem('todos')
    setTodoItems(JSON.parse(todos))
  }

  async function showActive() {
    const todos = await AsyncStorage.getItem('todos')
    let tempArr = [...todos.filter((item) => !item.completed)]
    setTodoItems(tempArr)
  }

  async function showCompleted() {
    const todos = await AsyncStorage.getItem('todos')
    let tempArr = [...todos.filter((item) => item.completed)]
    setTodoItems(tempArr)
  }

  const init = async () => {
    let json = []
    try {
      let response = await fetch(
        'http://192.168.0.27:4000/get'
      )
      json = await response.json()
    } catch (error) {
      console.error(error)
    }
    // console.log(json)
    setTodoItems(json)
    // console.log(todoItems)

    // const todos = await AsyncStorage.getItem('todos')
    // if (!todos) {
    //   return
    // }
    // setTodoItems(JSON.parse(todos))
  }

  useEffect(() => {
    init()
  }, [])

  console.log("aaaa", todoItems)

  return (
    <>
      <StatusBar barStyle={"light-content"} backgroundColor={"#212121"}/>
      <SafeAreaView style={styles.background}>
        <View style={styles.titlebar}>
          <Text style={styles.title}>todos</Text>
        </View>
        <TodoInput onPress={addTodoItem} />
        <FlatList
          data={todoItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              // <>
              //   {
              //     (!isVisibleCompleted && !item.isVisibleCompleted)  || (!isVisibleCompleted && !item.isVisibleCompleted) && (

              //     )
              //   }
              // </>
              <TodoItem
                item={item}
                deleteFunction={() => deleteTodoItem(index)}
                completeFunction={() => completeTodoItem(index)}
              />
            )
          }}
        />
        <View style={styles.controls}>
          <Text style={styles.itemsleft}>
                {todoItems.filter((item) => !item.completed).length} items left
            </Text>
            <View style={styles.switchlist}>
                <TouchableHighlight
                  onPress={() => showAll()}
                >
                    <Text>All</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => setVisibleCompleted(false)}
                >
                    <Text>Active</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => setVisibleCompleted(true)}
                >
                    <Text>Completed</Text>
                </TouchableHighlight>
            </View>
              <TouchableOpacity
                onPress={() => deleteAllCompleted()}

              >
                 {todoItems.filter((item) => item.completed).length > 0 ? (
                  <Text>Clear completed tasks</Text>
                ) : null}

              </TouchableOpacity>
              {/* <TouchableOpacity>
                <Button
                  title="Complete all"
                  onPress={() => completeTodoItem()}
                />
              </TouchableOpacity> */}
        </View>
        <View 
          style={styles.footer}
        >
          <Text>
            Double-click to edit a todo
          </Text>
          <Text>
            Created by Dai Oka
          </Text>
          <Text>
            Practice App
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center"
  }, 
  titlebar: {
    width: '100%',
    height: 70,
    backgroundColor: "#4ecdc4",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 60,
  },
  controls: {
    flexDirection: "row",
    flex: 1,
  },
  switchlist: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around"
  },
  footer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
})

export default App;