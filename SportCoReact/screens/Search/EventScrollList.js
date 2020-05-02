import React, { Component } from "react";
import {
    View,
    Platform
} from "react-native";
import { markerStyles } from './styles'
import CardEvent, { CARD_WIDTH, CARD_HEIGHT, SPACE_BETWEEN } from '../../components/CardEvent'
import Carousel from 'react-native-snap-carousel';


export default class EventMarkers extends Component {

    state = {
        currentOffset: 0
    }

    componentDidMount() {
        setTimeout(() => {
            this.scrollToElement(Platform.OS == 'ios' ? 0 : this.props.markers.length - 1);
        }, 1500);
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentIndex !== prevProps.currentIndex) {
            this.scrollToElement();
        }
    }

    render() {
        let eventCards = this.props.markers;
        return (
            <Carousel
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                ref={(ref) => this.myScroll = ref}
                onScrollToIndexFailed={() => { }}
                enableMomentum={true}
                onMomentumScrollEnd={() => { this.props.scrollEnded() }}
                style={[markerStyles.scrollView]}
                contentContainerStyle={[{ /*paddingRight: 2 * CARD_WIDTH*/ }]}
                data={eventCards}
                keyExtractor={(item, index) => {
                    if (item.isEmpty)
                        return 'empty' + index;
                    if (item != undefined && item.event != undefined)
                        return item.event.event_id.toString();
                    else
                        return 'key' + index
                }}
                renderItem={({ item, index }) => {
                    return this.renderMarker(item, index);
                }}
                sliderWidth={2 * (CARD_WIDTH)}
                itemWidth={CARD_WIDTH + 4 * SPACE_BETWEEN}
                itemHeight={CARD_HEIGHT}
                layout={'stack'}
                layoutCardOffset={30}
            />
        )
    }

    renderMarker(item, index) {
        if (item == undefined || item.event == undefined || item.isEmpty) {
            return (<View style={{ width: CARD_WIDTH, height: 10, borderColor: 'red', borderWidth: 2 }} />)
        }
        return (
            <CardEvent
                pressedCard={() => { this.props.pressedCard(index) }}
                item={item}
                markerActive={this.props.currentIndex == index}
            />
        )
    }


    scrollToElement(i = this.props.currentIndex, fromPress = false) {
        if (this.myScroll != undefined && this.myScroll != null)
            this.myScroll.snapToItem(i);
    }
}
