import * as React from 'react';
import { View, Image, Animated, Text, Button } from 'react-native';
import { connect } from 'react-redux'

import MapView from 'react-native-maps';

import { styles, markerStyles, CARD_WIDTH } from './styles'
import CalloutEvent from './CalloutEvent'

export default class CustomMapView extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <MapView style={styles.mapStyle}
                initialRegion={this.props.searchState.region}
                zoomEnabled={true}
                followUserLocation={true}
                showsUserLocation={true}
                ref={ref => { this.mapView = ref; }}
                onRegionChangeComplete={this.setRegionAfterMove.bind(this)}
                onPress={this.onMapPress.bind(this)}
                onMarkerPress={() => { console.log("Marker pressed"); return; }}
            >
                {this.props.searchState.events.map((event, index) => {
                    if (event == undefined || event.event == undefined) {
                        return (<View key={index} />)
                    }
                    let coordinateEvent = {
                        latitude: parseFloat(event.spot.spot_latitude),
                        longitude: parseFloat(event.spot.spot_longitude)
                    };
                    return (
                        <MapView.Marker
                            key={index}
                            coordinate={coordinateEvent}
                            ref={comp => this['callout-' + index] = comp}
                            onPress={() => { this.pressedEvent(index) }}
                        >
                            <Animated.View style={[markerStyles.markerWrap, this.calculateOpacityStyle(index)]}>
                                <Animated.View style={[markerStyles.ring, this.calculateScaleStyle(index)]} />
                                <Image source={require('../../assets/images/pinIcon.png')}
                                    style={{ height: 40, resizeMode: 'contain', bottom: 18, left: 0.5 }}
                                />
                            </Animated.View>
                            <CalloutEvent event={event} index={index} />
                        </MapView.Marker>
                    );
                })}

            </MapView>
        )
    }

    setRegionAfterMove(region) {
        // console.log("regionAfterMove");
        this.props.regionMoved(region);
    }


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
        if (this.props.searchState.currentIndex == index) {
            this.props.myEventScrollList.scrollToElement(index, true)
        }
        // Will set index on scrollList which will trigger animation here
        this.setState({ currentEventIndex: index });

    }


    onMapPress(mapEvent) {
        //Filter out marker presses
        if (mapEvent.nativeEvent.action === 'marker-press') {
            return;
        }
        // console.log("Map pressed" + JSON.stringify(mapEvent.nativeEvent.coordinate));
        const event = this.props.searchState.events[this.props.searchState.currentEventIndex];
        let coordinateEvent = {
            latitude: parseFloat(event.spot.spot_latitude),
            longitude: parseFloat(event.spot.spot_longitude)
        };
    }

}