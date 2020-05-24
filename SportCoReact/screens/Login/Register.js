// SignUp.js
import React from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input } from 'react-native-elements';

import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Colors from '../../constants/Colors';
import auth from '@react-native-firebase/auth';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants';
import { logDebugInfo } from '../Event/Helpers';

class Register extends React.Component {
    state = {
        user_name: '',//'MyNAME',
        errorName: '',
        email: '',//'zpivjr@ecpi.com',
        errorEmail: '',
        password: '',//'blablabla',
        errorPassword: '',
        isSigninUp: false,
    }

    handleSignUpOrLogin = async () => {

        if (this.state.isSigninUp) {
            if (this.state.user_name != '')
                auth()
                    .createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then(async () => {
                        await auth().currentUser.updateProfile({
                            displayName: this.state.user_name,
                            // photoURL: "https://example.com/jane-q-user/profile.jpg"
                        });
                        await auth().currentUser.reload();
                        // logDebugInfo('SIGNED', auth().currentUser)
                        this.props.saveToBackendUser(auth().currentUser)
                    })
                    .catch(this.manageError)
            else
                this.setState({ errorName: translate('Please enter something up there') })
        }
        else
            auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    // logDebugInfo('LOGGED', auth().currentUser)
                    this.props.saveToBackendUser(auth().currentUser)
                })
                .catch(this.manageError)
    }

    manageError = (err) => {
        console.log('ERROR')
        console.log(err)
        switch (err.code) {
            case 'auth/invalid-email':
                this.setState({ errorEmail: 'INVALID EMAIL' })
                break;
            case 'auth/wrong-password':
                this.setState({ errorPassword: 'WRONG PASSWORD' })
                break;
            case 'auth/user-not-found':
                this.setState({ errorEmail: 'Unknown User !' })
                break;
            case 'auth/weak-password':
                this.setState({ errorPassword: 'Password is a bit weak' })
                break;

            default:
                break;
        }
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                    {this.state.isSigninUp &&
                        <View style={{ flexDirection: 'column', flex: 0.3, marginLeft: 40, alignSelf: 'center' }}>
                            <Image
                                source={DEFAULT_PROFILE_PIC}
                                resizeMode='contain'
                                style={styles.imageNoBorder} />
                            <Text style={{ textAlign: 'center', alignSelf: 'center', color: Colors.timakaColor, fontWeight: 'bold' }}>WELCOME</Text>
                        </View>
                    }
                    <View style={{ flex: 1 }}>
                        {this.state.isSigninUp && <Input
                            label="Username"
                            placeholder="Some Amazing Name"
                            autoCapitalize="words"
                            leftIcon={{ type: 'ion-icon', name: 'person' }}
                            leftIconContainerStyle={{ left: -10 }}
                            containerStyle={styles.textInput}
                            inputStyle={{ fontSize: 15 }}
                            onChangeText={user_name => this.setState({ user_name: user_name, errorName: '' })}
                            errorMessage={this.state.errorName}
                            value={this.state.user_name}
                        />
                        }
                        <Input
                            label="Email"
                            placeholder="hola@quetal.com"
                            autoCapitalize="none"
                            leftIcon={{ type: 'ion-icon', name: 'mail' }}
                            leftIconContainerStyle={{ left: -10 }}
                            inputStyle={{ fontSize: 15 }}
                            containerStyle={styles.textInput}
                            onChangeText={email => this.setState({ email: email, errorEmail: '' })}
                            errorMessage={this.state.errorEmail}
                            value={this.state.email}
                        />
                        <Input
                            secureTextEntry
                            label="Password"
                            placeholder="Yup"
                            autoCapitalize="none"
                            leftIcon={{ type: 'font-awesome', name: 'lock' }}
                            leftIconContainerStyle={{ left: -10 }}
                            inputStyle={{ fontSize: 15 }}
                            containerStyle={styles.textInput}
                            onChangeText={password => this.setState({ password: password, errorPassword: '' })}
                            value={this.state.password}
                            errorMessage={this.state.errorPassword}
                        />
                    </View>
                </View>

                <TouchableHighlight
                    style={styles.registerButton}
                    name="Facebook"
                    underlayColor={styles.registerButton.backgroundColor}
                    onPress={this.handleSignUpOrLogin}
                >
                    <Text style={styles.registerButtonText}>{(this.state.isSigninUp ? 'Register' : 'Login') + " With Email"}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.registerButton}
                    name="Facebook"
                    underlayColor={styles.registerButton.backgroundColor}
                    onPress={() => { this.setState({ isSigninUp: !this.state.isSigninUp }) }}
                >
                    <Text style={styles.registerButtonText}>{!this.state.isSigninUp ? "Create an account" : "Already have an account? Login !"}</Text>
                </TouchableHighlight>

            </View >
        )
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

export default (connectedApp = connect(mapStateToProps, mapDispatchToProps)(Register));



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '80%',
        marginVertical: 20,
        alignSelf: 'center'
    },
    imageNoBorder: {
        height: 120,
        width: 120,
        alignSelf: 'center'
    },
    registerButton: {
        marginTop: 15,
        width: 375 * 0.75,
        height: 48,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.timakaColor
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 17
    }
})