import * as React from 'react';
import { Text, View, TextInput } from 'react-native';
import { styles } from './styles'
import MapView from 'react-native-maps';
import { Button, Icon, Overlay } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import GoogleMapsAutoComplete from "../../components/GoogleMapsAutoComplete"
import SmoothPicker from "react-native-smooth-picker";
import Bubble from './Bubble'
import SportsAvailable from '../../components/SportsAvailable';
import SportCoApi from '../../services/apiService';

export class RenderOverlaySport extends React.Component {

    render() {
        return (
            <Overlay
                isVisible={this.props.isEditingSport}
                onBackdropPress={this.props.stopEditingSport}
            >
                <View style={styles.sports}>
                    <SportsAvailable
                        maxOne={true}
                        sportsSelected={[this.props.sport]}
                        sportsSelectedChanged={this.onSportChange.bind(this)}
                    />
                    <RenderSaveButton
                        title={`| That's better?`}
                        callback={this.props.saveSport}
                    />
                </View>
            </Overlay>
        )
    }

    onSportChange(newsports) {
        this.props.onSportChange(newsports[0]);
    }
}

export class RenderOverlayDateTimePicker extends React.Component {

    render() {
        return (
            <Overlay
                isVisible={this.props.isEditingDate}
                onBackdropPress={() => { this.props.stopEditingDate() }}
            >
                <View>
                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Date</Text>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.props.event.event.date}
                        mode={'date'}
                        is24Hour={true}
                        onChange={this.props.onDateChange}
                    />
                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Heure</Text>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.props.event.event.date}
                        mode={'time'}
                        is24Hour={true}
                        onChange={this.props.onDateTimeChange}
                    />
                    <RenderSaveButton
                        title={`| Enregister?`}
                        callback={this.props.saveDate}
                    />
                </View>
            </Overlay>
        )
    }
}

export class RenderOverlayDescription extends React.Component {
    render() {
        return (
            <Overlay
                isVisible={this.props.isEditingDescription}
                onBackdropPress={() => { this.props.stopEditingDescription() }}
            >
                <View>
                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Description</Text>
                    <View style={{
                        width: "90%",
                        borderColor: 'gray',
                        borderWidth: 1,
                        borderRadius: 20,
                        marginVertical: 30,
                        alignSelf: 'center'

                    }}>
                        <TextInput
                            style={{
                                width: "120%",
                                alignItems: 'center',
                                overflow: "hidden",
                                alignSelf: 'center'

                            }}
                            onChangeText={this.props.onDescriptionChange}
                            defaultValue={this.props.description}
                            multiline
                        />
                    </View>
                    <RenderSaveButton
                        title={`| Enregister?`}
                        callback={this.props.saveDescription}
                    />
                </View>
            </Overlay>
        )
    }
}

export class RenderOverlayMinMaxParticipants extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.event.event.participants_min != prevProps.event.event.participants_min && this.refListMin != undefined)
            this.refListMin.refs.smoothPicker.scrollToIndex({
                animated: false,
                index: this.props.event.event.participants_min,
                viewOffset: -30
            });
        if (this.props.event.event.participants_max != prevProps.event.event.participants_max && this.refListMax != undefined)
            this.refListMax.refs.smoothPicker.scrollToIndex({
                animated: false,
                index: this.props.event.event.participants_max,
                viewOffset: -30
            });
    }

    render() {
        let selectedMin = this.props.event.event.participants_min;
        let selectedMax = this.props.event.event.participants_max;
        return (
            <Overlay
                isVisible={this.props.isEditingParticipantNumbers}
                onBackdropPress={this.props.stopEditingParticipantNumbers}
            >
                <View>
                    <View style={{ margin: 20 }}>
                        <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Min</Text>
                        <View style={styles.wrapperPickerContainer}>
                            <View style={styles.wrapperHorizontal}>
                                <SmoothPicker
                                    onScrollToIndexFailed={() => { }}
                                    initialScrollToIndex={selectedMin}
                                    ref={ref => (this.refListMin = ref)}
                                    keyExtractor={(_, index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    onSelected={({ item, index }) => { this.props.onPMinChange(item, index) }}
                                    bounces={true}
                                    data={Array.from({ length: 15 }, (_, i) => 0 + i)}
                                    renderItem={({ item, index }) => (
                                        <Bubble horizontal selected={index === selectedMin} >
                                            {item}
                                        </Bubble>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ margin: 20 }}>
                        <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Max</Text>
                        <View style={styles.wrapperPickerContainer}>
                            <View style={styles.wrapperHorizontal}>
                                <SmoothPicker
                                    onScrollToIndexFailed={() => { }}
                                    initialScrollToIndex={selectedMax}
                                    ref={ref => (this.refListMax = ref)}
                                    keyExtractor={(_, index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    onSelected={({ item, index }) => { this.props.onPMaxChange(item, index) }}
                                    bounces={true}
                                    data={Array.from({ length: 15 }, (_, i) => 0 + i)}
                                    renderItem={({ item, index }) => (
                                        <Bubble horizontal selected={index === selectedMax} >
                                            {item}
                                        </Bubble>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ margin: 20 }}>
                        <RenderSaveButton
                            title={`| Enregister?`}
                            callback={this.props.saveParticipants}
                        />
                    </View>
                </View>
            </Overlay>
        )
    }
}

export class RenderMapViewSpotPicker extends React.Component {

    constructor() {
        super();
        this.state = {
            spots: []
        }
        this.apiService = new SportCoApi();
    }


    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({ loading: true, refreshing: true, spots: [] },
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

    render() {
        return (
            <Overlay isVisible={this.props.isVisible} onBackdropPress={this.props.stopEditingMapMarker} >
                <View style={{ flex: 1 }} >
                    <GoogleMapsAutoComplete
                        handler={this.goToLocation.bind(this)}
                    />
                    <View style={{ flex: 1, marginTop: 100 }}>

                        {this.props.regionPicked.latitude == undefined ||
                            this.props.regionPicked.longitude == undefined ? (<View />) : (
                                <MapView
                                    style={styles.mapStyle}
                                    initialRegion={this.props.regionPicked}
                                    zoomEnabled={true}
                                    followUserLocation={true}
                                    showsUserLocation={true}
                                    onRegionChange={(region) => {
                                        this.props.onRegionChange(region);
                                        this.setState({ markerRegion: region });
                                    }}
                                    ref={ref => { this.mapView = ref; }}
                                >
                                    <MapView.Marker
                                        coordinate={this.state.markerRegion == undefined ?
                                            this.props.regionPicked : this.state.markerRegion}
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
                                                        longitude: spot.spot_longitude,
                                                        latitude: spot.spot_latitude
                                                    };
                                                    if (this.props.selectedSpot != undefined)
                                                        this.props.selectedSpot(index)
                                                    this.props.onRegionChange(newRegion);
                                                    this.setState({ markerRegion: newRegion });
                                                }}
                                            />
                                        )
                                    })

                                    }
                                </MapView>
                            )}
                        <Text style={{ marginTop: 50, textAlign: 'center', fontSize: 20 }}>Choose a spot or drag to create a new one !</Text>

                    </View>
                    <RenderSaveButton
                        title={`| Enregistrer?`}
                        callback={this.props.saveLocation}
                    />
                </View>
            </Overlay>
        )
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

export class RenderSaveButton extends React.Component {
    render() {
        return (
            <View>
                <Button
                    buttonStyle={{ backgroundColor: 'green' }}
                    icon={
                        <Icon
                            name="check"
                            size={15}
                            color="white"
                            type='font-awesome'
                        />}
                    title={this.props.title}
                    onPress={this.props.callback} />
            </View>
        )
    }
}