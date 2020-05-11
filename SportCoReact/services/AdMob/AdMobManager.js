import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
import React from 'react'
import { View } from 'native-base';

export default class AdMobManager extends React.Component {


    constructor(props) {
        super(props);

        admob().setRequestConfiguration({
                // Update all future requests suitable for parental guidance
                maxAdContentRating: MaxAdContentRating.PG,

                // Indicates that you want your content treated as child-directed for purposes of COPPA.
                tagForChildDirectedTreatment: true,

                // Indicates that you want the ad request to be handled in a
                // manner suitable for users under the age of consent.
                tagForUnderAgeOfConsent: true,
            })
            .then(() => {
                // Request config successfully set!
            });

    }

    render() {
        return <View></View>
    }

}




