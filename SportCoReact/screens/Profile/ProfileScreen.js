import * as React from 'react';
import {firebase} from '@react-native-firebase/auth';
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


class ProfileScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      user: undefined,
      sportsSelected: [''],
      refreshing: false,
      isEditingProfile: false
    }
    this.apiService = new SportCoApi()
  }


  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({ refreshing: true }, () => {
      let email = this.props.auth.user.email;

      if (this.props.route.params != undefined)
        email = this.props.route.params.email;

      this.apiService.getSingleEntity('users/email', email)
        .then(res => {
          this.apiService.getSingleEntity('userstats', res.data.user_id)
            .then(stats => {
              this.setState({
                user: res.data,
                titleDraft: res.data.user_title,
                descriptionDraft: res.data.user_description,
                userstats: stats.data,
                isEditingProfile: false,
                refreshing: false
              });
            });
        })
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
                    <Image source={require('../../assets/images/basicProfilePic.png')} resizeMode='contain' style={styles.imageNoBorder} />
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
            <Text style={styles.desc}>
              Last Events Created
              </Text>
              {this.state.user.eventsCreated.length == 0 && (<Text style={{marginLeft:25}}> (None yet, but I'll create one !)</Text>)}
            <View style={{ marginTop: 10, marginLeft: MARGIN_BETWEEN_ICONS, flexDirection: 'row' }}>
              {this.state.user.eventsCreated.slice(0, MAX_ON_LINE).map((item, index) => {
                let eventIcon = mapSportIcon(item.sport.toLowerCase());
                return (
                  <TouchableWithoutFeedback 
                  key={'userEvent' + index} 
                  style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                  onPress={()=> { RootNavigation.navigateToEvent(item.event_id)}}>
                    <Image
                      source={eventIcon.image}
                      style={styles.imageUserEvent}
                    />
                    <View style={styles.iconOnEvent}>
                      <Icon name='record-voice-over' color='white' size={10} />
                    </View>
                  </TouchableWithoutFeedback>
                )
              })}
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.desc}>
              Last Events Joined  
              </Text>
              {this.state.user.eventsCreated.length == 0 && (<Text style={{marginLeft:25}}> (On my way !)</Text>)}
            <View style={{ marginTop: 10, marginLeft: MARGIN_BETWEEN_ICONS, flexDirection: 'row' }}>
              {this.state.user.eventsJoined.slice(0, MAX_ON_LINE).map((item, index) => {
                let eventIcon = mapSportIcon(item.sport.toLowerCase());
                return (
                  <TouchableWithoutFeedback 
                  key={'userJoined' + index} 
                  style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                  onPress={()=> { RootNavigation.navigateToEvent(item.event_id)}}>
                    <Image
                      source={eventIcon.image}
                      style={styles.imageUserEvent}
                    />
                    <View style={styles.iconOnEvent}>
                      <Icon name='fast-rewind' color='white' size={10} />
                    </View >
                  </TouchableWithoutFeedback>
                )
              })}
            </View>
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
                <Social name="snapchat" />
                <Social name="instagram" />
                <Social name="facebook-square" />
              </View>
            </View>
            <View style={{ marginVertical: 10, flex: 1 }}>
              <Button title={'Logout'} onPress={() => this.Logout()} />
            </View>
          </SafeAreaView>
          <Overlay
            isVisible={this.state.isEditingProfile}
            onBackdropPress={() => { this.setState({ isEditingProfile: false }) }}
          >
            <View>
              <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Job / Title</Text>
              <TouchableWithoutFeedback style={styles.inputView}
              onPress={()=>{this.titleInput.focus()}}>
                <TextInput
                  style={styles.textInput}
                  ref={(input) => { this.titleInput = input; }}
                  autoFocus
                  onChangeText={this.onTitleChange}
                  defaultValue={this.state.user.user_title}
                  placeholder='Title here ...'
                  multiline
                />
              </TouchableWithoutFeedback>
              <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Bio</Text>
              <TouchableWithoutFeedback style={styles.inputView}
              onPress={()=>{this.descInput.focus()}}>
                <TextInput
                  style={styles.textInput}
                  ref={(input) => { this.descInput = input; }}

                  autoFocus
                  onChangeText={this.onDescriptionChange}
                  defaultValue={this.state.user.user_description}
                  placeholder='Description here ...'
                  multiline
                />
              </TouchableWithoutFeedback>
              <SaveButton
                title={`| Enregister?`}
                callback={this.saveProfile}
              />
            </View>
          </Overlay>

        </ScrollView>
      </View >
    );
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
    const data = await this.apiService.editEntity('users', editedUser);
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

