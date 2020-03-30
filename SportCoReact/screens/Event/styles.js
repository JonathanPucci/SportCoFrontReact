import { StyleSheet } from 'react-native';
import Layout from '../../constants/Layout'

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
  descriptionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleDescription: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    // textDecorationLine:"underline" 
  },
  titleDescriptionText: {
    flex: 1,
    fontSize: 15
  },
  imageSport: {
    height: 240,
    flex: 1,
    borderRadius: 20
  },
  text: {
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 1,
  },
  mapStyle: {
    height: 200,
  },
  image: {
    alignSelf: 'center',
    height: 100,
    width: 100,
    borderWidth: 1,
    borderRadius: 50,

  },
  imageContainer : {
    alignSelf:'flex-start',
    marginLeft:30
  },
  wrapperHorizontal: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    color: "black",
  },
  itemStyleHorizontal: {
    marginLeft: 10,
    marginRight: 10,
    width: 50,
    height: 50,
    paddingTop: 13,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 25
  },
  itemSelectedStyleHorizontal: {
    paddingTop: 11,
    borderWidth: 2,
    borderColor: "#DAA520"
  },
  wrapperPickerContainer: {
    margin:40,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
});
