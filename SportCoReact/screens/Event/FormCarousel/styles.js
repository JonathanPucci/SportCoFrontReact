import { StyleSheet } from 'react-native';
import { Layout, BOTTOM_TAB_HEIGHT, TOP_NAV_BAR_HEIGHT } from '../../../constants/Layout';

export const FORM_PAGE_HEIGHT = Layout.window.height - TOP_NAV_BAR_HEIGHT;
export const FORM_PAGE_WIDTH =Layout.window.width - 50;
export const FORM_BORDER_RADIUS = 40;
export const TITLE_HEIGHT = 60;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
  },

  text: {
    fontSize: 17,
  },
  imageContainer: {
    height: 200,
  },
  image: {
    height: 200,
  },
  buttonView: {
    paddingVertical: 10,

  },

});
