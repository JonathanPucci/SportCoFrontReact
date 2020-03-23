import { connect } from 'react-redux';
import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';
import { NavBoidi } from '../../components/LogoTitle';
import styles from './styles';
import BoidiApi from '../../services/apiService';

import * as firebase from 'firebase';
import { Container, Item, Form, Input, Button, Label } from 'native-base';
import { auth } from '../../store/actions';
import BoidiConstants from '../../components/Constants';
import FacebookLogin from './FacebookLogin';

class LoginScreen extends React.Component {
  static navigationOptions = NavBoidi;

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  SignUp = (username, email, password) => {
    const apiService = new BoidiApi();
    const nav = this.props.navigation;
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(data => {
          if (data) {
            const newUser = {
              email: data.user.email,
              username: username,
              subscription: 'free',
              password: 'nopasswordmanagementfromboidi',
              photourl: null
            };
            apiService.addEntity('users', newUser).then(data => {
              const action = {
                type: 'USER_LOGGED',
                payload: newUser
              };
            });
            firebase.auth().currentUser.updateProfile({
              displayName: username, // some displayName,
              photourl: null // some photo url
            });
          }
        });
    } catch (error) {
      console.log(error.toString(error));
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Container>
          <View style={{ width: '100%', height: '45%' }}>
            <Image
              style={{ width: '100%', height: '100%%' }}
              source={require('../../assets/images/accueil.png')}
            />
          </View>

          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={username => this.setState({ username })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={password => this.setState({ password })}
              />
            </Item>

            <Button
              full
              rounded
              style={styles.buttonRegister}
              onPress={() => {
                const nav = this.props.navigation;
                nav.navigate('LoginNavigator');
                this.SignUp(
                  this.state.username,
                  this.state.email,
                  this.state.password
                );
              }}
            >
              <Text style={styles.buttonTextRegister}>Je crée mon compte</Text>
            </Button>
          </Form>
        </Container>
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
  const { alert } = state;
  return {
    alert
  };
}

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(
  LoginScreen
));
// export default { connectedApp as LoginScreen };
