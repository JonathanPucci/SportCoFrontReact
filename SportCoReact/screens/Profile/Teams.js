import * as React from 'react';
import { Image, View, TouchableWithoutFeedback } from 'react-native';
import { Divider, Text, Icon, Overlay, Button, CheckBox } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles, MARGIN_BETWEEN_ICONS } from './styles'
import * as RootNavigation from '../../navigation/RootNavigation.js';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import ProfileInput from './ProfileInput';
import { convertUTCDateToLocalDate } from '../Event/Helpers';
import { translate } from '../../App';
import { getFileFromS3 } from '../../services/aws3Service';


class TeamsList extends React.Component {

    constructor() {
        super();
        this.state = {
            teamsNameFilter: '',
            isCreatingTeam: false,
            newTeamDesc: '',
            newTeamName: '',
            newTeamManaged: false
        }
        this.apiService = new SportCoApi();
    }

    render() {
        return (
            <View>
                {this.renderOverlayTeams()}
            </View>
        )
    }

    exit = () => {
        this.props.stopShowingTeams();
        this.setState({ isCreatingTeam: false })
    }

    renderOverlayTeams = () => {
        let { isAdding, user, allTeams, areTeamsVisible } = this.props;
        let dataToShow = isAdding ? allTeams : user.userTeams;
        dataToShow = dataToShow.filter((item, index) => {
            return item.team_name != null && item.team_id != this.props.auth.team_id ?
                isAdding ?
                    this.state.teamsNameFilter.length >= 1 ?
                        item.team_name.toLowerCase().includes(this.state.teamsNameFilter.toLowerCase())
                        : false
                    : item.team_name.toLowerCase().includes(this.state.teamsNameFilter.toLowerCase())
                : false
        })
        if (isAdding)
            dataToShow = dataToShow.filter((item, index) => {
                return item.team_id != this.props.auth.team_id
            })
        return (
            <Overlay
                isVisible={areTeamsVisible}
                onBackdropPress={this.exit}
                overlayStyle={styles.overlay}
            >
                <View>
                    <View
                        style={{ right: 0, justifyContent: 'center' }}>
                        <Icon name='remove' type='font-awesome' size={20} raised
                            onPress={this.exit}
                        />
                    </View>
                    {!this.state.isCreatingTeam ?
                        (
                            <View>
                                <ScrollView
                                    style={{ height: isAdding ? '70%' : '90%' }}
                                    keyboardShouldPersistTaps='handled'>
                                    <ProfileInput title={isAdding ? translate('Teams') : translate("My Teams")} placeholderText={'Find by name'}
                                        data={this.state.teamsNameFilter} callbackOnChange={this.onTeamNameFilterChanged} 
                                        isAdding={isAdding} />
                                    <View style={{ flexDirection: "column" }}>
                                        {dataToShow.length == 0 && (
                                            <Text style={{ textAlign: 'center' }}>{translate("You may want to change the filter up there")}</Text>
                                        )}
                                        {dataToShow.map((team, index) => {
                                            return (
                                                <View key={'user' + index} style={{ flexDirection: 'column', justifyContent: 'center' }}  >
                                                    {this.renderData(team)}
                                                </View>

                                            )
                                        })}


                                    </View>
                                </ScrollView>
                                {isAdding &&
                                    <View style={{ marginTop: 20 }}>
                                        <Button
                                            title={translate("Or, start a new team !")}
                                            onPress={() => this.setState({ isCreatingTeam: true })}
                                            style={{ marginTop: 50, width: '60%', alignSelf: 'center' }} />
                                    </View>
                                }
                            </View>
                        ) :
                        (
                            <View>
                                {this.renderTeamCreator()}
                            </View>
                        )}
                </View>
            </Overlay >
        )
    }

    renderData = (team) => {
        let { isAdding, user } = this.props;
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}  >
                    <TouchableWithoutFeedback
                        style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                        onPress={() => { this.props.stopShowingTeams(); RootNavigation.navigateToTeam(team.team_id) }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {team.team_picture != null ?
                                <Image source={{ uri: getFileFromS3('teams', team.team_picture) }} style={styles.image} />
                                :
                                <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.imageNoBorder} />
                            }
                            <Text style={{ alignSelf: 'center', marginLeft: 30 }}>{team.team_name}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {isAdding ?
                        (
                            <View>
                                {user.userTeams.some(someteam => {
                                    return someteam.team_id == team.team_id
                                }) ?
                                    <Icon name='remove' reverse size={18}
                                        color='red'
                                        style={{ margin: 30 }}
                                        onPress={() => { this.leaveTeam(team) }}
                                    /> : <View>
                                        {user.userTeamsWaiting.some(someteam => {
                                            return someteam.team_id == team.team_id
                                        }) ?
                                            <Icon name='timer-sand' type='material-community' reverse size={18}
                                                color='orange'
                                                style={{ margin: 30 }}
                                            />
                                            :
                                            <Icon name='add' reverse size={18}
                                                color='green'
                                                style={{ margin: 30 }}
                                                onPress={() => { this.joinTeam(team) }}
                                            />
                                        }
                                    </View>
                                }
                            </View>
                        )
                        :
                        (<Icon name='remove' reverse size={18}
                            color='red'
                            style={{ margin: 30 }}
                            onPress={() => { this.leaveTeam(team) }}
                        />)

                    }
                </View>
                <Divider style={{ margin: 10 }} />
            </View>)
    }

    renderTeamCreator = () => {
        return (
            <View>

                <ProfileInput notShowingTitle title={translate('Teams')}
                    placeholderText={translate("Team Name Here")}
                    data={this.state.newTeamName} callbackOnChange={this.onTeamNameChanged}
                    isAdding={true} />
                <ProfileInput notShowingTitle title={translate('Teams')}
                    placeholderText={translate("Team Description Here")}
                    data={this.state.newTeamDesc} callbackOnChange={this.onTeamDescChanged}
                    isAdding={false} />
                <CheckBox
                    checked={this.state.newTeamNotManaged}
                    title={translate("Joinable without manager acceptance")}
                    onPress={() => { this.setState({ newTeamNotManaged: !this.state.newTeamNotManaged }) }} />
                <Button
                    title={translate("All Good")}
                    onPress={this.createTeam}
                    style={{ marginTop: 50, width: '60%', alignSelf: 'center' }} />
            </View>
        )
    }

    onTeamDescChanged = (text) => {
        this.setState({ newTeamDesc: text })
    }
    onTeamNameChanged = (text) => {
        this.setState({ newTeamName: text })
    }

    joinTeam = async (team) => {
        await this.apiService.addEntity(team.manager_has_to_accept == 1 ? 'teammembers/waiting' : 'teammembers', { member_id: this.props.auth.user_id, team_id: team.team_id });
        let dataManager = await this.apiService.getSingleEntity('users', team.team_manager);
        let notif = {
            sender_id: this.props.auth.user_id,
            user_id: team.team_manager,
            user_push_token: dataManager.data.user_push_token,
            team_id: team.team_id,
            notif_message_type: team.manager_has_to_accept == 1 ? 'WANTS_TO_JOIN_TEAM' : 'NEW_TEAM_MEMBER',
            notif_data_type: 'team_id',
            notif_data_value: team.team_id,
            sender_photo_url: this.props.auth.user.photo_url
        }
        await this.apiService.addEntity('notify/user', notif)
        this.props.getData();
    }

    leaveTeam = async (team) => {
        await this.apiService.deleteEntity('teammembers', { member_id: this.props.auth.user_id, team_id: team.team_id });
        this.props.getData();
    }

    createTeam = async () => {
        let date = convertUTCDateToLocalDate(new Date());
        let teamData = await this.apiService.addEntity('teams',
            {
                team_name: this.state.newTeamName,
                team_description: this.state.newTeamDesc,
                team_manager: this.props.auth.user_id,
                team_creation_date: date,
                manager_has_to_accept: this.state.newTeamNotManaged ? 0 : 1
            });
        await this.apiService.addEntity('teammembers', { member_id: this.props.auth.user_id, team_id: teamData.data.team_id });
        this.props.getData();
        this.exit();
    }

    onTeamNameFilterChanged = (text) => {
        this.setState({ teamsNameFilter: text });
    }

}



const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(TeamsList)

