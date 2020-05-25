import { StyleSheet } from 'react-native';
import {Layout} from '../../../constants/Layout'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Layout.window.width,
    // backgroundColor: '#fafafa',
    backgroundColor: 'white',
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
    fontSize: 15,
    bottom:5
  },
  imageSport: {
    width: 180,
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
    height: 400,
    width: Layout.window.width-30,
  },
  mapStyleOverlay: {
    height: 400,
  },
  mapStyleTimakaOverlay:{
    height: Layout.window.height/2,
  },
  image: {
    alignSelf: 'center',
    height: 80,
    width: 80,
    borderWidth: 1,
    borderRadius: 40,

  },
  levelImage: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    height: 40,
    width: 40
  },
  imageParticipant: {
    alignSelf: 'center',
    height: 50,
    width: 50,
    borderWidth: 0.5,
    borderRadius: 25,
  },
  imageComment: {
    alignSelf: 'center',
    height: 30,
    width: 30,
    borderWidth: 0.5,
    borderRadius: 15,
  },
  imageContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 30
  },
  imageContainerParticipant: {
    alignSelf: 'center',
  },
  imageContainerComment: {
    alignSelf: 'center',
    top: 2
  },
  commentBloc: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    padding: 10
  },
  commentUserName: {
    fontSize: 13,
    marginLeft: 5
  },
  commentDate: {
    marginTop: 10,
    fontSize: 10,
    color: '#777'
  },
  commentInfo: {
    flexDirection: 'column'
  },
  commentText: {
    fontSize: 12,
    marginLeft: 10
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
    margin: 40,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
});
