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

    componentDidMount(){
        this.scrollToElement(this.props.currentIndex);
    }

    componentDidUpdate(prevProps){
        if (this.props.currentIndex !== prevProps.currentIndex) {
            this.scrollToElement(this.props.currentIndex);
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
                onScrollToIndexFailed={()=>{}}
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
                data={this.props.markers}
                renderItem={({ item, index }) => (
                    <TouchableWithoutFeedback onPress={this.scrollToElement.bind(this, index, true)}>
                        <View style={[markerStyles.card, this.props.currentIndex==index?markerStyles.borderActive:'']} >
                            <Image
                                source={mapSportIcon(item.sport).image}
                                style={markerStyles.cardImage}
                                resizeMode="cover"
                            />
                            <View style={markerStyles.textContent}>
                                <Text numberOfLines={1} style={markerStyles.cardtitle}>{item.title}</Text>
                                <Text numberOfLines={1} style={markerStyles.cardDescription}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            >
            </Animated.FlatList>
        );
    }

    renderMarker(marker, index) {
        return (
            <View></View>
        )
    }

    scrollToElement(i, animated = false) {
        this.myScroll.getNode().scrollToIndex({animated: animated, index: i});
    }
}

