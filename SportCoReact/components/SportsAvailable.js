import React, { Component } from "react";
import { View } from 'react-native';
import { Text } from 'react-native-elements'
import Icon from './Icon'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';




export default class SportsAvailable extends Component {

    state = {
    }

    render() {
        return (
            <View >
                <Text h4 style={styles.name} >Sports</Text>
                <View style={styles.sportLine}>
                    {this.renderSport('basket', 'ios-basketball', 'Ionicons')}
                    {this.renderSport('tennis', 'ios-tennisball', 'Ionicons')}
                </View>
                <View style={styles.sportLine}>
                    {this.renderSport('soccer', 'ios-football', 'Ionicons')}
                    {this.renderSport('futsal', 'ios-football', 'Ionicons')}
                </View>
                <View style={styles.sportLine}>
                    {this.renderSport('beachvolley', 'volleyball', 'MaterialCommunityIcons')}
                    {this.renderSport('volley', 'volleyball', 'MaterialCommunityIcons')}
                </View>

                <View style={styles.sportLine}>
                    {this.renderSport('workout', 'ios-fitness', 'Ionicons')}
                    {this.renderSport('running', 'run', 'MaterialCommunityIcons')}
                </View>
            </View>
        );
    }

    renderSport(sport, icon, type) {
        return (
            <View >
                <TouchableWithoutFeedback onPress={() => this.toggleSport(sport)}>
                    <View style={styles.sport}>
                        <Text>{sport.charAt(0).toUpperCase() + sport.slice(1)}</Text>
                        <Icon
                            name={icon}
                            type={type}
                            size={50}
                            selected={this.isSportSelected(sport)}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    isSportSelected(sport) {
        return this.props.sportsSelected.includes(sport);
    }

    toggleSport(sport) {
        let newsports = this.props.sportsSelected;
        this.isSportSelected(sport) ?
            newsports.splice(newsports.indexOf(sport), 1) :
            newsports.push(sport);
        this.props.sportsSelectedChanged(newsports);
    }
}


export const styles = StyleSheet.create({

    name: {
        color: '#5E5E5E',
        alignSelf: 'flex-start',
        marginLeft: 30,
    },
    sport: {
        alignItems:'center'
    },
    sportLine: {
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});