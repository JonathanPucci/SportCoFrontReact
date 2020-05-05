import * as React from 'react';
import { firebase } from '@react-native-firebase/auth';
import { Image, SafeAreaView, View, RefreshControl, TextInput } from 'react-native';
import { Divider, Text, Button, Icon, Overlay } from 'react-native-elements'
import { Social } from '../../components/social'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { USER_LOGGED_OUT } from '../../Store/Actions'
import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles, MAX_ON_LINE, MARGIN_BETWEEN_ICONS } from './styles'
import SportsAvailable from '../../components/SportsAvailable';
import Emoji from 'react-native-emoji';
import { SaveButton } from '../Event/OverlaysEventEdition';
import { mapSportIcon } from '../../helpers/mapper';
import * as RootNavigation from '../../navigation/RootNavigation.js';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'


class ProfileScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      user: undefined,
      sportsSelected: [''],
      refreshing: false,
      isEditingProfile: false,
      areFriendsVisible: false,
      friendsNameFilter: '',
      allUsers: []
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
        console.log("error retrieving profile info");
        console.log(err);
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
            {this.renderBubbles('Last Events Created', "(Not yet, but I'll create one!)", this.state.user.eventsCreated)}
            <Divider style={styles.divider} />
            {this.renderBubbles('Last Events Joined', '(On my way !)', this.state.user.eventsJoined)}
            <Divider style={styles.divider} />
            {this.renderBubbles('Friends', "(We're all friends anyway)", this.state.user.userFriends)}
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
          {this.renderOverlayFriends()}
        </ScrollView>
      </View >
    );
  }

  renderBubbles = (title, defaultText, items) => {
    return (
      <View>
        <Text style={styles.desc}>
          {title}
        </Text>
        {items.length == 0 && (<Text style={{ marginLeft: 25 }}> {defaultText}</Text>)}
        <View style={{ marginTop: 10, marginLeft: MARGIN_BETWEEN_ICONS, flexDirection: 'row' }}>
          {items.slice(0, title == 'Friends' ? MAX_ON_LINE - 2 : MAX_ON_LINE).map((item, index) => {

            return (
              <TouchableWithoutFeedback
                key={title.split(' ')[title.split(' ').length - 1] + index}
                style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                onPress={() => { title == 'Friends' ? RootNavigation.navigateToProfile(item.email) : RootNavigation.navigateToEvent(item.event_id) }}>
                {title != 'Friends' ?
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
                  {title != 'Friends' ?
                    (<Icon name={title.includes('Joined') ? 'fast-rewind' : 'record-voice-over'} color='white' size={10} />)
                    : (
                      <Text style={{ color: "white", fontSize: 8, textAlign: "center" }}>
                        {item.user_name != undefined ?
                          (item.user_name.split(' ')[0][0] + (item.user_name.split(' ').length > 0 ? item.user_name.split(' ')[1][0] : ''))
                          : ''}
                      </Text>
                    )
                  }
                </View >
              </TouchableWithoutFeedback>
            )
          })}

          {title == 'Friends' && (this.state.user.user_id == this.props.auth.user_id) /*&& this.state.user.userFriends.length > MAX_ON_LINE-2 */ && (
            <TouchableWithoutFeedback
              style={{ marginLeft: MARGIN_BETWEEN_ICONS, alignItems: 'center', justifyContent: 'center' }}
              onPress={this.wantsToSeeFriends}>
              <Icon name='more-horiz' size={15} raised color='blue' />

            </TouchableWithoutFeedback>
          )}
          {title == 'Friends' && (this.state.user.user_id == this.props.auth.user_id) && (
            <TouchableWithoutFeedback
              style={{ alignItems: 'center', justifyContent: 'center' }}
              onPress={this.wantsToAddFriend}>
              <Icon name='add' size={15} raised color='blue' />

            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    )
  }

  renderOverlayFriends = () => {
    let dataToShow = this.state.isAdding ? this.state.allUsers : this.state.user.userFriends;
    dataToShow = dataToShow.filter((item, index) => {
      return item.user_name != null && item.user_id != this.props.auth.user_id ?
        this.state.isAdding ?
          this.state.friendsNameFilter.length >= 1 ?
            item.user_name.toLowerCase().includes(this.state.friendsNameFilter.toLowerCase())
            : false
          : item.user_name.toLowerCase().includes(this.state.friendsNameFilter.toLowerCase())
        : false
    })
    if (this.state.isAdding)
      dataToShow = dataToShow.filter((item, index) => {
        return item.user_id != this.props.auth.user_id
      })
    return (
      <Overlay
        isVisible={this.state.areFriendsVisible}
        onBackdropPress={() => { this.setState({ areFriendsVisible: false, friendsNameFilter: '' }) }}
        overlayStyle={styles.overlay}
      >
        <ScrollView
          keyboardShouldPersistTaps='always'>
          {this.renderInput('Friends', 'Find by name...', this.state.friendsNameFilter, this.onFriendNameFilterChanged)}
          <View style={{ flexDirection: "column" }}>
            {dataToShow.length == 0 && (
              <Text style={{ textAlign: 'center' }}>You may want to change the filter up there ...</Text>
            )}
            {dataToShow.map((user, index) => {
              return (
                <View key={'user' + index} style={{ flexDirection: 'column', justifyContent: 'center' }}  >
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}  >
                    <TouchableWithoutFeedback
                      style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                      onPress={() => { RootNavigation.navigateToProfile(user.email) }}
                      style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      {user.photo_url != null ?
                        (
                          <Image source={{ uri: user.photo_url + '?type=large&width=500&height=500' }} style={styles.friendImage} />
                        ) : (
                          <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.friendImageNoBorder} />
                        )
                      }
                      <Text style={{ alignSelf: 'center', marginLeft: 30 }}>{user.user_name}</Text>

                    </TouchableWithoutFeedback>
                    {this.state.isAdding && (this.state.user.user_id == this.props.auth.user_id) ?
                      (
                        <View>
                          {this.state.user.userFriends.some(friend => {
                            return friend.friend_id == user.user_id
                          }) ?
                            <Icon name='remove' reverse size={18}
                              color='red'
                              style={{ margin: 30 }}
                              onPress={() => { this.removeFriend(user.user_id) }}
                            /> :
                            <Icon name='add' reverse size={18}
                              color='green'
                              style={{ margin: 30 }}
                              onPress={() => { this.addAsFriend(user.user_id) }}
                            />}
                        </View>
                      )
                      :
                      (<Icon name='remove' reverse size={18}
                        color='red'
                        style={{ margin: 30 }}
                        onPress={() => { this.removeFriend(user.friend_id) }}
                      />)

                    }
                  </View>
                  <Divider style={{ margin: 10 }} />
                </View>

              )
            })}
          </View>
        </ScrollView>
      </Overlay >
    )
  }

  addAsFriend = async (friend_id) => {
    await this.apiService.addEntity('userfriends', { user_id: this.props.auth.user_id, friend_id: friend_id });
    this.getData();
  }

  removeFriend = async (friend_id) => {
    await this.apiService.deleteEntity('userfriends', { user_id: this.props.auth.user_id, friend_id: friend_id });
    this.getData();
  }

  onFriendNameFilterChanged = (text) => {
    this.setState({ friendsNameFilter: text });
  }

  renderOverlayProfileEdit = () => {
    return (
      <Overlay
        isVisible={this.state.isEditingProfile}
        onBackdropPress={() => { this.setState({ isEditingProfile: false, friendsNameFilter: '' }) }}
      >
        <View>
          {this.renderInput('Job / Title', 'Title here ...', this.state.user.user_title, this.onTitleChange)}
          {this.renderInput('Bio', 'Description here ...', this.state.user.user_description, this.onDescriptionChange)}
          <SaveButton
            title={`| Enregister?`}
            callback={this.saveProfile}
          />
        </View>
      </Overlay>

    )
  }

  renderInput = (title, placeholderText, data, callbackOnChange) => {
    return (
      <View>
        <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        <TouchableWithoutFeedback style={styles.inputView}
          onPress={() => { this[title].focus() }}>
          <TextInput
            style={title != 'Friends' ? styles.textInput : styles.textInputFriends}
            ref={(input) => { this[title] = input; }}
            autoFocus={title == 'Friends' ? this.state.isAdding : true}
            onChangeText={callbackOnChange}
            defaultValue={data}
            placeholder={placeholderText}
            multiline
          />
        </TouchableWithoutFeedback>
      </View>
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

