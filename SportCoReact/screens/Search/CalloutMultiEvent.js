import * as React from 'react';
import { ScrollView, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux'

import { Callout, CalloutSubview } from 'react-native-maps';
import { eventCalloutStyles, markerStyles, CARD_WIDTH } from './styles';
import Icon from '../../components/Icon'
import { mapSportIcon } from '../../helpers/mapper'
import CardEvent from '../../components/CardEvent'

class CalloutMultiEvent extends React.Component {

    render() {
        // if (this.props.reloadCallout)
        //     this.getData();
        // let eventInfo = this.state.event == undefined ? this.props.event : this.state.event;
        return (
            <Callout onPress={this.goToEventLibrary.bind(this, this.props.events)} >
                <View style={eventCalloutStyles.eventContainer}>
                    <Text h5 style={eventCalloutStyles.eventTitle}>Plusieurs évènements ici !</Text>
                    {this.props.events != undefined &&
                        (<View style={eventCalloutStyles.eventSports}>
                            {this.props.events.map((item, index) => {
                                let icon = mapSportIcon(item.event.sport.toLowerCase());
                                return <Icon
                                    key={'key' + index}
                                    name={icon.iconName}
                                    type={icon.iconFamily}
                                    size={30}
                                    style={eventCalloutStyles.eventSports}
                                    selected={false}
                                />
                            })
                            }
                        </View>)
                    }
                    <Text style={eventCalloutStyles.buttonStyle} >
                        Voir plus...
                    </Text>
                </View>
            </Callout>
        )
    }


    goToEventLibrary(events) {
        this.props.navigation.navigate('Evenements', {
            events: events
        });
    }

}

export class MultiEventScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: props.route.params.events
        };
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>
                {this.renderGallery()}
            </ScrollView>
        )
    }

    renderSportCard(item, index) {
        return (
            <CardEvent pressedCard={this.goToEvent.bind(this, item)} item={item}/>
        )
    }


    goToEvent(event) {
        this.props.navigation.navigate('Event', {
            event: event
        });
    }

    renderGallery() {
        var pairs = this.getPairsArray(this.state.events);
        return (
            <View style={{ flexDirection: 'column' }}>
                {pairs.map((item, index) => {
                    return (
                        <View style={markerStyles.item} key={index}>
                            <View style={markerStyles.galleryItem}>
                                {this.renderSportCard(item[0], index)}
                            </View>
                            {item[1].event_id != '-1' && (
                                <View style={markerStyles.galleryItem}>
                                    {this.renderSportCard(item[1], index)}
                                </View>
                            )}
                            {item[1].event_id == '-1' && (
                                <View style={markerStyles.emptyGalleryItem} />
                            )}
                        </View>)
                }
                )}
            </View>
        )

    }

    getPairsArray(events) {
        var pairs_r = [];
        var pairs = [];
        var count = 0;
        events.forEach((item, index, array) => {
            count += 1;
            pairs.push(item);
            if (count == 2) {
                pairs_r.push(pairs);
                count = 0;
                pairs = [];
            } else if (count == 1 && index == events.length - 1) {
                pairs_r.push([item, { event_id: '-1' }]);
            }
        });
        return pairs_r;
    }


   
}


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(CalloutMultiEvent);

