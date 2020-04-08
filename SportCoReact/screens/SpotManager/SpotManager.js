import * as React from 'react';
import { View, RefreshControl, TextInput } from 'react-native';
import { Text, CheckBox, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { styles } from './styles'
import MapView from 'react-native-maps';
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"
import SportsAvailable from '../../components/SportsAvailable';
import { RenderSaveButton, RenderMapViewPicker, RenderOverlaySport } from '../Event/OverlaysEventEdition'
import { ScrollView } from 'react-native-gesture-handler';
import SportCoApi from '../../services/apiService';
import { connect } from 'react-redux'
import { initialZoom } from '../../screens/Search/SearchScreen';
import { EventIcon } from '../../screens/Event/Event';

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



class SpotManager extends React.Component {

    constructor() {
        super();
        this.state = {
            refreshing: false,
            loading: false,
            isPickingPlace: false,
            isEditingName: false,
            isEditing: false,
            region: {
                latitudeDelta: initialZoom.latitudeDelta,
                longitudeDelta: initialZoom.longitudeDelta
            },
            selectedSpot: null,
            selectedIndex: null,
            spots: [],
            sportsInSpotSelected: [],
            sportsAvailable: ['basket', 'tennis', 'soccer', 'futsal', 'beachvolley', 'volley', 'running', 'workout']
        }
        this.apiService = new SportCoApi();
    }

    componentDidMount() {
        navigator.geolocation.watchPosition(
            this.setCurrentPosition.bind(this),
            () => { },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }

        );
    }

    setCurrentPosition(position) {
        this.setState(
            {
                ...this.state,
                region: {
                    ...this.state.region, latitude: position.coords.latitude, longitude: position.coords.longitude
                }
            },
            this.getData.bind(this, true));
    }

    getData() {
        this.setState({ loading: true, refreshing: true, notificationHistory: [] },
            this.doGetData.bind(this));
    }

    doGetData() {
        this.apiService.getAllEntities('spots')
            .then((spotsData) => {
                this.setState({ loading: false, refreshing: false, spots: spotsData.data });
            })
            .catch((err) => {
                this.setState({ loading: false, refreshing: false });
            });
    }

    getFieldsOfSpot() {
        this.apiService.getSingleEntity('fieldspot', this.state.selectedSpot.spot_id)
            .then((spotsData) => {
                let fields = [];
                for (let index = 0; index < spotsData.data.length; index++) {
                    const field = spotsData.data[index].field;
                    fields.push(field);
                }
                this.setState({ sportsInSpotSelected: fields });
            })
            .catch((err) => {
                console.log(err)
                this.setState({ sportsInSpotSelected: [] });
            });
    }

    render() {
        let region = this.state.region;
        return (
            <KeyboardAwareScrollView>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData.bind(this)} />
                    }
                >
                    <View>
                        <GoogleMapsAutoComplete
                            handler={this.goToLocation.bind(this)}
                        />
                        {!isNaN(region.latitude) ? (
                            <MapView
                                style={styles.mapStyle}
                                showsUserLocation={true}
                                followUserLocation={true}
                                initialRegion={region}
                                provider={"google"}
                                customMapStyle={roadMapStyle}>
                                {this.state.spots.map((spot, index) => {
                                    let spotCoords = {
                                        latitude: parseFloat(spot.spot_latitude),
                                        longitude: parseFloat(spot.spot_longitude),
                                    }
                                    return (
                                        <MapView.Marker
                                            key={'markerKey' + index}
                                            coordinate={spotCoords}
                                            pinColor={this.state.selectedIndex == index ? 'blue' : 'white'}
                                            onPress={this.selectedSpot.bind(this, index)
                                            }
                                        />
                                    )
                                })

                                }
                            </MapView>
                        ) :
                            <Text>Choisissez une localisation</Text>
                        }
                    </View>
                    <RenderMapViewPicker
                        isVisible={this.state.isPickingPlace} />
                    <View>
                        {this.renderSpotSelectedInfo()}
                    </View>

                </ScrollView>
            </KeyboardAwareScrollView>)
    }

    selectedSpot(index) {
        this.setState({
            selectedSpot: this.state.spots[index],
            selectedIndex: index,
        }, this.getFieldsOfSpot.bind(this))

    }

    renderSpotSelectedInfo() {
        let spot = this.state.selectedSpot;
        if (spot == null)
            return <View />;
        return (
            <View>
                <Text style={styles.selectedTitle}>Selected Spot Informations</Text>
                {this.renderOptions()}

                {this.state.isEditing ? (
                    <Input
                        value={spot.spot_name}
                        onChangeText={this.changeName.bind(this)}
                    />
                ) : (
                        <Text h4 style={styles.spotName}>Spot Name : {spot.spot_name} </Text>
                    )}
                {this.state.sportsAvailable.map((sport, index) => {
                    return (
                        <View key={'spotfield' + index}>
                            {this.renderSportFieldAvailability(sport)}
                        </View>
                    )
                })}
                <View style={{ height: 100 }} />
            </View>
        )
    }

    changeName(text) {
        this.setState({ selectedSpot: { ...this.state.selectedSpot, spot_name: text } })
    }

    renderSportFieldAvailability(sport) {
        return (
            <View style={{ justifyContent: 'center', marginLeft: 20, flexDirection: 'row' }}>
                <Text style={{ alignSelf: 'center', textAlign: 'center' }}>{sport}</Text>
                <CheckBox
                    center
                    title='Available'
                    checked={this.state.sportsInSpotSelected.includes(sport)}
                    onPress={this.pressedSport.bind(this, sport)}
                />

            </View>
        )
    }

    pressedSport(sport) {
        if (this.state.isEditing) {
            let newsSports = this.state.sportsInSpotSelected;
            newsSports.includes(sport) ?
                newsSports.splice(newsSports.indexOf(sport), 1) :
                newsSports.push(sport);
            this.setState({ sportsInSpotSelected: newsSports });
        }
    }



    renderOptions() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, alignSelf: 'center' }}>
                <View style={{ borderRadius: 10 }} >
                    <View>
                        {this.state.isEditing ? (
                            <View style={{ flexDirection: 'row' }} >
                                <EventIcon name='check' color='green' callback={this.saveSpotInfo.bind(this)} />
                                <EventIcon name='remove' color='red' callback={this.cancel.bind(this)} />
                            </View>
                        ) : (
                                <EventIcon name='edit' callback={this.editSpot.bind(this)} />
                            )}
                    </View>
                </View>
            </View>
        )
    }

    editSpot() {
        this.setState({ isEditing: true })
    }

    cancel() {
        this.setState({ isEditing: false, sportsInSpotSelected: [], selectedSpot: null, selectedIndex: -1 });
    }

    saveSpotInfo() {
        this.apiService.editEntity('spots', this.state.selectedSpot)
            .then(() => {
                for (let index = 0; index < this.state.sportsAvailable.length; index++) {
                    const field = this.state.sportsAvailable[index];
                    if (this.state.sportsInSpotSelected.includes(field)) {
                        this.apiService.addEntity('fieldspot', { spot_id: this.state.selectedSpot.spot_id, field: field })
                        // .then(() => {
                        //     console.log(field + ' added to ' + this.state.selectedSpot.spot_id );
                        // })
                        // .catch(() => {
                        //     console.log(field + ' was already in '+ this.state.selectedSpot.spot_id );
                        // })
                    } else {
                        this.apiService.deleteEntity('fieldspot', { spot_id: this.state.selectedSpot.spot_id, field: field })
                        // .then(() => {
                        //     console.log(field + ' removed from '+ this.state.selectedSpot.spot_id );
                        // })
                        // .catch(() => {
                        //     console.log(field + ' was already out of'+ this.state.selectedSpot.spot_id );
                        // })
                    }
                }
                this.getData();
                this.setState({ isEditing: false });
            })
    }


    goToLocation(lat, lon) {
        //Only coming from autoComplete
        var coordinatesZommed = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        this.mapView.animateToRegion(coordinatesZommed, 1500);
    }
}


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(SpotManager)



/*




*/