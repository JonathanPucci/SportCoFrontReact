import { StyleSheet } from 'react-native';
import {Layout} from '../../constants/Layout'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    margin: 15,
    // borderColor:'green',
    // borderWidth:1
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapStyle: {
    width: Layout.window.width,
    height: Layout.window.height / 2,
  },
  markerWrap: {
    width: 40,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectedTitle: {
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 20,
    textDecorationLine: 'underline'
  },
  nameInfo:{
    flexDirection : 'row'
  },
  spotName:{
    marginLeft : 30,
    marginTop : 20,
    color : "#5E5E5E"
  }
});

