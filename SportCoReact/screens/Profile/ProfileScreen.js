import * as React from 'react';
import { firebase } from '@react-native-firebase/auth';
import { Image, SafeAreaView, View, RefreshControl } from 'react-native';
import { Divider, Text, Button, Icon, Overlay } from 'react-native-elements'
import { Social } from '../../components/social'
import { ScrollView } from 'react-native-gesture-handler';

import { USER_LOGGED_OUT } from '../../Store/Actions'
import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles } from './styles'
import SportsAvailable from '../../components/SportsAvailable';
import Emoji from 'react-native-emoji';
import { SaveButton } from '../Event/OverlaysEventEdition';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import Friends from './Friends';
import ProfileBubbles from './ProfileBubbles';
import { logDebugError } from '../Event/Helpers';
import ProfileInput from './ProfileInput';
import Teams from './Teams';


class ProfileScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      user: undefined,
      sportsSelected: [''],
      refreshing: false,
      isEditingProfile: false,
      areFriendsVisible: false,
      areTeamsVisible: false,
      allUsers: [],
      allTeams: []
    }
    this.apiService = new SportCoApi()
  }


  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ refreshing: true }, async () => {
      let email = this.props.auth.user.email;

      if (this.props.route.params != undefined)
        email = this.props.route.params.email;
      try {
        let res = await this.apiService.getSingleEntity('users/email', email)
        let stats = await this.apiService.getSingleEntity('userstats', res.data.user_id)
        this.setState({
          user: res.data,
          titleDraft: res.data.user_title,
          descriptionDraft: res.data.user_description,
          userstats: stats.data,
          isEditingProfile: false,
          isLookingAtFriends: false,
          refreshing: false
        });
      }
      catch (err) {
        logDebugError("error retrieving profile info", err);
      }
    })
  }

  render() {
    if (this.state.user == undefined)
      return <View />
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData.bind(this)} />
          }
          keyboardShouldPersistTaps='always'>
          <SafeAreaView style={styles.container}>
            <View style={styles.basicInfoContainer}>
              <View style={styles.basicInfo}>
                <Text h4 style={styles.name}>
                  {this.state.user.user_name}
                </Text>
                <Text h5 style={styles.name}>
                  25 ans
                </Text>
                <View style={[styles.desc, { flexDirection: 'row' }]}>
                  <Icon name='suitcase' type='font-awesome' color='#5E5E5E' size={20} />
                  <Text style={styles.title}>
                    : {this.state.user.user_title}
                  </Text>
                </View>
              </View>
              <View style={styles.imageContainer}>
                {this.state.user.photo_url != null ?
                  (
                    <Image source={{ uri: this.state.user.photo_url + '?type=large&width=500&height=500' }} style={styles.image} />
                  ) : (
                    <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.imageNoBorder} />
                  )
                }
              </View>
            </View>
            <Divider style={styles.divider} />

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.desc}>
                Bio :  {this.state.user.user_description}
                {this.state.user.user_description == 'Oh yeah' && (
                  <Emoji name={'man_dancing'} style={{ fontSize: 15 }} />
                )}
              </Text>
              {(this.state.user.user_id == this.props.auth.user_id) && (
                <View style={{ position: 'absolute', right: 30, top: -15 }}>
                  <Icon
                    raised
                    name='edit'
                    type='font-awesome'
                    color='orange'
                    size={15}
                    onPress={() => { this.setState({ isEditingProfile: true }) }} />
                </View>
              )}
            </View>
            <Divider style={styles.divider} />
            <ProfileBubbles title={'Last Events Created'} defaultText={"(Not yet, but I'll create one!)"}
              items={this.state.user.eventsCreated} user={this.state.user} />
            <Divider style={styles.divider} />
            <ProfileBubbles title={'Last Events Joined'} defaultText={'(On my way !)'}
              items={this.state.user.eventsJoined} user={this.state.user} />
            <Divider style={styles.divider} />
            <ProfileBubbles title={'Teams'} defaultText={"(I'm more of a lonesome cowboy)"}
              items={this.state.user.userTeams} user={this.state.user}
              wantsToJoinTeam={this.wantsToJoinTeam}
              wantsToSeeTeams={this.wantsToSeeTeams}
              waitingTeams={this.state.user.userTeamsWaiting} 
              getData={this.getData}
              />
            <Divider style={styles.divider} />
            <ProfileBubbles title={'Friends'} defaultText={"(We're all friends anyway)"}
              items={this.state.user.userFriends} user={this.state.user}
              wantsToAddFriend={this.wantsToAddFriend}
              wantsToSeeFriends={this.wantsToSeeFriends} />
            <Friends
              isAdding={this.state.isAdding}
              user={this.state.user}
              allUsers={this.state.allUsers}
              areFriendsVisible={this.state.areFriendsVisible}
              stopShowingFriends={() => { this.setState({ areFriendsVisible: false }) }}
              getData={this.getData}
            />
            <Teams
              isAdding={this.state.isAdding}
              user={this.state.user}
              allTeams={this.state.allTeams}
              areTeamsVisible={this.state.areTeamsVisible}
              stopShowingTeams={() => { this.setState({ areTeamsVisible: false }) }}
              getData={this.getData}
            />
            <Divider style={styles.divider} />
            <View style={styles.sports}>
              <SportsAvailable
                user_id={this.state.user.user_id}
                showStats={true}
                stats={this.state.userstats}
                sportsSelected={this.state.sportsSelected}
                sportsSelectedChanged={(newsports) => { this.setState({ sportsSelected: newsports }) }}
                ratingCompleted={this.ratingCompleted.bind(this)} />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.bottom}>
              <Text style={styles.desc}>Find me on Social here</Text>
              <View style={styles.socialLinks}>
                {/* <Social name="snapchat" /> */}
                <Social name="instagram" />
                <Social name="facebook" />
              </View>
            </View>
            <View style={{ marginVertical: 10, flex: 1 }}>
              <Button title={'Logout'} onPress={() => this.Logout()} />
            </View>
          </SafeAreaView>
          {this.renderOverlayProfileEdit()}
        </ScrollView>
      </View >
    );
  }

  renderOverlayProfileEdit = () => {
    return (
      <Overlay
        isVisible={this.state.isEditingProfile}
        onBackdropPress={() => { this.setState({ isEditingProfile: false }) }}
      >
        <View>
          <ProfileInput title={'Job / Title'} placeholderText={'Title here ...'}
            data={this.state.user.user_title} callbackOnChange={this.onTitleChange}
            isAdding={this.state.isAdding} />
          <ProfileInput title={'Bio'} placeholderText={'Description here ...'}
            data={this.state.user.user_description} callbackOnChange={this.onDescriptionChange}
            isAdding={this.state.isAdding} />
          <SaveButton
            title={`| Enregister?`}
            callback={this.saveProfile}
          />
        </View>
      </Overlay>

    )
  }

  wantsToAddFriend = async () => {
    let allUsers = await this.apiService.getAllEntities('users');
    allUsers = allUsers.data;
    this.setState({ areFriendsVisible: true, allUsers: allUsers, isAdding: true })
  }

  wantsToSeeFriends = () => {
    this.setState({ areFriendsVisible: true, isAdding: false })
  }

  wantsToJoinTeam = async () => {
    let allTeams = await this.apiService.getAllEntities('teams');
    allTeams = allTeams.data;
    this.setState({ areTeamsVisible: true, allTeams: allTeams, isAdding: true })
  }

  wantsToSeeTeams = () => {
    this.setState({ areTeamsVisible: true, isAdding: false })
  }

  onTitleChange = (text) => {
    this.setState({ titleDraft: text });
  }

  onDescriptionChange = (text) => {
    this.setState({ descriptionDraft: text });
  }

  saveProfile = async () => {
    let editedUser = this.state.user;
    editedUser.user_title = this.state.titleDraft;
    editedUser.user_description = this.state.descriptionDraft;
    await this.apiService.editEntity('users', editedUser);
    this.getData();
  }

  ratingCompleted(sport, level) {
    let userstats = this.state.userstats;
    userstats[sport].level = level;
    this.setState({ userstats: userstats })
    this.apiService.editEntity('userstats/level', {
      sport_level: sport + '_level',
      level: level,
      user_id: this.state.user.user_id
    })
  }


  Logout = async () => {
    try {
      //try the clean way
      let res = await firebase.auth().signOut();
      console.log('logged out');
      const action = { type: USER_LOGGED_OUT, payload: null };
      this.props.dispatch(action);
    } catch (error) {
      console.log(error.toString(error));
    }
    const action = { type: USER_LOGGED_OUT, payload: null };
    this.props.dispatch(action);
  };
}


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(ProfileScreen)

