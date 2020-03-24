import {StyleSheet} from 'react-native';
import Layout from '../../constants/Layout'

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
    mapContainer : {
        flex: 1,
        backgroundColor: '#fff',
        alignItems : 'center',
        justifyContent : 'center'
    },
    mapStyle: {
      width: Layout.window.width-60,
      height: Layout.window.height -250,
    },
  });
  