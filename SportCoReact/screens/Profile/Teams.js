import * as React from 'react';
import { Image, View } from 'react-native';
import { Divider, Text, Icon, Overlay, Button, CheckBox } from 'react-native-elements'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles, MARGIN_BETWEEN_ICONS } from './styles'
import * as RootNavigation from '../../navigation/RootNavigation.js';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import ProfileInput from './ProfileInput';
import { convertUTCDateToLocalDate } from '../Event/Helpers';


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
                        (<ScrollView
                            keyboardShouldPersistTaps='handled'>
                            <ProfileInput title={'Teams'} placeholderText={'Find by name...'}
                                data={this.state.teamsNameFilter} callbackOnChange={this.onTeamNameFilterChanged}
                                isAdding={isAdding} />
                            <View style={{ flexDirection: "column" }}>
                                {dataToShow.length == 0 && (
                                    <Text style={{ textAlign: 'center' }}>You may want to change the filter up there ...</Text>
                                )}
                                {dataToShow.map((team, index) => {
                                    return (
                                        <View key={'user' + index} style={{ flexDirection: 'column', justifyContent: 'center' }}  >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}  >
                                                <TouchableWithoutFeedback
                                                    style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                                                    onPress={() => { RootNavigation.navigateToProfile(team.email) }}
                                                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                    {team.photo_url != null ?
                                                        (
                                                            <Image source={{ uri: team.photo_url + '?type=large&width=500&height=500' }} style={styles.friendImage} />
                                                        ) : (
                                                            <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.friendImageNoBorder} />
                                                        )
                                                    }
                                                    <Text style={{ alignSelf: 'center', marginLeft: 30 }}>{team.team_name}</Text>

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
                                        </View>

                                    )
                                })}


                                <View>
                                    <Button
                                        title='Create a team !'
                                        onPress={() => this.setState({ isCreatingTeam: true })}
                                        style={{ marginTop: 50, width: '60%', alignSelf: 'center' }} />
                                </View>
                            </View>
                        </ScrollView>
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

    renderTeamCreator = () => {
        return (
            <View>
                <ProfileInput notShowingTitle title={'Teams'}
                    placeholderText={'Team Name Here'}
                    data={this.state.newTeamName} callbackOnChange={this.onTeamNameChanged}
                    isAdding={true} />
                <ProfileInput notShowingTitle title={'Teams'}
                    placeholderText={'Team Description Here'}
                    data={this.state.newTeamDesc} callbackOnChange={this.onTeamDescChanged}
                    isAdding={false} />
                <CheckBox
                    checked={this.state.newTeamNotManaged}
                    title='Joinable without manager acceptance'
                    onPress={() => { this.setState({ newTeamNotManaged: !this.state.newTeamNotManaged }) }} />
                <Button
                    title='All Good'
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

