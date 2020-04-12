import React, { Component } from "react";
import { View, Image } from 'react-native';
import { Text } from 'react-native'
import Icon from './Icon'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { LEVELS } from "../constants/DbConstants";
import { Rating, AirbnbRating } from 'react-native-ratings';


const LEVEL_IMAGE = require('../assets/images/medal.png')
const WATER_IMAGE = require('../assets/images/water.png')




export default class SportsAvailable extends Component {

    state = {
    }

    render() {
        return (
            <View >
                <Text h4 style={styles.name} >Sports {this.props.showStats ? 'Stats' : ''}</Text>
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
        // let levelImage = this.mapLevelImage(this.props.stats[sport].level)
        return (
            <View >
                <View style={{ flexDirection: 'row' }}>
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
                    {this.props.showStats && (
                        <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                            <Text>Stats </Text>
                            <View style={{ marginTop: 10, flexDirection: 'column' }}>
                                <Text>Created : {this.props.stats[sport].created}</Text>
                                <Text>Joined : {this.props.stats[sport].joined} </Text>
                            </View>
                        </View>
                    )}
                </View>
                {this.props.showStats && (
                    <View style={{ marginLeft: 5, flexDirection: 'row' }}>
                        <Text style={{ marginRight: 10 }}>Level </Text>
                        <TouchableWithoutFeedback
                            onPress={this.ratingCompleted.bind(this, sport)}>
                            <View>
                                <Rating
                                    type='custom'
                                    ratingImage={LEVEL_IMAGE}
                                    ratingColor='#3498db'
                                    ratingBackgroundColor='#c8c7c8'
                                    ratingCount={LEVELS.length}
                                    imageSize={25}
                                    startingValue={this.mapScore(this.props.stats[sport].level)}
                                    onFinishRating={() => { }}
                                />
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                )}
            </View>
        );
    }

    ratingCompleted(sport) {
        let level = this.mapScore(this.props.stats[sport].level);
        level = this.mapScore((level)%LEVELS.length, true);
        this.props.ratingCompleted(sport, level);
    }

    mapScore(ratingOrLevel, isRating = false) {
        if (isRating)
            return LEVELS[ratingOrLevel];
        else
            return LEVELS.indexOf(ratingOrLevel) + 1;
    }

    mapLevelImage(level) {
        let levelIndex = this.mapScore(level);
        let levelImage = null;
        switch (levelIndex) {
            case 0:
                levelImage = require('../assets/images/level1.png');
                break;
            case 2:
                levelImage = require('../assets/images/level2.png');
                break;
            case 3:
                levelImage = require('../assets/images/level3.png');
                break;
            case 4:
                levelImage = require('../assets/images/level4.png');
                break;
            case 5:
                levelImage = require('../assets/images/level5.png');
                break;
            default:
                break;
        };
        return levelImage
    }

    isSportSelected(sport) {
        return this.props.showStats ?
            (this.props.stats[sport].created != 0 || this.props.stats[sport].joined != 0) :
            this.props.sportsSelected.includes(sport);
    }

    toggleSport(sport) {
        if (this.props.maxOne) {
            this.props.sportsSelectedChanged([sport]);
        }
        else if (!this.props.showStats) {
            let newsports = this.props.sportsSelected;
            this.isSportSelected(sport) ?
                newsports.splice(newsports.indexOf(sport), 1) :
                newsports.push(sport);
            this.props.sportsSelectedChanged(newsports);
        }
    }
}


export const styles = StyleSheet.create({

    name: {
        color: '#5E5E5E',
        alignSelf: 'flex-start',
        marginLeft: 30,
    },
    sport: {
        alignItems: 'center'
    },
    sportLine: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});