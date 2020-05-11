import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from '@react-native-firebase/admob';

const adUnitId = TestIds.INTERSTITIAL;


export default function AdMobInterstitial() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
            keywords: ['sports'],
        });
        const eventListener = interstitial.onAdEvent(type => {

            if (type === AdEventType.LOADED) {
                setLoaded(true);
                interstitial.show();
            }
        });

        // Start loading the interstitial straight away
        interstitial.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, []);

    // No advert ready to show yet
    if (!loaded) {
        return null;
    }

    return (
        <View />
    );
}