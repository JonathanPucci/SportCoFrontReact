import { StyleSheet } from 'react-native';
import Layout from '../../constants/Layout'

const NotificationHeight = 80;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    width: Layout.window.width,

  },
  contentContainer: {
    // marginTop: 15,
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
  notificationView: {
    height: NotificationHeight,
    width: Layout.window.width,
    borderBottomWidth:0.5,
    borderBottomColor:  '#C0C0C0'
  },
  divider: {
    marginTop:1,
    backgroundColor: '#C0C0C0',
    width: Layout.window.width,
  },
});
