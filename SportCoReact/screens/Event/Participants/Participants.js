
import * as React from 'react';
import { View, Image } from 'react-native';
import { Text, Overlay } from 'react-native-elements'
import { styles } from './styles'
import { TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { seeProfile, mapLevelImage } from '../Helpers'
import { DescriptionText } from "../DescriptionText/DescriptionText";

const MAX_ON_LINE = 5;

export class Participants extends React.Component {

    state = {
        showingParticipantList: false
    }

    /********************************************************************************
    *************************                  ***************************************
    ********************         PARTICIPANTS       **********************************
    *************************                  ***************************************
    *********************************************************************************/

    render() {
        let participants = this.props.eventData.participants || [];
        // participants.push(participants[participants.length - 1]);
        // console.log(participants.length)
        return (
            <View style={{ marginTop: 10 }} >
                <DescriptionText title='Participants' data={''} centered='auto' isMutable={false} editing={this.props.editing} setEditingProperty={this.props.setEditingProperty} />
                <View style={{ flexDirection: 'row', marginTop: this.props.editing ? 20 : 10 }}>
                    {participants.slice(0, MAX_ON_LINE).map(this.renderParticipant)}
                    {participants.length > MAX_ON_LINE && (
                        <View>
                            <TouchableWithoutFeedback onPress={this.showParticipants}
                                style={{ borderRadius: 15, height: 30, width: 30, borderWidth: 1, marginTop: 25, marginLeft: 5 }}>
                                <Text style={{ fontSize: 28, left: 4, bottom: 10 }}>...</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </View>
                <Overlay isVisible={this.state.showingParticipantList}
                    onBackdropPress={this.hideParticipants}>
                    <ScrollView style={{ flex: 1, margin: 20 }}>
                        {participants.map(this.renderParticipant)}
                    </ScrollView>
                </Overlay>
            </View>
        )
    }

    renderParticipant = (participant, index) => {
        let photoUrl = participant.photo_url;
        let levelImage = mapLevelImage(this.props.eventData.event.sport, participant);
        return (
            <View key={'participant-' + index} style={{ flexDirection: 'column', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={levelImage}
                    style={{
                        position: 'absolute',
                        bottom: this.state.showingParticipantList ? 10 : 50,
                        left: this.state.showingParticipantList ? 150 : 30,
                        height: this.state.showingParticipantList ? 80 : 40,
                        width: this.state.showingParticipantList ? 80 : 40
                    }} />
                <TouchableWithoutFeedback onPress={() => this.seeProfile(this.props.navigation, participant.email)}>
                    <View style={styles.imageContainerParticipant}>
                        {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.imageParticipant} />}
                        {photoUrl == undefined && <Image source={require('../../../assets/images/robot-dev.png')} style={styles.imageParticipant} />}
                    </View>
                </TouchableWithoutFeedback>
                <Text numberOfLines={1} style={{ alignSelf: 'center', marginBottom: 10, width: 50 }}>{participant.user_name}</Text>

            </View>
        )
    }

    showParticipants = () => {
        this.setState({ showingParticipantList: true });
    }

    hideParticipants = () => {
        this.setState({ showingParticipantList: false });
    }

    seeProfile = (nav, email) => {
        this.setState({ showingParticipantList: false }, () => seeProfile(nav, email));
    }

}