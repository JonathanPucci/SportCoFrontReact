import { connect } from 'react-redux';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  Input
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BoidiApi from '../../services/apiService';

import * as firebase from 'firebase';
import FacebookLogin from './FacebookLogin';

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  loginAction(payload) {
    // const apiService = new BoidiApi();
    // apiService.getSingleEntity('users/email', payload).then(data => {
    //   let user = data.entities.data;
    //   const action = { type: USER_LOGGED, payload: user };
    //   this.props.dispatch(action);
    // });
  }


  Login = () => {
    let email = this.state.email;
    let password = this.state.password;
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          this.loginAction(res.user.email);
        });
    } catch (error) {
      console.log(error.toString(error));
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView>
        <ScrollView>
          <Image
            style={{ width: '100%', height: 400 }}
            source={require('../../assets/images/basketCourt.jpg')}
          />
          <View style={{ marginVertical: 10, flex: 1 }}>
            <FacebookLogin navigation={this.props.navigation} />
          </View>

          
          
          <View style={{ flex: 1, alignSelf: 'center' }}>
          <Image
            style={{ width: 100, height: 100, alignSelf:'center' }}
            source={require('../../assets/images/Logo.png')}
          />
            <Text>By SportCo crew</Text>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

/*
            </View>
          </View>
*/

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