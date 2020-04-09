import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import SportCoApi from '../../services/apiService';
import { StackActions } from '@react-navigation/native';


// Enter your Facebooko app ID here.
import { RETRIEVED_USER_INFO, USER_LOGGED } from '../../Store/Actions';
const FACEBOOK_APP_ID = '238361847284548';

// Enter your Firebase app web configuration settings here.
const config = {
  apiKey: 'AIzaSyC9px960ofSQlIrqKFmyj8_aqWnimsEFS0',
  authDomain: '',
  databaseURL: '',
  projectId: 'sportcoapp',
  messagingSenderId: ''
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}


const auth = firebase.auth();

class FacebookLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logInStatus: 'signed out',
      errorMessage: 'none'
    };
  }

  loginAction(user,id) {
    const action = {
      type: USER_LOGGED,
      value: user,
      additionalInfo : id
    };
    this.props.dispatch(action);
  }

  componentDidMount() {
    const loginAction = this.loginAction.bind(this);

    auth.onAuthStateChanged(user => {
      if (user != null) {
        // loginAction(user);
        // loginAction(user).then(() => {
        let apiService = new SportCoApi();
        let userDB = {
          user_name: user.displayName,
          photo_url: user.photoURL,
          email: user.email
        }
        apiService.getSingleEntity('users/email', userDB.email)
          .then((datauser) => {
            apiService
              .editEntity('users/update', userDB)
              .then(data => {
                loginAction(user,datauser.data.user_id);
              });
          })
          .catch((error) => {
            console.log("User unknown, creating");
            apiService
              .addEntity('users', userDB)
              .then((datauser) => {
                apiService
                  .addEntity('userstats', datauser.data.data)
                  .then(data => {
                    loginAction(user,datauser.data.user_id);
                  });
              });
          })

      } else {
        // this.setState({ logInStatus: 'You are currently logged out.' });
      }
    });
  }


  async handleFacebookButton() {
    Facebook.initializeAsync(FACEBOOK_APP_ID, 'sportcoapp');
    try {
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
        permissions: ['public_profile', 'email', 'user_birthday']
      });
      if (type === 'success') {
        //Firebase credential is created with the Facebook access token.
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        auth.signInWithCredential(credential).catch(error => {
          this.setState({ errorMessage: error.message });
          console.log(error.message);
        });
      } else {
        console.log("Type : " + type);
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.facebookButton}
          name="Facebook"
          underlayColor={styles.facebookButton.backgroundColor}
          onPress={() => this.handleFacebookButton()}
        >
          <Text style={styles.facebookButtonText}>
            Se connecter avec Facebook
          </Text>
        </TouchableHighlight>
        <View style={styles.space} />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: action => {
      dispatch(action);
    }
  };
};

function mapStateToProps(state) {
  return state;
}

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(FacebookLogin));

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  facebookButton: {
    width: 375 * 0.75,
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B5998'
  },
  facebookButtonText: {
    color: '#fff'
  },
  space: {
    height: 17
  }
});
