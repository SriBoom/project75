import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import db from '../config';

export default class WriteStoryScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
          allStory:[],
          search:''
        }
      }

      retriveStories = async()=>{
        var text = this.state.search.toUpperCase();
        var enteredText = text.split("")

            if(enteredText[0].toUpperCase()==='T'){
                const query = await db.collection("stories").where('title','==',text).limit(10).get()
                query.docs.map((doc)=>{
                    this.setState({
                    allStory: [...this.state.allStory, doc.data()]
                })
            })} 
            else if(enteredText[0].toUpperCase()==='N'){
                 const query=await db.collection('stories').where('author','==',text).limit(10).get()
                 query.docs.map((doc)=>{
                     this.setState({
                         allStory:[...this.state.allStory,doc.data()]
                     })
            })}
      }
      
      searchFilter=async(text)=>{
        var enteredText = text.split("")

        if(enteredText[0].toUpperCase()==='T'){
            const query = await db.collection("stories").where('title','==',text).get()
            query.docs.map((doc)=>{
                this.setState({
                allStory: [...this.state.allStory, doc.data()]
            })
        })} 
        else if(enteredText[0].toUpperCase()==='N'){
             const query=await db.collection('stories').where('author','==',text).get()
             query.docs.map((doc)=>{
                 this.setState({
                     allStory:[...this.state.allStory,doc.data()]
                 })
        })}
      }

      componentDidMount=async()=>{
        const query=await db.collection("stories").limit(10).get()
        query.docs.map(()=>{
          this.setState({
            allStory:[],
          })
        })
      }

    render(){
        return(
            <SafeAreaProvider>
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <TextInput 
                         style ={styles.box}
                         placeholder = "Search Story"
                         onChangeText={(text)=>{this.setState({search:text})}}/>
                    <TouchableOpacity
                        style = {styles.searchBox}
                        onPress={()=>{this.searchFilter(this.state.search)}}
                    > 
                        <Text>Search</Text>
                    </TouchableOpacity>
                </View>    
                <FlatList
                  data={this.state.allStory}
                   renderItem={({item})=>(
                    <View style={{borderBottomWidth: 2}}>
                    <Text>{"Title: " + item.title}</Text>
                    <Text>{"Author: " + item.author}</Text>
                  </View>
                  )}
                     keyExtractor= {(item, index)=> index.toString()}
                     onEndReached ={this.retriveStories}
                     onEndReachedThreshold={0.7}
        />       
            </View>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      searchBar:{
        flexDirection:'row',
        height:40,
        width:'auto',
        borderWidth:0.5,
        alignItems:'center',
        backgroundColor:'white',
    
      },
      box:{
        borderWidth:2,
        height:30,
        width:300,
        paddingLeft:10,
      },
      searchBox:{
        borderWidth:1,
        height:30,
        width:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'green'
      }
})