import React, {useState, useEffect} from 'react';
import { Text, SafeAreaView, StatusBar, FlatList, View, TouchableHighlight, TouchableOpacity, StyleSheet, Button, AsyncStorage } from 'react-native';
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";

const App = () => {

  const [isVisibleAll, setVisibleAll] = useState(true)

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
  }

  async function deleteTodoItem(id){
    try {
      let response = await fetch(
        `http://192.168.0.27:4000/delete?id=${id}` 
      )
    } catch (error) {
      console.error(error)
    }
    init()
  }
  
  async function completeTodoItem(id, completed){
    try {
      let response = await fetch(
        `http://192.168.0.27:4000/complete?id=${id}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            completed: !completed
          })
        } 
      )
    } catch (error) {
      console.error(error)
    }
    init()
  }

  async function deleteAllCompleted() {
    try {
      let response = await fetch(
        'http://192.168.0.27:4000/deleteall' 
      )
    } catch (error) {
      console.error(error)
    }
    init()
  }

  async function completeAll() {
    try {
      let response = await fetch(
        'http://192.168.0.27:4000/completeall'
      )
    } catch (error) {
      console.error(error)
    }
    init()
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
    setTodoItems(json)
  }

  useEffect(() => {
    init()
  }, [])


  return (
    <>
      <StatusBar barStyle={"light-content"} backgroundColor={"#212121"}/>
      <SafeAreaView style={styles.background}>
        <View style={styles.titlebar}>
          <Text style={styles.title}>todos</Text>
        </View>
        <TodoInput onPress={addTodoItem} />
        <TouchableOpacity
        
            
            onPress={() => {completeAll()}}
        >
            <Text>
              Complete all
            </Text>
        </TouchableOpacity>
        <FlatList
          data={todoItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <>
                {
                  ((!isVisibleCompleted && item.completed) || (isVisibleCompleted && !item.completed) || (isVisibleAll)) && (
                  <TodoItem
                    item={item}
                    deleteFunction={() => deleteTodoItem(item._id)}
                    completeFunction={() => completeTodoItem(item._id, item.completed)}
                  />
                  )
                }
              </>
            )
          }}
        />
        <View style={styles.controls}>
          <Text style={styles.itemsleft}>
                {todoItems.filter((item) => !item.completed).length} items left
            </Text>
            <View style={styles.switchlist}>

                <TouchableOpacity
                  onPress={() => {
                    setVisibleAll(true)
                  }}
                >
                    <Text>All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setVisibleAll(false)
                    setVisibleCompleted(true)
                  }}
                >
                    <Text>Active</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setVisibleAll(false)
                    setVisibleCompleted(false)
                  }}
                >
                    <Text>Completed</Text>
                </TouchableOpacity>

            </View>
              <TouchableOpacity
                onPress={() => deleteAllCompleted()}

              >
                 {todoItems.filter((item) => item.completed).length > 0 ? (
                  <Text>Clear completed tasks</Text>
                ) : null}

              </TouchableOpacity>
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