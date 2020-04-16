import * as React from 'react';
import { View } from 'react-native';

import { styles } from './styles'
import MapView from 'react-native-maps';
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



export class SpotMap extends React.Component {

    render() {
        let region = this.props.region;
        return (
            <View>
                {!isNaN(region.latitude) ? (
                    <MapView
                        style={styles.mapStyle}
                        ref={ref => { this.mapView = ref; }}
                        showsUserLocation={true}
                        followUserLocation={true}
                        initialRegion={region}
                        provider={"google"}
                        customMapStyle={roadMapStyle}>
                        {this.props.spots.map((spot, index) => {
                            let spotCoords = {
                                latitude: parseFloat(spot.spot_latitude),
                                longitude: parseFloat(spot.spot_longitude),
                            }
                            if (spotCoords.latitude == undefined || isNaN(spotCoords.latitude))
                                return <View key={'markerKey' + index} />
                            return (
                                <MapView.Marker
                                    key={'markerKey' + index}
                                    coordinate={spotCoords}
                                    pinColor={this.props.selectedIndex == index ? 'blue' : 'white'}
                                    onPress={() => { this.props.selectedSpot(index) }}
                                />
                            )
                        })
                        }
                    </MapView>
                ) : (<View />)
                }
            </View>
        )
    }

}


