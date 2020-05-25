
import * as React from 'react';

import { translate } from '../App';
import { Layout, BOTTOM_TAB_HEIGHT, TOP_NAV_BAR_HEIGHT } from '../constants/Layout';
import { View } from 'react-native';

export const OverlayTimaka = ({ children, height }) => (

    <View
        style={{
            flex : 1,
            position: 'absolute',
            elevation:2,
            zIndex : 2,
            top:0,
            right : 0,
            left : 0,
            backgroundColor: 'white',
            height: height ? height : Layout.window.height - BOTTOM_TAB_HEIGHT - TOP_NAV_BAR_HEIGHT,
            width: Layout.window.width 
        }}
    >
        {children}
    </View>
);

