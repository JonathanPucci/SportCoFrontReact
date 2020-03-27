import React, { Component } from "react";
import {
    Text,
    View,
    Animated,
    Image,
} from "react-native";
import { markerStyles, CARD_WIDTH } from './styles'
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { mapSportIcon } from "../../helpers/mapper";



export default class EventMarkers extends Component {

    state = {
        currentOffset: 0
    }

    componentDidMount() {
        this.scrollToElement();
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentIndex !== prevProps.currentIndex) {
            this.scrollToElement();
        }
    }

    render() {
        return (
            <Animated.FlatList
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                ref={(ref) => this.myScroll = ref}
                onScrollToIndexFailed={() => { }}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: {
                                x: this.props.animation,
                            },
                        },
                    },
                    ],
                    {
                        useNativeDriver: true,
                        listener: event => {
                            const offsetX = event.nativeEvent.contentOffset.x;
                            this.setState({ currentOffset: offsetX });
                            // do something special
                        },
                    }
                )}
                style={markerStyles.scrollView}
                contentContainerStyle={markerStyles.endPadding}
                data={this.props.markers}
                keyExtractor={(item, index) => {
                    if (item != undefined && item.event != undefined)
                        return item.event.event_id.toString();
                    else
                        return 'key' + index
                }}
                renderItem={({ item, index }) => {
                    return this.renderMarker(item, index);
                }}
            />
        )
    }

    renderMarker(item, index) {
        if (item == undefined || item.event == undefined) {
            return (<View />)
        }
        return (
            <TouchableWithoutFeedback onPress={this.scrollToElement.bind(this, index, true)}>
                <View style={[markerStyles.card, this.props.currentIndex == index ? markerStyles.borderActive : '']} >
                    <Image
                        source={mapSportIcon(item.event.sport).image}
                        style={markerStyles.cardImage}
                        resizeMode="cover"
                    />
                    <View style={markerStyles.textContent}>
                        <Text numberOfLines={1} style={markerStyles.cardtitle}>{item.event.title}</Text>
                        <Text numberOfLines={1} style={markerStyles.cardDescription}>
                            {item.event.description}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }


    scrollToElement(i = this.props.currentIndex, fromPress = false) {
        if (fromPress) {
            this.myScroll.getNode().scrollToOffset({ animated: fromPress, offset: (this.state.currentOffset + (i ==0? 10:-10))});
        }
        setTimeout(() => { this.myScroll.getNode().scrollToIndex({ animated: fromPress, index: i }); }, 100);
    }
}

