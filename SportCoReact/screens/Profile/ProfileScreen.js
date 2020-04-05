import * as React from 'react';
import * as firebase from 'firebase';
import { Image, SafeAreaView, View } from 'react-native';
import { Divider, Text, Button } from 'react-native-elements'
import { Social } from '../../components/social'
import Icon from '../../components/Icon'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { USER_LOGGED_OUT } from '../../Store/Actions'
import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles } from './styles'
import SportsAvailable from '../../components/SportsAvailable';

class ProfileScreen extends React.Component {

  state = {
    user: {},
    sportsSelected: ['Tennis'],
    apiService: new SportCoApi(),
  }

  componentDidMount() {
    let email = this.props.auth.user.email;
    if (this.props.route.params != undefined)
      email = this.props.route.params.email;

    this.state.apiService.getSingleEntity('users/email', email)
      .then(res => {
        this.setState({
          user: res.data
        });
      })
  }

  render() {
    if (this.state.user == {})
      return <View />
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <SafeAreaView style={styles.container}>
            <View style={styles.basicInfoContainer}>
              <View style={styles.basicInfo}>
                <Text h4 style={styles.name}>
                  {this.state.user.user_name}
                </Text>
                <Text h5 style={styles.name}>
                  25 ans
                </Text>
                <Text style={styles.desc}>Developer at DreamTeam & Co.</Text>
              </View>
              <View style={styles.imageContainer}>
                {this.state.user.photo_url != null ?
                  (
                    <Image source={{ uri: this.state.user.photo_url + '?type=large&width=500&height=500' }} style={styles.image} />
                  ) : (
                    <Image source={require('../../assets/images/robot-dev.png')} style={styles.image} />
                  )
                }
              </View>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.desc}>
              {`Me : As everyone else, need to get out of this containment, let's play a basketball game once it's all over.
              \rPure squatteur.`}
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.sports}>
              <SportsAvailable
                sportsSelected={this.state.sportsSelected}
                sportsSelectedChanged={(newsports) => { this.setState({ sportsSelected: newsports }) }} />
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

