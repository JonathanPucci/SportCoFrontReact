import * as React from 'react';
import { Image, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Divider, Text, Icon, Overlay } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

import { connect } from 'react-redux'

import SportCoApi from '../../services/apiService';

import { styles, MARGIN_BETWEEN_ICONS } from './styles'
import * as RootNavigation from '../../navigation/RootNavigation.js';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import ProfileInput from './ProfileInput';
import { getFileFromS3 } from '../../services/aws3Service';
import ProfilePic from './ProfilePic';
import { DismissKeyboard } from '../../components/DismissKeyboard';
import { translate } from '../../App';


class FriendsList extends React.Component {

    constructor() {
        super();
        this.state = {
            friendsNameFilter: ''
        }
        this.apiService = new SportCoApi();
    }

    render() {
        return (
            <View>
                {this.renderOverlayFriends()}
            </View>
        )
    }

    renderOverlayFriends = () => {
        let { isAdding, user, allUsers, areFriendsVisible } = this.props;
        let dataToShow = isAdding ? allUsers : user.userFriends;
        dataToShow = dataToShow.filter((item, index) => {
            return item.user_name != null && item.user_id != this.props.auth.user_id ?
                isAdding ?
                    this.state.friendsNameFilter.length >= 1 ?
                        item.user_name.toLowerCase().includes(this.state.friendsNameFilter.toLowerCase())
                        : false
                    : item.user_name.toLowerCase().includes(this.state.friendsNameFilter.toLowerCase())
                : false
        })
        if (isAdding)
            dataToShow = dataToShow.filter((item, index) => {
                return item.user_id != this.props.auth.user_id
            })
        return (
            <Overlay
                isVisible={areFriendsVisible}
                onBackdropPress={this.props.stopShowingFriends}
                overlayStyle={styles.overlay}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{  width: '100%', height: '100%' }}>
                        <View
                            style={{ right: 0, justifyContent: 'center' }}>
                            <Icon name='remove' type='font-awesome' size={20} raised
                                onPress={this.props.stopShowingFriends}
                            />
                        </View>
                        <ScrollView
                            keyboardShouldPersistTaps='always'>
                            <ProfileInput title={'Friends'} placeholderText={translate("Find by name...")}
                                data={this.state.friendsNameFilter} callbackOnChange={this.onFriendNameFilterChanged}
                                isAdding={isAdding} />
                            <View style={{ flexDirection: "column" }}>
                                {dataToShow.length == 0 && (
                                    <Text style={{ textAlign: 'center' }}>{translate("You may want to change the filter up there ...")}</Text>
                                )}
                                {dataToShow.map((userFriend, index) => {
                                    return (
                                        <View key={'user' + index} style={{ flexDirection: 'column', justifyContent: 'center' }}  >
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}  >
                                                <TouchableWithoutFeedback
                                                    style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                                                    onPress={() => { this.props.stopShowingFriends();RootNavigation.navigateToProfile(userFriend.email) }}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                        <ProfilePic
                                                            edition={false}

                                                            stylePic={styles.friendImage}
                                                            styleDefault={styles.friendImageNoBorder}
                                                            user={userFriend}
                                                            styleContainer={styles.imageContainer}
                                                        />
                                                        <Text style={{ alignSelf: 'center', marginLeft: 30 }}>{userFriend.user_name}</Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                                {isAdding ?
                                                    (
                                                        <View>
                                                            {user.userFriends.some(friend => {
                                                                return friend.friend_id == userFriend.user_id
                                                            }) ?
                                                                <Icon name='remove' reverse size={18}
                                                                    color='red'
                                                                    style={{ margin: 30 }}
                                                                    onPress={() => { this.removeFriend(userFriend.user_id) }}
                                                                /> :
                                                                <Icon name='add' reverse size={18}
                                                                    color='green'
                                                                    style={{ margin: 30 }}
                                                                    onPress={() => { this.addAsFriend(userFriend.user_id) }}
                                                                />}
                                                        </View>
                                                    )
                                                    :
                                                    (<Icon name='remove' reverse size={18}
                                                        color='red'
                                                        style={{ margin: 30 }}
                                                        onPress={() => { this.removeFriend(userFriend.friend_id) }}
                                                    />)

                                                }
                                            </View>
                                            <Divider style={{ margin: 10 }} />
                                        </View>

                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </Overlay >
        )
    }



    addAsFriend = async (friend_id) => {
        await this.apiService.addEntity('userfriends', { user_id: this.props.auth.user_id, friend_id: friend_id });
        this.props.getData();
    }

    removeFriend = async (friend_id) => {
        await this.apiService.deleteEntity('userfriends', { user_id: this.props.auth.user_id, friend_id: friend_id });
        this.props.getData();
    }

    onFriendNameFilterChanged = (text) => {
        this.setState({ friendsNameFilter: text });
    }

}



const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(FriendsList)

