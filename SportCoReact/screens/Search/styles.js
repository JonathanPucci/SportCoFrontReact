import Layout from '../../constants/Layout'
import {
  StyleSheet
} from "react-native";

import {CARD_HEIGHT, CARD_WIDTH} from '../../components/CardEvent'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingTop: 0,
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
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapStyle: {
    width: Layout.window.width,
    height: Layout.window.height,
  },
  searchButton:{
    position: "absolute",
    top: 70,
    left: Layout.window.width/2 - 75,
    paddingVertical: 10,
    backgroundColor:'white',
    borderRadius:10
  },
  actionButton:{
    bottom: 40,
    right: 120,
    paddingVertical: 10,
    backgroundColor:'white',
    borderRadius:10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  actionButtonItem:{
  }
});

export const markerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: Layout.window.width - CARD_WIDTH,
  },
  card: {
    padding: 0,
    elevation: 2,
    backgroundColor: "#BBB",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderRadius: 5
  },
  borderActive: {
    backgroundColor: '#FFF',
    borderWidth: 1
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
    padding: 10,

  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
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
  ring: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(59, 118, 255 , 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(59, 118, 255, 0.5)",
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    margin:20
  },
  galleryItem: {
    flex: 0.5,
  },
  emptyGalleryItem: {
    flex: 0.5,
  },
});




export const eventCalloutStyles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    width:250,
    height:150,
  },
  eventSports : {
    flex:1,
    alignItems:'center',
    flexDirection:'row'
  },
  eventSport : {
    flex:1,
    margin:10,
  },
  eventTitle:{
    alignSelf: "center"
  },
  eventDescriptionRow:{
    flexDirection:"row",
    flex:1,
  },
  eventDescription:{
    flex:1,
    paddingTop:15
  },
  eventDescriptionView:{
    flexDirection:"column",
    flex:1,
  },
  eventIcon:{
    flex:1,
    alignSelf:'flex-end'
  },
  buttonStyle:{
    alignSelf:'center',
    fontSize:20,
    textDecorationLine:'underline'
  }

});
