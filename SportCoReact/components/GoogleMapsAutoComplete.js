
import PlacesInput from 'react-native-places-input';
import * as React from 'react';
import { Icon } from 'react-native-elements';
import { Keyboard} from 'react-native';

import {GOOGLE_PLACES_API_KEY} from "../credentials"

export class GoogleMapsAutoComplete extends React.Component {

    render() {
        return (
            <PlacesInput
                googleApiKey={GOOGLE_PLACES_API_KEY}
                placeHolder={"Search for a place, address, city,..."}
                language={"en-US"}
                onSelect={place => {
                    Keyboard.dismiss();
                    this.props.handler(place.result.geometry.location.lat,place.result.geometry.location.lng)

                }}
                iconResult={<Icon name="md-pin" type='ionicon' size={15}  />}
                stylesContainer={this.props.stylesContainer}
                stylesInput={this.props.stylesInput}
            />)
    }


}