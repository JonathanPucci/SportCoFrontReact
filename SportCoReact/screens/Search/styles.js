import { Layout, BOTTOM_TAB_HEIGHT, TOP_NAV_BAR_HEIGHT } from '../../constants/Layout'
import {
  StyleSheet
} from "react-native";

import { CARD_HEIGHT, CARD_WIDTH } from '../../components/CardEvent'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentContainer: {
    flex : 1,
    paddingTop: 0
  },
  text: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  mapContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: Layout.window.width,
    height: Layout.window.height - BOTTOM_TAB_HEIGHT - TOP_NAV_BAR_HEIGHT,
  },
  mapStyle: {
    width: Layout.window.width,
    height: Layout.window.height - BOTTOM_TAB_HEIGHT - TOP_NAV_BAR_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchButton: {
    position: "absolute",
    top: 70,
    alignSelf: 'center',
    borderRadius: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  sports: {
    flex: 1
  },
  actionButton: {
    position: 'absolute',
    right: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 50,
    height: 50,
    justifyContent: 'center'
  },
  overlay:{
    width : Layout.window.width-20,
    height : Layout.window.height-70,
  },
  textInputFilter: {
      top : 4,
      textAlign: 'center',
      height : 40,
  },
  inputView: {
      width: '90%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 20,
      marginVertical: 30,
      justifyContent : 'center',
      alignSelf: 'center'
  },

});

export const markerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 10,
    elevation: 2,
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
    width: 43,
    height: 100,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ring: {
    width: 10,
    height: 10,
    bottom: 0,
    borderRadius: 5,
    backgroundColor: "rgba(59, 118, 255 , 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(59, 118, 255, 0.5)",
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    margin: 20
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
    width: 250,
    height: 150,
  },
  eventSports: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20
  },
  eventSport: {
    marginLeft: 10,
  },
  eventTitle: {
    alignSelf: "center",
    marginLeft: 50
  },
  eventDescriptionRow: {
    flexDirection: "row",
    flex: 1,
  },
  eventDescription: {
    flex: 1,
    paddingTop: 5
  },
  eventDescriptionView: {
    flexDirection: "column",
    flex: 1,
  },
  eventIcon: {
    flex: 1,
    alignSelf: 'flex-end'
  },
  buttonStyle: {
    alignSelf: 'center',
    fontSize: 20,
    textDecorationLine: 'underline'
  }

});
