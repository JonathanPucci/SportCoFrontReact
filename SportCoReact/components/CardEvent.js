import { connect } from 'react-redux';
import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Text } from 'react-native';
import { mapSportIcon } from '../helpers/mapper'
import { Layout } from '../constants/Layout'
import { translate } from '../App';
import UserPicture from './UserPicture';

export const CARD_HEIGHT = (Layout.window.height - 40) / 4.5;
export const CARD_WIDTH = (Layout.window.width) / 3;//CARD_HEIGHT*0.75;
export const SPACE_BETWEEN = 10;

export class CardEvent extends React.Component {

    render() {
        let item = this.props.item;
        let date = new Date(item.event.date);
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        let dateString = dd + '/' + mm;
        let time = date.toLocaleTimeString().split(':');
        let hour = time[0] + 'h' + time[1];
        return (
            <TouchableWithoutFeedback onPress={this.props.pressedCard}>
                { !this.props.isCalendarCard ? (
                    <View style={[markerStyles.card, this.props.markerActive ? markerStyles.active : markerStyles.inactive]} >
                        <Image
                            source={mapSportIcon(item.event.sport).image}
                            style={markerStyles.cardImage}
                            resizeMode="cover"
                        />
                        <View style={markerStyles.textContent}>

                            <Text numberOfLines={1} style={markerStyles.cardtitle}>
                                {item.event.sport.toUpperCase() + '  ' + dateString}
                            </Text>

                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <UserPicture
                                    photoUrl={item.host.photo_url}
                                    photoUrlS3={item.host.photo_url_s3}
                                    type={item.host.photo_to_use}
                                    size={40} />
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text numberOfLines={1} multiline={true} style={markerStyles.cardDescription}>{hour}</Text>
                                    <Text numberOfLines={3} style={[markerStyles.cardDescription, { flexWrap: 'wrap' }]}>{item.event.description}</Text>

                                </View>
                            </View>
                            <Text numberOfLines={1} style={[markerStyles.cardDescription, { top: 5 }]}>
                                {translate('Going') + ' : ' + item.participants.length + '/' + item.event.participants_max}</Text>

                        </View>
                    </View>
                ) : (
                    <View style={{ width: Layout.window.width / 1.75, height: 100, flexDirection: 'row' }}>
                        <Image
                            source={mapSportIcon(item.event.sport).image}
                            style={{ height: "100%", width: '50%' }}
                            resizeMode="cover"
                        />
                        <View style={{marginLeft : 5, flexDirection: 'column' }}>

                            <View style={{ flexDirection: 'row'}}>
                                <Text numberOfLines={2} style={markerStyles.cardtitle}>
                                    {item.event.sport.toUpperCase()  + '\n' + dateString}
                                </Text>
                                <View style={{marginLeft : 20}}>
                                <UserPicture
                                    photoUrl={item.host.photo_url}
                                    photoUrlS3={item.host.photo_url_s3}
                                    type={item.host.photo_to_use}
                                    size={40} />
                                    </View>
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text numberOfLines={1} multiline={true} style={markerStyles.cardDescription}>{hour}</Text>
                                {/* <Text numberOfLines={3} style={[markerStyles.cardDescription, { flexWrap: 'wrap' }]}>{item.event.description}</Text> */}
                            </View>
                            <Text numberOfLines={1} style={[markerStyles.cardDescription, { bottom: 5 }]}>
                                {translate('Going') + ' : ' + item.participants.length + '/' + item.event.participants_max}</Text>

                        </View>
                    </View>
                )
                }
            </TouchableWithoutFeedback>
        )
    }

}


const mapDispatchToProps = dispatch => {
    return {
        dispatch: action => {
            dispatch(action);
        }
    };
};

function mapStateToProps(state) {
    return state;
}

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(CardEvent));


const markerStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    card: {
        padding: 0,
        elevation: 2,
        backgroundColor: "#BBB",
        marginHorizontal: SPACE_BETWEEN,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        borderRadius: 5
    },
    active: {
        backgroundColor: '#FFF',
        borderWidth: 1
    },
    inactive: {
        opacity: 0.6,
    },
    cardImage: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
        padding: 10,

    },
    cardtitle: {
        fontSize: 12,
        fontWeight: "bold",
    },
    cardDescription: {
        flexWrap: 'wrap',
        alignItems: "flex-start",
        fontSize: 12,
        marginLeft: 5,
        color: "#444",
    },
    markerWrap: {
        width: 40,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    ring: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "rgba(59, 118, 255 , 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(59, 118, 255, 0.5)",
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    galleryItem: {
        flex: 0.5,
    },
    emptyGalleryItem: {
        flex: 0.5,
    },
});

