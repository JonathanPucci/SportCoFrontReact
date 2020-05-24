import * as React from 'react';
import auth from '@react-native-firebase/auth';
import { Image, SafeAreaView, View, RefreshControl } from 'react-native';
import { Divider, Text, Button, Icon, Overlay } from 'react-native-elements'
import { Social } from '../../components/social'
import { ScrollView } from 'react-native-gesture-handler';

import { USER_LOGGED_OUT } from '../../Store/Actions'
import { connect } from 'react-redux'
import { LoginManager } from 'react-native-fbsdk';

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
import SmoothPicker from "react-native-smooth-picker";
import Bubble from '../Event/Bubble';
import Teams from './Teams';
import { getFileFromS3, uploadFileToS3 } from '../../services/aws3Service';
import ImagePickerTimaka from '../../components/ImagePicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import ProfilePic from './ProfilePic';
import { translate } from '../../App';

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
      allTeams: [],
      photo_url_s3Draft: 'null',
      isSpinning: false
    }
    this.apiService = new SportCoApi()
  }


  componentDidMount() {
    this.getData();
  }

  startSpinning = () => {
    this.setState({ loading: true })
  }

  stopSpinning = () => {
    this.setState({ loading: false })
  }

  getData = async () => {
    this.setState({ refreshing: true, loading: true }, async () => {
      let email = this.props.auth.user.email;

      if (this.props.route.params != undefined)
        email = this.props.route.params.email;
      try {
        let res = await this.apiService.getSingleEntity('users/email', email)
        let stats = await this.apiService.getSingleEntity('userstats', res.data.user_id)
        this.stopSpinning();
        this.setState({
          user: res.data,
          titleDraft: res.data.user_title,
          nameDraft: res.data.user_name,
          ageDraft: res.data.user_age,
          descriptionDraft: res.data.user_description,
          photo_url_s3Draft: getFileFromS3('users', res.data.photo_url_s3),
          photo_to_useDraft: res.data.photo_to_use,
          userstats: stats.data,
          isEditingProfile: false,
          isLookingAtFriends: false,
          refreshing: false,
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
                  {this.state.user.user_age + " ans"}
                </Text>
                <View style={[styles.desc, { flexDirection: 'row' }]}>
                  <Icon name='suitcase' type='font-awesome' color='#5E5E5E' size={20} />
                  <Text style={styles.title}>
                    : {this.state.user.user_title}
                  </Text>
                </View>
              </View>
              <ProfilePic
                edition={false}
                photo_to_useDraft={this.state.photo_to_useDraft}
                photoDraft={this.state.photo_url_s3Draft}
                user={this.state.user}
                stylePic={styles.image}
                styleDefault={styles.imageNoBorder}
                styleContainer={styles.imageContainer}
              />
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
            <ProfileBubbles title={translate('Last Events Created')} defaultText={translate("(Not yet, but I'll create one!)")}
              items={this.state.user.eventsCreated} user={this.state.user} />
            <Divider style={styles.divider} />
            <ProfileBubbles title={translate("Last Events Joined")} defaultText={translate("(On my way !)")}
              items={this.state.user.eventsJoined} user={this.state.user} />
            <Divider style={styles.divider} />
            <ProfileBubbles title={translate("Teams")} defaultText={translate("(I'm more of a lonesome cowboy)")}
              items={this.state.user.userTeams} user={this.state.user}
              wantsToJoinTeam={this.wantsToJoinTeam}
              wantsToSeeTeams={this.wantsToSeeTeams}
              waitingTeams={this.state.user.userTeamsWaiting}
              getData={this.getData}
            />
            <Divider style={styles.divider} />
            <ProfileBubbles title={translate('Friends')} defaultText={translate("(We're all friends anyway)")}
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
              <Text style={styles.desc}>{translate("Find me on Social here")}</Text>
              <View style={styles.socialLinks}>
                {/* <Social name="snapchat" /> */}
                <Social name="instagram" />
                <Social name="facebook" />
              </View>
            </View>
            <View style={{ marginVertical: 10, flex: 1 }}>
              <Button title={translate("Logout")} onPress={() => this.Logout()} />
            </View>
          </SafeAreaView>
          {this.renderOverlayProfileEdit()}
          <Spinner
            visible={this.state.loading}
            textContent={translate("Loading")}
            textStyle={{ color: 'white' }}
          />
        </ScrollView>
      </View >
    );
  }

  renderOverlayProfileEdit = () => {
    let arrayAges = Array.from({ length: 42 }, (_, i) => 13 + i);
    return (
      <Overlay
        isVisible={this.state.isEditingProfile}
        onBackdropPress={() => { this.setState({ isEditingProfile: false }) }}
      >
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <ProfilePic
              edition={this.state.isEditingProfile}
              photo_to_useDraft={this.state.photo_to_useDraft}
              photoDraft={this.state.photo_url_s3Draft}
              user={this.state.user}
              stylePic={styles.image}
              styleDefault={styles.imageNoBorder}
              styleContainer={styles.imageContainer}
            />
            <View style={{ alignSelf: 'center' }}>
              <ImagePickerTimaka
                saveToS3OnSelect={true}
                sendImageSource={this.manageNewImage}
                hasFBOption={this.state.user.photo_url != null}
                hasS3Option={this.state.user.photo_url_s3 != null}
              />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <ProfileInput title={translate("User Name")} placeholderText={translate("Name here ...")}
              data={this.state.user.user_name} callbackOnChange={this.onNameChange}
              isAdding={this.state.isAdding}
              noautofocus />
            <View style={{ marginBottom: 30 }}>
              <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{translate("Age")}</Text>
              <SmoothPicker
                onScrollToIndexFailed={(err) => { console.log("failedscrollindexprofile", err) }}
                initialScrollToIndex={parseInt(this.state.ageDraft) - 13}
                keyExtractor={(_, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onSelected={({ item, index }) => { this.onAgeChange(item, index) }}
                bounces={true}
                data={arrayAges}
                renderItem={({ item, index }) => {
                  return (
                    <Bubble horizontal selected={item === (parseInt(this.state.ageDraft))} >
                      {item}
                    </Bubble>
                  )
                }}
              />
            </View>
            <ProfileInput title={translate('Job / Title')} placeholderText={translate("Title here ...")}
              data={this.state.user.user_title} callbackOnChange={this.onTitleChange}
              isAdding={this.state.isAdding}
              noautofocus />
            <ProfileInput title={translate("Bio")} placeholderText={translate("Description here ...")}
              data={this.state.user.user_description} callbackOnChange={this.onDescriptionChange}
              isAdding={this.state.isAdding}
              noautofocus />
            <SaveButton
              title={`| ` + translate("Save") + `?`}
              callback={this.saveProfile}
            />
          </View>
        </ScrollView>
      </Overlay>

    )
  }

  manageNewImage = async (sourceURI) => {
    if (sourceURI == 'defaultPic')
      this.setState({ photo_to_useDraft: 'default' })
    else if (sourceURI == 'fb')
      this.setState({ photo_to_useDraft: 'fb' })
    else if (sourceURI == 's3')
      this.setState({ photo_to_useDraft: 'custom' })
    else
      this.setState({ photo_url_s3Draft: sourceURI, photo_to_useDraft: 'custom' })

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

  onNameChange = (text) => {
    this.setState({ nameDraft: text });
  }

  onAgeChange = (item, index) => {
    this.setState({ ageDraft: item });
  }

  onTitleChange = (text) => {
    this.setState({ titleDraft: text });
  }

  onDescriptionChange = (text) => {
    this.setState({ descriptionDraft: text });
  }

  saveProfile = async () => {
    this.setState({ isEditingProfile: false });
    let editedUser = this.state.user;
    editedUser.user_name = this.state.nameDraft;
    editedUser.user_title = this.state.titleDraft;
    editedUser.user_description = this.state.descriptionDraft;
    editedUser.user_age = this.state.ageDraft;
    editedUser.photo_to_use = this.state.photo_to_useDraft;
    if (this.state.photo_url_s3Draft != this.state.user.photo_url_s3) {
      this.startSpinning();
      let response = await uploadFileToS3(this.state.photo_url_s3Draft, this.state.user.user_id)
      let imageName = response.key + "?" + new Date().getTime();
      editedUser.photo_url_s3 = imageName;
    }
    this.startSpinning();
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
      let res = await auth().signOut();
      LoginManager.logOut();
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

