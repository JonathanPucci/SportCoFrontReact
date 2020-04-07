import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  
    contentContainer: {
      paddingTop: 30,
    },
    welcomeContainer: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
  
    text: {
      fontSize: 17,
      color: 'rgba(96,100,109, 1)',
      lineHeight: 24,
      textAlign: 'center',
    },
    imageContainer:{
      height:200,
      width:200,
      alignSelf:'center',
      justifyContent:'center'
    },
    image:{
      height:200,
      width:200
    },
    buttonView:{
      paddingVertical: 10,
      backgroundColor: '#2089dc',
      borderRadius: 10,
      alignSelf: 'center',
      width: 150
    },
    
  });
