import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
// import * as Facebook from 'expo-facebook';
// import firebase from 'firebase';
import auth from '@react-native-firebase/auth';

import SportCoApi from '../../services/apiService';
import { StackActions } from '@react-navigation/native';
import { GraphRequestManager, GraphRequest, AccessToken, LoginManager } from 'react-native-fbsdk';
import { logDebugInfo } from '../Event/Helpers';


class FacebookLogin extends React.Component {
  constructor(props) {
    super(props);
    this.apiService = new SportCoApi();
    this.state = {
      logInStatus: 'signed out',
      errorMessage: 'none'
    };
  }


  render() {
    return (
      <View>
        {this.renderFacebookButton()}
      </View>
    )
  }

  facebookLogin = async () => {
    let data = null;
    LoginManager.logOut()
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email"
      ]);
      console.log(result);
      if (result.isCancelled) {
        throw new Error("User cancelled the login process");
      }
      data = await AccessToken.getCurrentAccessToken();
      console.log(data)
      if (!data) {
        throw new Error("Something went wrong obtaining access token");
      }

      const credential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      console.log(credential);
      await auth().signInWithCredential(credential);
    } catch (err) {
      logDebugInfo("FACEBOOKLOGIN",err);
      if (err.code == 'auth/account-exists-with-different-credential') {
        if (data != null) {
          console.log('req')
          let req = new GraphRequest('/' + data.userID, {
            httpMethod: 'GET',
            version: 'v6.0',
            parameters: {
              'fields': {
                'string': 'email'
              }
            }
          }, async (err, res) => {
            // console.log(err, res)
            if (res.email != null) {
              try {
                let existingUser = await this.apiService.getSingleEntity('users/email', res.email);
                console.log(existingUser);
                this.props.saveToBackendUser({
                  displayName: existingUser.data.user_name,
                  photoURL: null,
                  email: existingUser.data.email,
                })
              } catch (errorBackend) {
                console.log("====");
                console.log(errorBackend);
                console.log('User email does not exist...');
                console.log("====");
              }

            }
          });
          new GraphRequestManager().addRequest(req).start();
        }
      }
    }
    return;
  }


  renderFacebookButton() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.facebookButton}
          name="Facebook"
          underlayColor={styles.facebookButton.backgroundColor}
          onPress={this.facebookLogin}
        >
          <Text style={styles.facebookButtonText}>
            Sign in with Facebook
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
    color: '#fff',
    fontSize: 17
  },
  space: {
    height: 17
  }
});
