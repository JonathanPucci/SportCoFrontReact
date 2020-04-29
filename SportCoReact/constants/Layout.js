import { Dimensions, Platform } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const Layout =  {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};

export const BOTTOM_TAB_HEIGHT = (Platform.OS == 'android' ? 60 : 50);
export const TOP_NAV_BAR_HEIGHT = (Platform.OS == 'android' ? 60 : 50);
