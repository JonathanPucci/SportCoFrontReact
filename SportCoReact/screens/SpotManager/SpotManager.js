import * as React from 'react';
import { View, RefreshControl } from 'react-native';
import { Text, CheckBox, Input, Overlay } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { styles } from './styles'
import { GoogleMapsAutoComplete } from "../../components/GoogleMapsAutoComplete"
import { MapViewSpotPicker } from '../Event/EventMapView/EventMapViewPicker'
import { ScrollView } from 'react-native-gesture-handler';
import SportCoApi from '../../services/apiService';
import { connect } from 'react-redux'
import { initialZoom } from '../../screens/Search/SearchScreen';
import { OptionIcon } from '../../screens/Event/OptionIcon';
import { SpotMap } from './SpotMap';
import Geolocation from 'react-native-geolocation-service';
import { translate } from '../../App';
import { SaveButton } from '../Event/OverlaysEventEdition';
import { SPORTS } from '../../constants/DbConstants';

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
        this.watchId = Geolocation.getCurrentPosition(
            this.setCurrentPosition.bind(this),
            (err) => { console.log('setPosError'); console.log(err) },
            {
                enableHighAccuracy: true,
                timeout: 1000,
                maximumAge: 0
            }

        );
    }

    setCurrentPosition(position) {
        // Geolocation.clearWatch(this.watchId);
        this.setState(
            {
                ...this.state,
                region: {
                    ...this.state.region,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta : 0.06,
                    longitudeDelta : 0.06
                }
            }, () => {

                this.getData()
            });
    }

    getData() {
        this.setState({ loading: true, refreshing: true, spots: [] },
            this.doGetData.bind(this));
    }

    doGetData() {
        this.apiService.addEntity('spots/visible',this.state.region)
            .then((spotsData) => {
                console.log(spotsData.data.data);
                this.setState({ loading: false, refreshing: false, spots: spotsData.data.data });
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
        return (
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always'
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData.bind(this)} />
                }
            >
                <ScrollView
                    keyboardShouldPersistTaps='always'
                >
                    <View>
                        <GoogleMapsAutoComplete
                            handler={this.goToLocation.bind(this)}
                        />
                        <SpotMap
                            selectedSpot={this.selectedSpot.bind(this)}
                            selectedIndex={this.state.selectedIndex}
                            ref={(ref) => { this.spotMap = ref; }}
                            region={this.state.region}
                            spots={this.state.spots}
                        />
                        <Overlay
                            isVisible={this.state.isPickingPlace}
                            onBackdropPress={() => {
                                if (this.props.eventData.event.event_id != "")
                                    this.props.setEditingProperty('Localisation', false)
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <MapViewSpotPicker
                                    stopEditingMapMarker={() => this.setState({ isPickingPlace: false })}
                                    regionPicked={this.state.region}
                                    onRegionChange={(region) => {
                                        this.setState({
                                            region: {
                                                ...this.state.region,
                                                latitude: region.latitude,
                                                longitude: region.longitude
                                            },
                                        });
                                    }}
                                    saveLocation={this.pickedSpotCoords.bind(this)}
                                    selectedSpot={(index) => {
                                        this.setState({ isPickingPlace: false }, this.selectedSpot.bind(this, index));
                                    }}
                                />
                                <SaveButton
                                    title={`| ` + translate('Save') + `?`}
                                    callback={this.pickedSpotCoords.bind(this)}
                                />
                            </View>
                        </Overlay>

                        <View style={{ position: 'absolute', top: 70, left: 10 }}>
                            <OptionIcon name='plus' color='purple' callback={this.addNewSpot.bind(this)} />
                        </View>
                    </View>

                    <View>
                        {this.renderSpotSelectedInfo()}
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>)
    }

    renderOptions() {
        return (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, alignSelf: 'center' }}>
                <View style={{ borderRadius: 10 }} >
                    <View>
                        {this.state.isEditing ? (
                            <View style={{ flexDirection: 'row' }} >
                                <OptionIcon name='check' color='green' callback={this.saveSpotInfo.bind(this)} />
                                <OptionIcon name='remove' color='red' callback={this.cancel.bind(this)} />
                            </View>
                        ) : (
                                <OptionIcon name='edit' callback={this.editSpot.bind(this)} />
                            )}
                    </View>
                </View>
            </View>
        )
    }

    renderSpotSelectedInfo() {
        let spot = this.state.selectedSpot;
        if (spot == null)
            return (
                <View style={{ alignSelf: 'center', marginTop: 30 }}>
                    <Text style={{ fontSize: 18 }}>{translate("Select a spot or create a new one !")}</Text>
                </View>
            );
        return (
            <View>
                <Text style={styles.selectedTitle}>{translate("Selected Spot Informations")}</Text>
                {this.renderOptions()}

                {this.state.isEditing ? (
                    <Input
                        placeholder={translate("Spot Name Here")}
                        value={spot.spot_name}
                        onChangeText={this.changeName.bind(this)}
                    />
                ) : (
                        <Text h4 style={styles.spotName}>{translate("Spot Name")} : {spot.spot_name} </Text>
                    )}
                {SPORTS.map((sport, index) => {
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

    renderSportFieldAvailability(sport) {
        return (
            <View style={{ justifyContent: 'center', marginLeft: 20, flexDirection: 'row' }}>
                <Text style={{ alignSelf: 'center', textAlign: 'center' }}>{sport}</Text>
                <CheckBox
                    center
                    title={translate("Available")}
                    checked={this.state.sportsInSpotSelected.includes(sport)}
                    onPress={this.pressedSport.bind(this, sport)}
                />

            </View>
        )
    }


    pickedSpotCoords(spotSelected = undefined) {
        let region = this.state.region;
        let selectedSpot = {
            ...this.state.selectedSpot,
            spot_latitude: region.latitude,
            spot_longitude: region.longitude,
        };
        if (spotSelected.spot_name != undefined) {
            this.setState({
                selectedIndex: - 1,
                isPickingPlace: false
            });
        }
        if (spotSelected.spot_name != undefined)
            return;


        let spots = this.state.spots;
        spots[this.state.spots.length - 1] = selectedSpot;
        this.setState({
            selectedIndex: this.state.spots.length - 1,
            selectedSpot: selectedSpot,
            spots: spots,
            isPickingPlace: false
        },
            this.goToLocation.bind(this, this.state.region.latitude, this.state.region.longitude))
    }

    selectedSpot(index) {
        this.setState({
            selectedSpot: this.state.spots[index],
            selectedIndex: index,
        }, this.getFieldsOfSpot.bind(this))

    }

    addNewSpot() {
        let newSpot = {
            spot_id: -1,
            spot_name: '',
            spot_longitude: '',
            spot_latitude: ''
        };
        let spots = this.state.spots;
        spots.push(newSpot);
        this.setState({
            spots: spots,
            selectedSpot: newSpot,
            selectedIndex: spots.length - 1,
            isEditing: true,
            isPickingPlace: true,
        });
    }

    changeName(text) {
        this.setState({ selectedSpot: { ...this.state.selectedSpot, spot_name: text } })
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



    editSpot() {
        this.setState({ isEditing: true })
    }

    cancel() {
        this.setState({ isEditing: false, sportsInSpotSelected: [], selectedSpot: null, selectedIndex: -1 });
    }

    saveSpotInfo() {
        if (this.state.selectedSpot.spot_id != -1) {
            this.apiService.editEntity('spots', this.state.selectedSpot)
                .then(() => {
                    this.saveSpotFieldInfos(this.state.selectedSpot.spot_id);
                })
        } else {
            //Creating new spot
            this.apiService.addEntity('spots', this.state.selectedSpot)
                .then((data) => {
                    let spot_id = data.data.data.spot_id;
                    this.saveSpotFieldInfos(spot_id);
                });
        }
    }

    saveSpotFieldInfos(spot_id) {
        for (let index = 0; index < this.state.sportsAvailable.length; index++) {
            const field = this.state.sportsAvailable[index];
            if (this.state.sportsInSpotSelected.includes(field)) {
                this.apiService.addEntity('fieldspot', { spot_id: spot_id, field: field })
            } else {
                this.apiService.deleteEntity('fieldspot', { spot_id: spot_id, field: field })
            }
        }
        this.setState({ isEditing: false }, () => { this.getData(); });

    }


    goToLocation(lat, lon) {
        var coordinatesZommed = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        this.spotMap.mapView.animateToRegion(coordinatesZommed, 1500);
    }
}


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(SpotManager)



/*




*/