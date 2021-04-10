import * as React from 'react';
import { View } from "react-native";
import FormCarousel from './FormCarousel/FormCarousel';
import { styles } from './styles'
import { newEmptyEvent } from './Event'
import Geolocation from 'react-native-geolocation-service';
import { OverlayTimaka } from '../../components/OverLayTimaka';


export default class EventCreator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventData: Object.assign({}, newEmptyEvent),
            editing: false,
            regionPicked: null,
            positionSet: false
        }
    }

    doneCreatingGoToEvent = () => {
        this.props.navigation.navigate('Event', {
            eventData: this.state.eventData
        });
    }

    componentDidMount() {
        this.watchId = Geolocation.getCurrentPosition(
            this.setCurrentPosition,
            this.setDefaultPosition,
            {
                enableHighAccuracy: true,
                timeout: 2000,
                maximumAge: 2000
            }
        );
    }

    setDefaultPosition = (err) => {
        // console.log(Platform.OS + " error going initial hardcoded")
        logDebugError("ERROR SETTING POSITION IN EVENT", err);
        this.setCurrentPosition({ coords: { latitude: 43.6, longitude: 7.1 } });
    }

    setCurrentPosition = async (position) => {
        // Geolocation.clearWatch(this.watchId);
        let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08
        };
        this.setState(
            {
                ...this.state,
                initialRegion: region,
                regionPicked: region,
                eventData: Object.assign({}, newEmptyEvent),
                positionSet: true
            }
        );
    }

    setStateEventDataProperty = async (parentProperty, property, value, dateValueIfDate = null) => {
        let newEventData = { ...this.state.eventData };
        let newValue = value;
        let newProperty = property;
        let newDate = new Date(dateValueIfDate);
        switch (property) {
            case 'fulldate':
                newValue = newDate;
                newProperty = 'date';

                break;
            case 'WHOLE':
                //Only for map picking location so far
                this.setEditingProperty('Location', false);
                newValue = {
                    ...this.state.eventData.spot,
                    spot_id: value.spot_id,
                    spot_longitude: value.longitude,
                    spot_latitude: value.latitude
                };
                break;
            default:
                break;
        }
        if (newProperty == 'WHOLE')
            newEventData = { ...newEventData, [parentProperty]: newValue };
        else
            newEventData = { ...newEventData, [parentProperty]: { ...newEventData[parentProperty], [newProperty]: newValue } };
        // console.log(newEvent + '.' + parentProperty + '.' + newProperty + '=' + newValue)
        return this.setState({ eventData: newEventData });
    }

    setEditingProperty = (property, isEditing) => {
        switch (property) {
            case 'Sport':
                this.setState({ isEditingSport: isEditing })
                break;
            case 'Date':
                this.setState({ isEditingDate: isEditing })
                this.setState({ isEditingTime: isEditing })
                break;
            case 'Time':
                this.setState({ isEditingTime: isEditing })
                break;
            case 'Min':
            case 'Participants':
            case 'Max':
                this.setState({ isEditingParticipantNumbers: isEditing })
                break;
            case 'Description':
                this.setState({ isEditingDescription: isEditing })
                break;
            case 'Level':
                this.setState({ isEditingLevel: isEditing })
                break;
            case 'Location':
                this.setState({ isEditingMapMarker: isEditing, regionPicked: this.state.initialRegion })
                break;
            case 'Visibility':
                this.setStateEventDataProperty('event', 'visibility', this.state.eventData.event.visibility == 'private' ? 'public' : 'private')
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <View
                style={styles.container}
            >
                {this.state.positionSet && (
                    <OverlayTimaka>
                        <FormCarousel
                            eventData={this.state.eventData}
                            editing={this.state.editing}
                            regionPicked={this.state.regionPicked}
                            isEditingMapMarker={true}
                            setStateEventDataProperty={this.setStateEventDataProperty}
                            regionChanged={(region) => {
                                this.setState({
                                    regionPicked: region,
                                    eventData: {
                                        ...this.state.eventData,
                                        spot: { ...this.state.eventData.spot, spot_latitude: region.latitude, spot_longitude: region.longitude }
                                    }
                                })
                            }}
                            sport={this.state.eventData.event.sport}
                            onSportChange={(sport) => this.setStateEventDataProperty('event', 'sport', sport)}
                            saveSport={() => { this.setEditingProperty('Sport', false); }}
                            onDateChange={(d) => this.setStateEventDataProperty('event', 'fulldate', null, d)}
                            exitEventCreation={() => { this.props.navigation.goBack() }}
                            successCreation={() => { this.doneCreatingGoToEvent() }}
                        />
                    </OverlayTimaka>
                )}
            </View>
        );
    };

}