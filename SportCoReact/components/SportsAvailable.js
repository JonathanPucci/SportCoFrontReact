import React, { Component } from "react";
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { LEVELS, SPORTS } from "../constants/DbConstants";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Colors from "../constants/Colors";
import { connect } from 'react-redux'
import { mapSportIcon } from "../helpers/mapper";
import {Layout} from '../constants/Layout'


const LEVEL_IMAGE = require('../assets/images/medal.png')
const WATER_IMAGE = require('../assets/images/water.png')


class SportsAvailable extends Component {

    constructor() {
        super();
        let index = 0;
        let pairs = [];
        while (index <= SPORTS.length - 2) {
            const sport1 = SPORTS[index];
            const sport2 = SPORTS[index + 1];
            const secondExists = (sport2 != '');
            pairs.push({
                first: {
                    sport: sport1,
                    icon: mapSportIcon(sport1)
                },
                second: {
                    exists: secondExists,
                    sport: sport2,
                    icon: mapSportIcon(sport2)
                }
            })
            index += 2;
        }
        this.state = {
            sportPairs: pairs
        }

    }

    render() {
        return (
            <View >
                <Text h4 style={styles.name} >Sports {this.props.showStats ? 'Stats' : ''}</Text>
                {this.state.sportPairs.map((item, index) => {
                    return (
                        <View key={"pairSport" + index} style={styles.sportLine}>
                            {this.renderSport(item.first.sport, item.first.icon.iconName, item.first.icon.iconFamily)}
                            {item.second.exists ?
                                this.renderSport(item.second.sport, item.second.icon.iconName, item.second.icon.iconFamily)
                                :
                                <View style={{ width:'30%'}} />
                            }
                        </View>
                    )
                })}
            </View>
        );
    }

    renderSport(sport, icon, type) {
        // let levelImage = this.mapLevelImage(this.props.stats[sport].level)
        return (
            <View >
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { this.toggleSport(sport) }}>
                        <View style={styles.sport}>
                            <Text>{sport.charAt(0).toUpperCase() + sport.slice(1)}</Text>
                            <Icon
                                name={icon}
                                type={type}
                                size={50}
                                color={this.isSportSelected(sport) ? Colors.tabIconSelected : Colors.tabIconDefault}
                            />
                        </View>
                    </TouchableOpacity>
                    {this.props.showStats && (
                        <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                            <View style={{ marginTop: 10, flexDirection: 'column' }}>
                                <Text>Created : {this.props.stats[sport].created}</Text>
                                <Text>Joined : {this.props.stats[sport].joined} </Text>
                                {this.props.showStats && (
                                    <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                        <TouchableWithoutFeedback
                                            onPress={this.ratingCompleted.bind(this, sport)}>
                                            <View>
                                                <Rating
                                                    readonly={(this.props.auth.user_id != this.props.user_id)}
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
                        </View>
                    )}
                </View>

            </View>
        );
    }

    ratingCompleted(sport) {
        if ((this.props.auth.user_id == this.props.user_id)) {
            let level = this.mapScore(this.props.stats[sport].level);
            level = this.mapScore((level) % LEVELS.length, true);
            this.props.ratingCompleted(sport, level);
        }
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
                (this.props.sportsSelected.length == SPORTS.length ?
                    newsports = [sport]
                    :
                    newsports.splice(newsports.indexOf(sport), 1)
                ) :
                newsports.push(sport);
            this.props.sportsSelectedChanged(newsports);
        }
    }
}


const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(SportsAvailable)




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
        marginLeft: 30,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});