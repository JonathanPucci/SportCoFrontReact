import { connect } from 'react-redux';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SportCoApi from '../../services/apiService';

import auth from '@react-native-firebase/auth';

import FacebookLogin from './FacebookLogin';
import { AppleLogin } from './AppleLogin';
import { USER_LOGGED } from '../../Store/Actions';
import { logDebugInfo, logDebugError } from '../Event/Helpers';

import Spinner from 'react-native-loading-spinner-overlay';
import Register from './Register';
import { Divider } from 'react-native-elements';
import { GraphRequestManager, GraphRequest, AccessToken, LoginManager } from 'react-native-fbsdk';
import { translate } from '../../App';
import { FB_AUTH } from '../../Store/Actions';
import { SafeAreaView } from 'react-native-safe-area-context';



class LoginScreen extends React.Component {

  static navigationOptions = {
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isSpinnerVisible: false,
      authFlag: true
    };
    this.apiService = new SportCoApi();
  }


  componentDidMount() {
    this.setState({ authFlag: true })
    try {
      // firebase.auth().signOut();
      auth().onAuthStateChanged(user => {
        // if (user != null)
        //   logDebugInfo('USERFB', user.providerData);
        if (this.state.authFlag) {
          this.setState({ authFlag: false });
          this.timeoutFlag = setTimeout(() => {
            this.setState({ authFlag: true })
          }, 2000);
          this.saveToBackendUser(user);
        }
      });
    }
    catch (errorStateChanged) {
      logDebugError('ERRORSTATECHANGEAUTH', errorStateChanged)
    };
  }

  loginAction(user, id) {
    logDebugInfo('Logged with user', user);
    // user['photo_url'] = user.photoURL;
    // console.log('clear')
    clearTimeout(this.loadingTimeout);
    clearTimeout(this.timeoutFlag);
    this.timeoutFlag = 0;
    this.loadingTimeout = 0;

    const action = {
      type: USER_LOGGED,
      value: user,
      additionalInfo: id
    };
    this.props.dispatch(action);
    this.props.dispatch({ type: FB_AUTH, value: '' })

  }

  render() {
    return (
      <SafeAreaView>
        <KeyboardAwareScrollView
          extraScrollHeight={150}
          keyboardShouldPersistTaps='always'
        >
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
              <FacebookLogin navigation={this.props.navigation} saveToken={this.saveToken} saveToBackendUser={this.saveToBackendUser.bind(this)} />
              {Platform.OS == 'ios' && <AppleLogin navigation={this.props.navigation} saveToBackendUser={this.saveToBackendUser.bind(this)} />}
            </View>

            <Divider style={{ marginTop: 20, width: '70%', alignSelf: 'center' }} />

            <View style={{ marginTop: 0 }}>
              <Register saveToBackendUser={this.saveToBackendUser.bind(this)} />
            </View>

            <Spinner
              visible={this.state.isSpinnerVisible}
              textContent={translate("Loading")}
              textStyle={{ color: 'white' }}
            />


            <View style={{ marginTop: 50, flex: 1, alignSelf: 'center' }}>
              <Image
                style={{ width: 100, height: 100, alignSelf: 'center' }}
                source={require('../../assets/images/logomultisports.png')}
              />
              <Text>By Monkeys' crew & Crew Stibat</Text>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  saveToken = async (token) => {
    return this.setState({ appToken: token }, () => { return; });
  }

  saveToBackendUser(user) {
    if (user != null && user != undefined) {
      this.startSpinning(user);
      // logDebugInfo("ProviderData", user.providerData)
      // logDebugInfo("UserSave", user)
      let userDB = {
        photo_url: user.photoURL,
        email: user.providerId == 'firebase' && user.providerData[0].providerId != 'facebook.com' ? user.email : user.providerData[0].email,
        photo_to_use: user.providerData[0].providerId == 'facebook.com' ? 'fb' : 'default',
        fb_access_token: this.state.appToken
      }

      this.apiService.getSingleEntity('users/email', userDB.email)
        .then((datauser) => {
          logDebugInfo("User known", datauser.data)
          this.apiService
            .editEntity('users/update', userDB)
            .then(data => {
              // logDebugInfo("SAVEDUSER", userDB)
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
              this.apiService
                .addEntity('users', userDB)
                .then((datauser) => {
                  this.apiService
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

  startSpinning = (user) => {
    // logDebugInfo('SPINNING', user);

    this.setState({ isSpinnerVisible: true })
    this.loadingTimeout = setTimeout(() => {
      if (this.loadingTimeout) {
        this.setState({ isSpinnerVisible: false }, () => {
          alert('Well obviously something went wrong... Sorry about that !');
          LoginManager.logOut();
          auth().signOut();
        })
      }
    }, 5000)
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

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(LoginScreen));
