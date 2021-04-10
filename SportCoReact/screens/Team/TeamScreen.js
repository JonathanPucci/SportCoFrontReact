import * as React from 'react';
import { firebase } from '@react-native-firebase/auth';
import { Image, SafeAreaView, View, RefreshControl } from 'react-native';
import { Divider, Text, Button, Icon, Overlay, CheckBox } from 'react-native-elements'
import { Social } from '../../components/social'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImagePickerTimaka from '../../components/ImagePicker';

import { USER_LOGGED_OUT } from '../../Store/Actions'
import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles } from './styles'
import SportsAvailable from '../../components/SportsAvailable';
import Emoji from 'react-native-emoji';
import { SaveButton } from '../Event/OverlaysEventEdition';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import Members from './Members';
import { logDebugError, timeSince } from '../Event/Helpers';
import ProfileInput from '../Profile/ProfileInput';
import { navigateToProfile } from '../../navigation/RootNavigation';
import { translate } from '../../App';
import { getFileFromS3, uploadFileToS3 } from '../../services/aws3Service';


class TeamScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      team: undefined,
      refreshing: false,
      isEditingTeam: false,
      isSelectingNewManager: false,
      nameDraft: '',
      descriptionDraft: '',
      manager_has_to_acceptDraft: false,
      photo_to_useDraft: '',
      newManagerId: -1,
    }
    this.apiService = new SportCoApi()
  }


  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ refreshing: true, isEditingTeam: false }, async () => {
      let team_id = -1;

      if (this.props.route.params != undefined)
        team_id = this.props.route.params.team_id;
      try {
        let res = await this.apiService.getSingleEntity('teams', team_id);
        this.setState({
          team: res.data.team,
          members: res.data.teammembers,
          waitingMembers: res.data.waitingMembers,
          refreshing: false,
          manager_has_to_acceptDraft: res.data.team.manager_has_to_accept,
          photo_to_useDraft: res.data.team.team_picture
        });
      }
      catch (err) {
        logDebugError("error retrieving team info", err);
      }
    })
  }

  render() {
    if (this.state.team == undefined)
      return <View />
    let fb_access_token = this.props.auth.user.fb_access_token;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData.bind(this)} />}
          keyboardShouldPersistTaps='always'>
          <SafeAreaView style={styles.container}>
            <View style={styles.basicInfoContainer}>
              <View style={styles.basicInfo}>
                <Text h4 style={styles.name}>
                  {this.state.team.team_name}
                </Text>
                <Text h5 style={styles.name}>
                  {translate("Alive for")} : {timeSince(new Date(this.state.team.team_creation_date))}
                </Text>
                <Text h5 style={styles.name}>
                  {this.state.team.manager_has_to_accept ?
                    translate("Team manager has to accept every new member") :
                    translate("Anyone can join the team !")
                  }
                </Text>
              </View>
              <View style={styles.imageContainer}>
                {this.state.team.team_picture != null ?
                  <Image source={{ uri: getFileFromS3('teams', this.state.team.team_picture) }} style={styles.image} />
                  : (
                    <View>
                      {this.state.photo_to_useDraft != null && this.state.photo_to_useDraft != '' ?
                        <Image source={{ uri: this.state.photo_to_useDraft }} style={styles.image} />
                        :
                        <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.imageNoBorder} />
                      }
                    </View>
                  )
                }
              </View>

            </View>
            <Divider style={styles.divider} />

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.desc}>
                {translate("Description")} :  {this.state.team.team_description}
                {this.state.team.team_description == 'Oh yeah' && (
                  <Emoji name={'man_dancing'} style={{ fontSize: 15 }} />
                )}
              </Text>
              {(this.state.team.team_manager == this.props.auth.user_id) && (
                <View style={{ position: 'absolute', right: 30, top: -15 }}>
                  <Icon
                    raised
                    name='edit'
                    type='font-awesome'
                    color='orange'
                    size={15}
                    onPress={() => { this.setState({ isEditingTeam: true }) }} />
                </View>
              )}
            </View>
            <Divider style={styles.divider} />
            {this.renderOptions()}
            <Members items={this.state.members} team={this.state.team} />
            {this.props.auth.user_id == this.state.team.team_manager && (
              <View>
                <Divider style={styles.divider} />
                <Members items={this.state.waitingMembers} toBeValidated={true}
                  acceptMember={this.acceptMember}
                  declineMember={this.declineMember}
                  team={this.state.team}
                />

              </View>
            )}
          </SafeAreaView>
          {this.renderOverlayTeamEdit()}
        </ScrollView>
        {this.renderOverlayTeamManagerSelector()}
      </View >
    );
  }

  renderOptions = () => {
    return (
      <View>
        {this.state.team.team_manager == this.props.auth.user_id ?
          <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
            <Button title={translate("Delete Team")} buttonStyle={{ backgroundColor: 'red' }} onPress={this.deleteTeam}
              icon={<Icon name='deleteusergroup' color='white' type='antdesign' size={20} />}
            />
            {this.state.members.length > 1 &&
              <Button title={translate("Select new manager")} buttonStyle={{ backgroundColor: 'red', margin: 20 }} onPress={this.selectNewManager}
                icon={<Icon name='exit-run' color='white' type='material-community' size={20} />}
              />}
          </View>
          :
          <View>
            {this.state.members.some((member) => { return member.member_id == this.props.auth.user_id }) ?
              <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                <Button title={translate("Leave Team")} buttonStyle={{ backgroundColor: 'red' }} onPress={this.leaveTeamOrStopWaiting}
                  icon={<Icon name='exit-run' color='white' type='material-community' size={20} />}
                />
              </View>
              :
              <View>
                {this.state.waitingMembers.some((member) => { return member.member_id == this.props.auth.user_id }) ?
                  <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                    <Button title={translate("Waiting For Approval")} buttonStyle={{ backgroundColor: 'orange' }} onPress={() => { }}
                      icon={<Icon name='timer-sand' color='white' type='material-community' size={20} />}
                    />
                  </View>
                  :
                  <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                    <Button title={translate("Join Team")} buttonStyle={{ backgroundColor: 'green' }} onPress={this.joinTeam}
                      icon={<Icon name='door-open' color='white' type='material-community' size={20} />}
                    />
                  </View>
                }
              </View>
            }
          </View>
        }
      </View>
    )
  }

  renderOverlayTeamEdit = () => {
    return (
      <Overlay
        isVisible={this.state.isEditingTeam}
        onBackdropPress={() => { this.setState({ isEditingTeam: false }) }} >
        <View>
          <View style={styles.imageContainer}>
            {this.state.team.team_picture != null ?
              <Image source={{ uri: getFileFromS3('teams', this.state.team.team_picture) }} style={styles.image} />
              : (
                <View>
                  {this.state.photo_to_useDraft != '' ?
                    <Image source={{ uri: this.state.photo_to_useDraft }} style={styles.image} />
                    :
                    <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.imageNoBorder} />
                  }
                </View>
              )
            }
          </View>
          <View style={{ alignSelf: 'center' }}>
            <ImagePickerTimaka
              saveToS3OnSelect={true}
              sendImageSource={async (sourceURI) => { this.setState({ photo_to_useDraft: sourceURI }) }}
              hasFBOption={false}
              hasS3Option={false}
              s3Folder='teams'
            />
          </View>
          <ProfileInput title={translate("Team Name")} placeholderText={translate("Title here ...")}
            data={this.state.team.team_name} callbackOnChange={this.onTeamNameChange}
            isAdding={this.state.isAdding} />
          <ProfileInput title={translate('Bio')} placeholderText={translate('Description here')}
            data={this.state.team.team_description} callbackOnChange={this.onDescriptionChange}
            isAdding={this.state.isAdding} />
          <CheckBox
            checked={!this.state.manager_has_to_acceptDraft}
            title={translate("Joinable without manager acceptance")}
            onPress={() => { this.setState({ manager_has_to_acceptDraft: !this.state.manager_has_to_acceptDraft }) }} />
          <SaveButton
            title={`| ` + translate("Save") + `?`}
            callback={this.saveTeam} />
        </View>
      </Overlay>

    )
  }

  renderOverlayTeamManagerSelector = () => {
    return (
      <Overlay
        isVisible={this.state.isSelectingNewManager}
        onBackdropPress={this.stopSelectingNewManager} >
        <View style={{ flex: 1 }}>
          {this.state.newManagerId != -1 &&
            <Button
              buttonStyle={{ alignSelf: 'flex-start' }}
              title={translate("Yep, that's him")}
              icon={<Icon name='check' size={15} />}
              onPress={this.doSelectNewManager} />
          }
          <Members
            items={this.state.members.filter((member) => { return member.member_id != this.props.auth.user_id })}
            canSelect
            selectedChanged={(newManagerId) => { this.setState({ newManagerId: newManagerId }) }}
            selectedMember={this.state.newManagerId} />
        </View>
      </Overlay>

    )
  }



  joinTeam = async () => {
    console.log(this.state);
    await this.apiService.addEntity(this.state.team.manager_has_to_accept == 1 ? 'teammembers/waiting' : 'teammembers', { member_id: this.props.auth.user_id, team_id: this.state.team.team_id });
    let dataManager = await this.apiService.getSingleEntity('users', this.state.team.team_manager);
    let notif = {
      sender_id: this.props.auth.user_id,
      user_id: this.state.team.team_manager,
      user_push_token: dataManager.data.user_push_token,
      team_id: this.state.team.team_id,
      notif_message_type: this.state.team.manager_has_to_accept == 1 ? 'WANTS_TO_JOIN_TEAM' : 'NEW_TEAM_MEMBER',
      notif_data_type: 'team_id',
      notif_data_value: this.state.team.team_id,
      sender_photo_url: this.props.auth.user.photo_url
    }
    await this.apiService.addEntity('notify/user', notif)
    this.getData();
  }

  leaveTeamOrStopWaiting = async () => {
    await this.apiService.deleteEntity('teammembers', { member_id: this.props.auth.user_id, team_id: this.state.team.team_id });
    this.getData();
  }

  deleteTeam = async () => {
    await this.apiService.deleteEntity('teams', { team_id: this.state.team.team_id });
    this.props.route.params.onGoBackCallback();
    this.props.navigation.goBack();
  }

  selectNewManager = () => {
    this.setState({ isSelectingNewManager: true })
  }

  stopSelectingNewManager = () => {
    this.setState({ isSelectingNewManager: false })
  }

  doSelectNewManager = async () => {
    if (this.state.newManagerId != -1) {
      let team = this.state.team;
      team.team_manager = this.state.newManagerId;
      await this.apiService.editEntity('teams', team);
      this.stopSelectingNewManager();
    }
  }

  acceptMember = async (member) => {
    try {
      await this.apiService.addEntity('teammembers', { member_id: member.user_id, team_id: this.state.team.team_id });
      try {
        await this.apiService.deleteEntity('teammembers/waiting', { member_id: member.user_id, team_id: this.state.team.team_id });
        this.getData();
      }
      catch (err) {
        logDebugError('ERROR DELETING waitingteammember', err);
      }
    }
    catch (err) {
      logDebugError('ERROR ACCEPTING teammember', err);
    }
  }

  declineMember = async (member) => {
    try {
      await this.apiService.deleteEntity('teammembers/waiting', { member_id: member.user_id, team_id: this.state.team.team_id });
      this.getData();
    }
    catch (err) {
      logDebugError('ERROR DELETING waitingteammember', err);
    }
  }

  onTeamNameChange = (text) => {
    this.setState({ nameDraft: text });
  }

  onDescriptionChange = (text) => {
    this.setState({ descriptionDraft: text });
  }

  saveTeam = async () => {
    let editedTeam = this.state.team;
    editedTeam.team_title = this.state.titleDraft;
    editedTeam.team_description = this.state.descriptionDraft;
    editedTeam.manager_has_to_accept = this.state.manager_has_to_acceptDraft ? 1 : 0;
    if (this.state.photo_to_useDraft != this.state.team.team_picture) {
      console.log(this.state.photo_to_useDraft + '!=' + this.state.team.team_picture)
      let response = await uploadFileToS3(this.state.photo_to_useDraft, this.state.team.team_id, 'teams/')
      let imageName = response.key + "?" + new Date().getTime();
      editedTeam.team_picture = imageName;
    }
    await this.apiService.editEntity('teams', editedTeam);
    this.getData();
  }

}


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(TeamScreen)

