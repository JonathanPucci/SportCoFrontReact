import { connect } from 'react-redux';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  Input,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SportCoApi from '../../services/apiService';

// import * as firebase from 'firebase';
import { firebase } from '@react-native-firebase/auth';
// import firebase from '@react-native-firebase/app';

import FacebookLogin from './FacebookLogin';
import { AppleLogin } from './AppleLogin';
import { USER_LOGGED } from '../../Store/Actions';
import { logDebugInfo, logDebugError } from '../Event/Helpers';


// Enter your Firebase app web configuration settings here.
// const config = {
//   apiKey: 'AIzaSyC9px960ofSQlIrqKFmyj8_aqWnimsEFS0',
//   authDomain: '',
//   databaseURL: '',
//   projectId: 'sportcoapp',
//   messagingSenderId: ''
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(config);
// }


// const auth = firebase.auth();

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }


  componentDidMount() {
    // const user = firebase.auth().currentUser;
    // if (user != null)
    //   user.providerData.forEach((userInfo) => {
    //     console.log('User info for provider: ', userInfo);
    //   });
    try {
      // firebase.auth().signOut();
      firebase.auth().onAuthStateChanged(user => {
        this.saveToBackendUser(user);
      });
    }
    catch (errorStateChanged) {
      logDebugError('ERRORSTATECHANGEAUTH', errorStateChanged)
    };
  }

  loginAction(user, id) {
    logDebugInfo('Logged with user', user);
    // user['photo_url'] = user.photoURL;
    const action = {
      type: USER_LOGGED,
      value: user,
      additionalInfo: id
    };
    this.props.dispatch(action);
  }


  render() {
    return (
      <KeyboardAwareScrollView>
        <ScrollView>
          <View style={{
            marginTop: -60,
            justifyContent: "center",
            alignItems: "center"
          }}
          >

            <Image
              style={{
                height: 500,
                width: 500,
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={require('../../assets/images/newLogoTimBlurred.png')}
            />
          </View>
          <View style={{ marginTop: -80, flex: 1 }}>
            <FacebookLogin navigation={this.props.navigation} saveToBackendUser={this.saveToBackendUser.bind(this)} />
            {Platform.OS == 'ios' && <AppleLogin navigation={this.props.navigation} saveToBackendUser={this.saveToBackendUser.bind(this)} />}
          </View>



          <View style={{ marginTop: 50, flex: 1, alignSelf: 'center' }}>
            <Image
              style={{ width: 100, height: 100, alignSelf: 'center' }}
              source={require('../../assets/images/logomultisports.png')}
            />
            <Text>By Monkeys' crew & Crew Stibat</Text>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }

  saveToBackendUser(user) {
    if (user != null && user != undefined) {
      console.log(user.providerData)
      let apiService = new SportCoApi();
      let userDB = {
        photo_url: user.photoURL,
        email: user.providerData[0].email
      }
      apiService.getSingleEntity('users/email', userDB.email)
        .then((datauser) => {
          apiService
            .editEntity('users/update', userDB)
            .then(data => {
              this.loginAction(datauser.data, datauser.data.user_id);
            })
            .catch((error) => {
              logDebugInfo('ERROR EDITING USER AT LOGIN', error);
              this.loginAction(datauser.data, datauser.data.user_id);
            })
        })
        .catch((error) => {
          if (user.displayName != null) {
            console.log("User unknown, creating");
            userDB.user_name = user.displayName,
              apiService
                .addEntity('users', userDB)
                .then((datauser) => {
                  apiService
                    .addEntity('userstats', datauser.data.data)
                    .then(data => {
                      this.loginAction(userDB, datauser.data.data.user_id);
                    });
                })
                .catch((errorcreate) => {
                  logDebugError('ERROR CREATING USER AT LOGIN', errorcreate);
                });
          }
        })

    } else {
      console.log('no user here...');
      // this.setState({ logInStatus: 'You are currently logged out.' });
    }
  }
}


/*
 <Text style={styles.title}>Connectez-vous</Text>
          <Text style={styles.titleEnd}>
            pour vivre pleinement l'expérience
          </Text>
          <View>
            <View floatingText>
              <Text>Email</Text>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={email => this.setState({ email })}
              />
            </View>
            <View floatingText>
              <Text>Password</Text>
              <Input
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={password => this.setState({ password })}
              />
            </View>
            <View style={styles.center}>
              <Button
                full
                rounded
                style={styles.button}
                onPress={() => this.Login()}
              >
                <Text style={styles.buttonText}>Se connecter</Text>
              </Button>
 
              <Button
                full
                rounded
                style={styles.buttonRegister}
                onPress={() => {
                  const nav = this.props.navigation;
                  nav.navigate('Register');
                }}
              >
                <Text style={styles.buttonTextRegister}>
                  Je crée mon compte
                </Text>
              </Button>
*/



// Login = () => {
//   let email = this.state.email;
//   let password = this.state.password;
//   try {
//     firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(res => {
//         this.loginAction(res.user.email);
//       });
//   } catch (error) {
//     console.log(error.toString(error));
//   }
// };

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

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(LoginScreen));
