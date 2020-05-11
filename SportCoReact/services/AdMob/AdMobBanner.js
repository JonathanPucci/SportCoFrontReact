import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { Layout } from '../../constants/Layout';
import { View } from 'react-native';

// const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

export default function AdMobBanner(props) {

    let size = BannerAdSize.SMART_BANNER;
    return (
        <View style={props.style}>
            <BannerAd
                unitId={TestIds.BANNER}
                size={size}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
        </View>
    );
}