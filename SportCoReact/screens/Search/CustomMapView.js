import * as React from 'react';
import { View, Image, Animated } from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { styles, markerStyles, CARD_WIDTH } from './styles'
import CalloutEvent from './CalloutEvent'
import CalloutMultiEvent from './CalloutMultiEvent'
import { mapSportIcon } from '../../helpers/mapper';

export default class CustomMapView extends React.Component {

    constructor() {
        super();
        this.state = {
        }
    }

    // componentDidUpdate(props){
    // for (let index = 0; index < props.events.length; index++) {
    //     const eventData = props.events[index];
    //     eventData['cluster'] = generateCluster(eventData);
    // }
    // }

    render() {
        return (
            <MapView
                style={styles.mapStyle}
                initialRegion={this.props.region}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                followUserLocation={true}
                showsUserLocation={true}
                ref={ref => { this.mapView = ref; }}
                onRegionChange={(region) => { this.props.regionMoved(region); }}
                onPress={this.onMapPress.bind(this)}
            >
                {this.props.events != undefined && this.props.events.length != 0 && (
                    <View>
                        {this.props.events.map((event, index) => {
                            if (event == undefined || event.event == undefined) {
                                return (<View key={index} />)
                            }
                            let coordinateEvent = {
                                latitude: parseFloat(event.spot.spot_latitude),
                                longitude: parseFloat(event.spot.spot_longitude),
                            };

                            let cluster = CustomMapView.generateCluster(event, this.props.events);
                            if (cluster.isInACluster &&
                                cluster.sameEvents.findIndex((value, index) => value.event.event_id === event.event.event_id) > 0) {
                                return <View
                                    key={'marker' + index}
                                />
                            }
                            let sportIcon = this.getSportMapIcon(cluster);
                            return (
                                <Marker
                                    key={'marker' + index}
                                    coordinate={coordinateEvent}
                                    ref={(refCallout) => { this['callout' + index] = refCallout }}
                                    onPress={() => { this.pressedEvent(index) }}
                                    calloutOffset={{ x: 0, y: 20 }}
                                    calloutAnchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <View style={markerStyles.markerWrap}>
                                        <View style={markerStyles.ring} />
                                        {cluster.isInACluster ? (
                                            <Image source={require('../../assets/images/map-pointer.gif')}
                                                style={{ width: 30, height: 50, resizeMode: 'contain', bottom: -7 }}
                                            />
                                        ) : (
                                                <Image source={sportIcon}
                                                    style={{ width: 33, height: 50, resizeMode: 'stretch', bottom: 3 }}
                                                />
                                            )
                                        }
                                    </View>
                                    {cluster.isInACluster ? (
                                        <CalloutMultiEvent
                                            reloadCallout={this.state.reloadCallout}
                                            events={cluster.sameEvents}
                                            navigation={this.props.navigation}
                                            index={index} />
                                    ) : (
                                            <CalloutEvent
                                                reloadCallout={this.state.reloadCallout}
                                                navigation={this.props.navigation}
                                                event={event}
                                                index={index} />
                                        )}
                                </Marker>
                            );
                        })}
                    </View>
                )}

            </MapView>
        )
    }


    /*********************************************************************************
     *************************                 ***************************************
     ********************      ANIMATION STUFF    ************************************
     *************************                 ***************************************
     ********************************************************************************/

    // calculateOpacityStyle(index) {
    //     if (this.props.interpolations[index] != undefined)
    //         return {
    //             opacity: this.props.interpolations[index].opacity,
    //         }
    // }

    // calculateScaleStyle(index) {
    //     if (this.props.interpolations[index] != undefined)
    //         return {
    //             transform: [
    //                 {
    //                     scale: this.props.interpolations[index].scale,
    //                 },
    //             ],
    //         }
    // }

    getSportMapIcon(cluster) {
        let sport = cluster.sameEvents[cluster.sameEvents.length - 1].event.sport;
        return mapSportIcon(sport).sportIcon;
    }

    pressedEvent(index) {
        //Force animation as child won't do it if same index as before
        this.props.myEventScrollList(index);
    }

    /*********************************************************************************
     *************************                 ***************************************
     ********************      OTHER  STUFF       ************************************
     *************************                 ***************************************
     ********************************************************************************/

    onMapPress(mapEvent) {
        //Filter out marker presses
        if (mapEvent.nativeEvent.action === 'marker-press') {
            return;
        }
        this.props.pressedMap();
    }

    /*********************************************************************************
     *************************                 ***************************************
     ********************      CLUSTERING  STUFF       *******************************
     *************************                 ***************************************
     ********************************************************************************/

    static generateCluster(event, events) {
        let result = { isInACluster: false, sameEvents: [] }
        for (let index = 0; index < events.length; index++) {
            const eventItem = events[index];
            if (eventItem != undefined &&
                eventItem.spot.spot_id == event.spot.spot_id) {
                eventItem['indexInEvents'] = index;
                result.sameEvents.push(eventItem);
            }
        }
        if (result.sameEvents.length > 1)
            result.isInACluster = true;
        return result;
    }

    static getIndexOfClusterMaster(index, events) {
        let cluster = CustomMapView.generateCluster(events[index], events);
        return cluster.sameEvents[0].indexInEvents;
    }

}