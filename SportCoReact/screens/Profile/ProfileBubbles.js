import * as React from 'react';
import { Image, View } from 'react-native';
import { Text, Icon } from 'react-native-elements'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { connect } from 'react-redux'

import { styles, MAX_ON_LINE, MARGIN_BETWEEN_ICONS } from './styles'
import { mapSportIcon } from '../../helpers/mapper';
import * as RootNavigation from '../../navigation/RootNavigation.js';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import SportCoApi from '../../services/apiService';
import Colors from '../../constants/Colors';
import { translate } from '../../App';


class ProfileBubbles extends React.Component {

    constructor(props) {
        super(props);
        this.apiService = new SportCoApi();
        this.state = {
            teamsInfo: []
        }
    }

    componentDidMount() {
        if (this.props.title == translate('Teams'))
            this.getTeamsInfo();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.items.length != this.props.items.length && this.props.title == translate('Teams'))
            this.getTeamsInfo();
    }

    render = () => {
        let { title, defaultText, items, user, waitingTeams } = this.props;
        let itemsToShow = [];
        itemsToShow = itemsToShow.concat(items);
        if (title == translate('Teams'))
            for (let index = 0; index < waitingTeams.length; index++) {
                const waitingTeam = waitingTeams[index];
                waitingTeam['isWaiting'] = true;
                itemsToShow.push(waitingTeam);
            }
        return (
            <View>
                <Text style={styles.desc}>
                    {title}
                </Text>
                {itemsToShow.length == 0 && (<Text style={{ marginLeft: 25 }}> {defaultText}</Text>)}
                <View style={{ marginTop: 10, marginLeft: MARGIN_BETWEEN_ICONS, flexDirection: 'row' }}>
                    {itemsToShow.slice(0, (title == translate('Friends') || title == translate('Teams')) ? MAX_ON_LINE - 2 : MAX_ON_LINE).map((item, index) => {
                        let actionNeededFromUserIfWaiterInTeam = false
                        if (title == translate('Teams'))
                            actionNeededFromUserIfWaiterInTeam = this.actionNeededFromUser(item.team_id)
                        return (
                            <TouchableWithoutFeedback
                                key={title.split(' ')[title.split(' ').length - 1] + index}
                                style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                                onPress={() => {
                                    (title == translate('Friends')) ?
                                        RootNavigation.navigateToProfile(item.email) :
                                        title == translate('Teams') ?
                                            RootNavigation.navigateToTeam(item.team_id, this.props.getData) :
                                            RootNavigation.navigateToEvent(item.event_id)
                                }}>
                                {title != translate('Friends') && title != translate('Teams') ?
                                    <Image
                                        source={mapSportIcon(item.sport.toLowerCase()).image}
                                        style={styles.imageUserEvent}
                                    /> :
                                    (<View>
                                        {item.photo_url != null ?
                                            (
                                                <Image source={{ uri: item.photo_url + '?type=large&width=500&height=500' }} style={styles.friendImage} />
                                            ) : (
                                                <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.friendImageNoBorder} />
                                            )
                                        }
                                    </View>)
                                }
                                <View style={styles.iconOnEvent}>
                                    {title.includes('Joined') || title.includes('Created') && (
                                        <Icon name={title.includes('Joined') ? 'fast-rewind' : 'record-voice-over'} color='white' size={10} />
                                    )}
                                    {title.includes(translate('Friends')) && (
                                        <View style={styles.iconOnEventFriends}>
                                            <Text style={{ color: "white", fontSize: 8, textAlign: "center" }}>
                                                {item.user_name != undefined ?
                                                    (item.user_name.split(' ')[0][0] +
                                                        (item.user_name.split(' ').length > 1 ? item.user_name.split(' ')[1][0] : ''))
                                                    : ''}
                                            </Text>
                                        </View>
                                    )}
                                    {title == translate('Teams') && item.isWaiting && (
                                        <Icon name='timer-sand' type='material-community' reverse size={10}
                                            color='orange'
                                            style={{ margin: 30 }}
                                        />
                                    )}
                                    {title == translate('Teams') && item.team_manager == this.props.auth.user_id && (
                                        <View style={{ marginBottom: 30 }}>
                                            {!actionNeededFromUserIfWaiterInTeam ?
                                                <Icon name='crown' type='material-community' reverse size={10}
                                                    color={Colors.timakaColor}
                                                    style={{ marginBottom: 10 }}
                                                />
                                                :
                                                <Icon name='exclamation' type='material-community' reverse size={10}
                                                    color='red'
                                                    style={{ fontSize: 0 }}
                                                />
                                            }
                                        </View>
                                    )}
                                </View >
                            </TouchableWithoutFeedback>
                        )
                    })}

                    {((title == translate('Friends') && user.userFriends.length > MAX_ON_LINE - 2) || (title == translate('Teams') && user.userTeams.length > MAX_ON_LINE - 2)) && (user.user_id == this.props.auth.user_id)  && (
                        <TouchableWithoutFeedback
                            style={{ marginLeft: MARGIN_BETWEEN_ICONS, alignItems: 'center', justifyContent: 'center' }}
                            onPress={title == translate('Friends') ? this.props.wantsToSeeFriends : this.props.wantsToSeeTeams}>
                            <Icon name='more-horiz' size={15} raised color='blue' />

                        </TouchableWithoutFeedback>
                    )}
                    {(title == translate('Friends') || title == translate('Teams')) && (user.user_id == this.props.auth.user_id) && (
                        <TouchableWithoutFeedback
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                            onPress={title == translate('Friends') ? this.props.wantsToAddFriend : this.props.wantsToJoinTeam}>
                            <Icon name='add' size={15} raised color='blue' />

                        </TouchableWithoutFeedback>
                    )}
                </View>
            </View>
        )
    }

    actionNeededFromUser = (team_id) => {
        if (this.state.teamsInfo.length == this.props.items.length) {
            let teamInfo = this.state.teamsInfo
                .find((teamI) => {
                    return teamI.team.team_id == team_id
                })
            if (teamInfo != undefined && teamInfo.waitingMembers.length > 0)
                return true;
        }
        return false;
    }

    getTeamsInfo = async () => {
        this.setState({ teamsInfo: [] });
        for (let index = 0; index < this.props.items.length; index++) {
            const team = this.props.items[index];
            let teamsData = await this.apiService.getSingleEntity('teams', team.team_id);
            let teamsInfo = this.state.teamsInfo;
            teamsInfo.push(teamsData.data);
            this.setState({ teamsInfo: teamsInfo });
        }
    }

}



const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(ProfileBubbles)

