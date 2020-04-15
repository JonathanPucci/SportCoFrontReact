
import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from './styles'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { seeProfile, mapLevelImage } from '../Helpers'
import { DescriptionText } from "../DescriptionText/DescriptionText";



export class Participants extends React.Component {


 /********************************************************************************
 *************************                  ***************************************
 ********************         PARTICIPANTS       **********************************
 *************************                  ***************************************
 *********************************************************************************/

render() {
    return (
      <View style={{ marginTop: 10 }} >
        <DescriptionText title='Participants' data={''} centered='auto' isMutable={false} editing={this.props.editing} setEditingProperty={this.props.setEditingProperty} />
        <View style={{ flexDirection: 'row', marginTop: this.props.editing ? 20 : 10 }}>
          {this.props.eventData.participants.map((participant, index) => {
            let photoUrl = participant.photo_url;
            let levelImage = mapLevelImage(this.props.eventData.event.sport, participant);
            return (
              <View key={'participant-' + index} style={{ flexDirection: 'column', marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={seeProfile.bind(this, participant.email)}>
                  <View style={styles.imageContainerParticipant}>
                    {photoUrl != undefined && <Image source={{ uri: photoUrl + '?type=large&width=500&height=500' }} style={styles.imageParticipant} />}
                    {photoUrl == undefined && <Image source={require('../../../assets/images/robot-dev.png')} style={styles.imageParticipant} />}
                  </View>
                </TouchableWithoutFeedback>
                <Text numberOfLines={1} style={{ alignSelf: 'center', marginBottom: 10, width: 50 }}>{participant.user_name}</Text>
                <Image source={levelImage} style={{ position: 'absolute', bottom: 50, left: 30, height: 40, width: 40 }} />
              </View>
            )
          })}
        </View>

      </View>
    )
  }

}