import * as React from 'react';
import * as firebase from 'firebase';
import { Image, SafeAreaView, View } from 'react-native';
import { Divider, Text, Button } from 'react-native-elements'
import { Social } from '../../components/social'
import Icon from '../../components/Icon'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import {USER_LOGGED_OUT} from '../../Store/Actions'
import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles } from './styles'

class ProfileScreen extends React.Component {

  state = {
    sportsSelected: ['Tennis'],
    apiService : new SportCoApi(),
    userPseudoName : 'Squatman'
  }

  componentDidMount(){
    this.state.apiService.getSingleEntity('users',1)
    .then(res => {
      this.setState({userPseudoName : res.data.User_Name});
    })
  }

  render() {
    let photoURL = '';
    let displayName = '';
    if(this.props.auth && this.props.auth.user != null && this.props.auth.user != {}){
      photoURL= this.props.auth.user.photoURL + '?type=large&width=500&height=500';
      displayName = this.props.auth.user.displayName;
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <SafeAreaView style={styles.container}>
            <View style={styles.basicInfoContainer}>
              <View style={styles.basicInfo}>
                <Text h4 style={styles.name}>
                  {displayName}
                </Text>
                <Text h5 style={styles.name}>
                25 ans
                </Text>
                <Text style={styles.desc}>Developer at DreamTeam & Co.</Text>
              </View>
              <View style={styles.imageContainer}>
              {photoURL!= '' && <Image source={{uri: photoURL }} style={styles.image} />}
              {photoURL== '' && <Image source={require('../../assets/images/robot-dev.png') } style={styles.image} />}
              </View>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.desc}>
              {this.state.userPseudoName + ` : As everyone else, need to get out of this containment, let's play a basketball once it's all over.
              \rPure squatteur.`}
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.sports}>
              {this.renderSports()}
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

        </ScrollView>
      </View>
    );
  }

  renderSports() {
    return (
      <View >
        <Text h4 style={styles.name} >My Sports</Text>
        <View style={styles.sportLine}>
          {this.renderSport('Basketball', 'ios-basketball', 'Ionicons')}
          {this.renderSport('Football', 'ios-football', 'Ionicons')}
        </View>
        <View style={styles.sportLine}>
          {this.renderSport('Tennis', 'ios-tennisball', 'Ionicons')}
          {this.renderSport('Running', 'run', 'MaterialCommunityIcons')}
        </View>
        <View style={styles.sportLine}>
          {this.renderSport('Workout', 'ios-fitness', 'Ionicons')}
          {this.renderSport('BeachVolley', 'volleyball', 'MaterialCommunityIcons')}
        </View>
      </View>
    );
  }

  renderSport(sport, icon, type) {
    return (
      <View >
        <TouchableWithoutFeedback onPress={() => this.toggleSport(sport)}>
          <View style={styles.sport}>
            <Text>{sport}</Text>
            <Icon
              name={icon}
              type={type}
              size={50}
              selected={this.isSportSelected(sport)}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  isSportSelected(sport) {
    return this.state.sportsSelected.includes(sport);
  }

  toggleSport(sport) {
    let newsports = this.state.sportsSelected;
    this.isSportSelected(sport) ?
      newsports.splice(newsports.indexOf(sport), 1) :
      newsports.push(sport);
    this.setState({ sportsSelected: newsports });
  }


  Logout = () => {
    try {
      firebase
        .auth()
        .signOut()
        .then(res => {
          console.log('logged out');
          const action = { type: USER_LOGGED_OUT, payload: null };
          this.props.dispatch(action);
        });
    } catch (error) {
      console.log(error.toString(error));
    }
  };
}


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(ProfileScreen)

