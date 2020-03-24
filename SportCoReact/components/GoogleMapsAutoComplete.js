
import PlacesInput from 'react-native-places-input';
import * as React from 'react';
import { Ionicons } from 'react-native-vector-icons';
import Credentials from "../credentials"

export default class GoogleMapsAutoComplete extends React.Component {

    render() {
        return (
            <PlacesInput
                googleApiKey={Credentials.googlePlacesApiKey}
                placeHolder={"Some Place holder"}
                language={"en-US"}
                onSelect={place => {
                    this.props.handler(place.result.geometry.location.lat,place.result.geometry.location.lng)
                }}
                iconResult={<Ionicons name="md-pin" size={15}  />}
            />)

    }
}