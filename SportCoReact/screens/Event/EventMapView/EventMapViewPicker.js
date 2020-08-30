import * as React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles'
import MapView from 'react-native-maps';
import { GoogleMapsAutoComplete } from "../../../components/GoogleMapsAutoComplete"
import SportCoApi from '../../../services/apiService';
import { translate } from '../../../App';
import { logDebugInfo } from '../Helpers';


export class MapViewSpotPicker extends React.Component {

    constructor() {
        super();
        this.state = {
            spots: [],
            markerRegion: undefined
        }
        this.apiService = new SportCoApi();
    }


    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true, refreshing: true, spots: [] },
            this.doGetData()
        );
    }

    doGetData = () => {
        let area = this.state.markerRegion == undefined ? this.props.regionPicked : this.state.markerRegion;
        this.apiService.addEntity('spots/visible', area)
            .then((spotsData) => {
                this.setState({ loading: false, refreshing: false, spots: spotsData.data.data });
            })
            .catch((err) => {
                this.setState({ loading: false, refreshing: false });
            });
    }

    goToLocation = (lat, lon) => {
        //Only coming from autoComplete
        var coordinatesZommed = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        this.mapView.animateToRegion(coordinatesZommed, 1500);
    }

    render() {
        let markerCoordinates = this.state.markerRegion == undefined ?
            { ...this.props.regionPicked } : { ...this.state.markerRegion };
        markerCoordinates.latitude = parseFloat(markerCoordinates.latitude);
        markerCoordinates.longitude = parseFloat(markerCoordinates.longitude);
        return (
            <View style={{ flex: 1 }} >
                <View style={{ flex: 1 }}>
                    {this.props.regionPicked.latitude == undefined ||
                        this.props.regionPicked.longitude == undefined ? (<View />) : (
                            <MapView
                                style={!this.props.isFromTimakaOverlay ? styles.mapStyleOverlay : styles.mapStyleTimakaOverlay}
                                initialRegion={this.props.regionPicked}
                                zoomEnabled={true}
                                followUserLocation={true}
                                showsUserLocation={true}
                                onRegionChange={(region) => {
                                    this.props.onRegionChange(region);
                                    this.setState({ markerRegion: region });
                                }}
                                onRegionChangeComplete={() => { this.getData() }}
                                onPress={() => { console.log('mappressedhere1') }}
                                ref={ref => { this.mapView = ref; }}
                            >
                                <MapView.Marker
                                    coordinate={markerCoordinates}
                                >
                                </MapView.Marker>
                                {this.state.spots.map((spot, index) => {
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
                                            pinColor={'blue'}
                                            onPress={() => {
                                                let newRegion = {
                                                    spot_id: spot.spot_id,
                                                    longitude: spot.spot_longitude,
                                                    latitude: spot.spot_latitude
                                                };
                                                this.props.onRegionChange(newRegion);
                                                if (this.props.selectedSpot != undefined)
                                                    this.props.selectedSpot(index, newRegion)
                                                this.setState({ markerRegion: newRegion });
                                            }}
                                        />
                                    )
                                })

                                }
                            </MapView>
                        )}
                    <GoogleMapsAutoComplete
                        handler={this.goToLocation}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 20 }}>{translate("Choose a spot or drag to create a new one !")}</Text>

                    </View >

                </View>
            </View >
        )
    }


}
