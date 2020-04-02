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
import CardEvent from '../../components/CardEvent'


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
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"
                ref={(ref) => this.myScroll = ref}
                onScrollToIndexFailed={() => { }}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: {
                                x: (this.props.animation),
                            },
                        },
                    },
                    ],
                    {
                        useNativeDriver: true,
                        listener: event => {
                            const offsetX = event.nativeEvent.contentOffset.x;
                            this.setState({ currentOffset: offsetX });
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
            <CardEvent
                pressedCard={this.scrollToElement.bind(this, index, true)}
                item={item}
                markerActive={this.props.currentIndex == index}
            />
        )
    }


    scrollToElement(i = this.props.currentIndex, fromPress = false) {
        if (fromPress && i==this.props.currentIndex) {
            this.myScroll.getNode().scrollToOffset({ animated: false, offset: (this.state.currentOffset + (i == 0 ? 1 : -1)) });
        }
        if (this.props.markers.length != 0)
            this.myScroll.getNode().scrollToIndex({ animated: fromPress, index: i });
    }
}

