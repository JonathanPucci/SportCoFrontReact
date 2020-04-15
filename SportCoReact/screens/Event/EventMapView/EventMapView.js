
import * as React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles'
import MapView from 'react-native-maps';
import { MapViewSpotPicker } from '../OverlaysEventEdition'

import { DescriptionText } from "../DescriptionText/DescriptionText";

const roadMapStyle = [
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
];


export class EventMapView extends React.Component {


    /********************************************************************************
    *************************                  ***************************************
    ********************         MAPVIEW       **********************************
    *************************                  ***************************************
    *********************************************************************************/


    render() {
        let eventData = this.props.eventData;
        let eventRegion = {
            latitude: parseFloat(eventData.spot.spot_latitude),
            longitude: parseFloat(eventData.spot.spot_longitude),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        }
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <DescriptionText title='Localisation' data={''} editing={this.props.editing} setEditingProperty={this.props.setEditingProperty} />
                    {!isNaN(eventRegion.latitude) ? (
                        <MapView
                            style={styles.mapStyle}
                            pitchEnabled={false}
                            rotateEnabled={false}
                            zoomEnabled={true}
                            scrollEnabled={false}
                            showsUserLocation={true}
                            initialRegion={eventRegion}
                            provider={"google"}
                            customMapStyle={roadMapStyle}>

                            <MapView.Marker
                                coordinate={eventRegion}
                                onPress={() => { }}
                            />
                        </MapView>
                    ) :
                        <Text>Choisissez une localisation</Text>}
                </View>
                <MapViewSpotPicker
                    isVisible={this.props.isEditingMapMarker}
                    stopEditingMapMarker={() => this.props.setEditingProperty('Localisation', false)}
                    regionPicked={!isNaN(eventRegion.latitude) ? eventRegion : this.props.regionPicked}
                    onRegionChange={(region) => { this.props.regionChanged({ regionPicked: region }) }}
                    saveLocation={() => this.props.setStateEventProperty('spot', 'WHOLE', null)}
                    selectedSpot={() => this.props.setStateEventProperty('spot', 'WHOLE', null)}
                />
            </View>
        )
    }
}
