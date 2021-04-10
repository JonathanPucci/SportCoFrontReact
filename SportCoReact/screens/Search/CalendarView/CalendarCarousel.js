import * as React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList
} from 'react-native';

import CardEvent from '../../../components/CardEvent'
import { navigateToEvent } from '../../../navigation/RootNavigation'

export default class CalendarCarousel extends React.Component {

    _renderItem({ item, index }) {
        return (
            <View style={{ marginHorizontal: 20 }}>
                <CardEvent markerActive={true} pressedCard={() => navigateToEvent(item.event_id)} item={item} isCalendarCard />
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, marginLeft : 10, paddingTop: 50, }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                    <FlatList
                        horizontal
                        data={this.props.items}
                        renderItem={this._renderItem}
                        keyExtractor={(item) => 'event' + item.event.event_id}
                        showsHorizontalScrollIndicator={false}
                    >
                    </FlatList>
                </View>
            </SafeAreaView>
        );
    }
}

