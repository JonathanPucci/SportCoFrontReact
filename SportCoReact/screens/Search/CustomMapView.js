import * as React from 'react';
import { View, Image, Animated } from 'react-native';

import MapView from "react-native-maps";
import { Marker } from "react-native-maps"
import { styles, markerStyles, CARD_WIDTH } from './styles'
import CalloutEvent from './CalloutEvent'
import CalloutMultiEvent from './CalloutMultiEvent'

export default class CustomMapView extends React.Component {

    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <MapView
                style={styles.mapStyle}
                initialRegion={this.props.region}
                zoomEnabled={true}
                followUserLocation={true}
                showsUserLocation={true}
                ref={ref => { this.mapView = ref; }}
                onRegionChangeComplete={(region) => { this.props.regionMoved(region); }}
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
                                longitude: parseFloat(event.spot.spot_longitude)
                            };

                            let cluster = this.getCluster(event);
                            if (cluster == undefined || cluster.isInACluster == undefined) {
                                return (<Marker
                                    key={'marker' + index}
                                    coordinate={coordinateEvent}
                                    ref={(refCallout) => { this['callout' + index] = refCallout }}
                                    onPress={() => { this.pressedEvent(index) }}
                                >
                                    <Text>ERROR SORRY</Text>
                                </Marker>)
                            }
                            return (
                                <Marker
                                    key={'marker' + index}
                                    coordinate={coordinateEvent}
                                    ref={(refCallout) => { this['callout' + index] = refCallout }}
                                    onPress={() => { this.pressedEvent(index) }}
                                >
                                    <Animated.View style={[markerStyles.markerWrap, this.calculateOpacityStyle(index)]}>
                                        <Animated.View style={[markerStyles.ring, this.calculateScaleStyle(index)]} />
                                        {cluster.isInACluster ? (
                                            <Image source={require('../../assets/images/map-multiEvent.gif')}
                                                style={{ width: 33, resizeMode: 'contain', bottom: 18, left: 0.5 }}
                                            />
                                        )
                                            :
                                            (
                                                <Image source={require('../../assets/images/map-pointer.gif')}
                                                    style={{ width: 30, resizeMode: 'contain', bottom: 18, left: 0.5 }}
                                                />
                                            )
                                        }
                                    </Animated.View>
                                    {cluster.isInACluster ? (
                                        <CalloutMultiEvent
                                            reloadCallout={this.state.reloadCallout}
                                            events={cluster.sameEvents}
                                            navigation={this.props.navigation}
                                            index={index} />
                                    )
                                        :
                                        (
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

    calculateOpacityStyle(index) {
        if (this.props.interpolations[index] != undefined)
            return {
                opacity: this.props.interpolations[index].opacity,
            }
    }

    calculateScaleStyle(index) {
        if (this.props.interpolations[index] != undefined)
            return {
                transform: [
                    {
                        scale: this.props.interpolations[index].scale,
                    },
                ],
            }
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

    getCluster(event) {
        let result = { isInACluster: false, sameEvents: [event] }
        for (let index = 0; index < this.props.events.length; index++) {
            const eventItem = this.props.events[index];
            if (eventItem != undefined &&
                eventItem.event.event_id != event.event.event_id &&
                eventItem.spot.spot_latitude == event.spot.spot_latitude &&
                eventItem.spot.spot_longitude == event.spot.spot_longitude) {
                result.isInACluster = true;
                result.sameEvents.push(eventItem);
            }
        }
        return result;
    }

}