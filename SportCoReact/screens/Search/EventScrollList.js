import React, { Component } from "react";
import {
    Text,
    View,
    ScrollView,
    Animated,
    Image,
} from "react-native";
import { markerStyles, CARD_WIDTH } from './styles'


export default class EventMarkers extends Component {

    render() {
        return (
            <Animated.ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: this.props.animation,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: true }
                )}
                style={markerStyles.scrollView}
                contentContainerStyle={markerStyles.endPadding}
            >
                {this.props.markers.map((marker, index) => (
                    <View style={markerStyles.card} key={index}>
                        <Image
                            source={(marker.image)}
                            style={markerStyles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={markerStyles.textContent}>
                            <Text numberOfLines={1} style={markerStyles.cardtitle}>{marker.title}</Text>
                            <Text numberOfLines={1} style={markerStyles.cardDescription}>
                                {marker.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </Animated.ScrollView>
        );
    }
}

