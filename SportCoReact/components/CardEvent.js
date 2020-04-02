import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Text } from 'react-native';
import { mapSportIcon } from '../helpers/mapper'
import Layout from '../constants/Layout'


export const CARD_HEIGHT = Layout.window.height / 4;
export const CARD_WIDTH = CARD_HEIGHT - 50;

export default class CardEvent extends React.Component {

    render() {
        let item = this.props.item;
        return (
            <TouchableWithoutFeedback onPress={this.props.pressedCard}>
                <View style={[markerStyles.card, this.props.markerActive? markerStyles.borderActive : '']} >
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

}

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
    endPadding: {
        paddingRight: Layout.window.width - CARD_WIDTH,
    },
    card: {
        padding: 0,
        elevation: 2,
        backgroundColor: "#BBB",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        borderRadius: 5
    },
    borderActive: {
        backgroundColor: '#FFF',
        borderWidth: 1
    },
    cardImage: {
        flex: 3,
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
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
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

