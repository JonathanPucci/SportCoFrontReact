import { StyleSheet } from 'react-native';
import Layout from '../../constants/Layout'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    width: Layout.window.width,

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
    marginTop: 15,
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
    height: 120,
    width: 120,
    borderWidth: 1,
    borderRadius: 60,

  },
  imageContainer : {
    alignSelf:'flex-start',
    marginLeft:30
  }
});
