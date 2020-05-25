
import * as React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles'
import MapView from 'react-native-maps';
import { MapViewSpotPicker } from './EventMapViewPicker'

import { DescriptionText } from "../DescriptionText/DescriptionText";
import { translate } from '../../../App';
import { Button, Icon, Overlay } from 'react-native-elements';
import Colors from '../../../constants/Colors';
import { SaveButton } from '../OverlaysEventEdition';

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
        };
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <DescriptionText title={translate('Location')} data={''} editing={this.props.editing} setEditingProperty={this.props.setEditingProperty} />
                    {!isNaN(eventRegion.latitude) ? (
                        <MapView
                            ref={ref => this.mapView = ref}
                            style={styles.mapStyle}
                            pitchEnabled={false}
                            rotateEnabled={false}
                            scrollEnabled={false}
                            pointerEvents='none'
                            showsUserLocation
                            zoomControlEnabled
                            showsUserLocation={true}
                            region={eventRegion}
                            provider={"google"}
                            customMapStyle={roadMapStyle}>
                            <MapView.Marker
                                coordinate={eventRegion}
                                onPress={() => { }}
                            />

                        </MapView>
                    ) :
                        <Text>{translate('Choose a location')}</Text>}
                </View>
                <Icon
                    name='add'
                    reverse
                    color={Colors.timakaColor}
                    size={30}
                    containerStyle={{
                        left: styles.mapStyle.width - 80,
                        position: 'absolute',
                        top: styles.mapStyle.width - 110
                    }}
                    onPress={() => this.zoom(true)}
                />
                <Icon
                    name='remove'
                    reverse
                    color={Colors.timakaColor}
                    size={30}
                    containerStyle={{
                        left: styles.mapStyle.width - 80,
                        position: 'absolute',
                        top: styles.mapStyle.height - 40
                    }}
                    onPress={() => this.zoom(false)}
                />
                <Overlay
                    isVisible={this.props.isEditingMapMarker}
                    onBackdropPress={() => {
                        if (this.props.eventData.event.event_id != "")
                            this.props.setEditingProperty('Localisation', false)
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <MapViewSpotPicker
                                stopEditingMapMarker={() => this.props.setEditingProperty('Localisation', false)}
                                regionPicked={!isNaN(eventRegion.latitude) ? eventRegion : this.props.regionPicked}
                                onRegionChange={(region) => { this.props.regionChanged(region) }}
                                saveLocation={(r) => this.props.setStateEventDataProperty('spot', 'WHOLE', r)}
                                selectedSpot={(i, r) => this.props.setStateEventDataProperty('spot', 'WHOLE', r)}
                            />
                        </View>
                        <SaveButton
                            title={`| ` + translate('Save') + `?`}
                            callback={() => { this.props.setStateEventDataProperty('spot', 'WHOLE', this.props.regionPicked) }}
                        />
                    </View>
                </Overlay>
            </View>
        )
    }

    zoom = (isIn) => {
        let lonD = this.props.eventData.spot.longitudeDelta;
        let latD = this.props.eventData.spot.latitudeDelta;
        let reg = { ...this.props.eventData.spot };
        reg.longitudeDelta = (isIn ? lonD / 2 : lonD * 2);
        reg.latitudeDelta = (isIn ? latD / 2 : latD * 2);
        if (reg.longitudeDelta > 0.001 && reg.latitudeDelta < 0.3)
            this.props.setStateEventDataProperty('spot', 'WHOLE', reg)
    }
}
