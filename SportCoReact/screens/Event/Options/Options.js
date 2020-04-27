import * as React from 'react';
import { View } from 'react-native';
import { Button, Icon } from 'react-native-elements'

import { OptionIcon } from '../OptionIcon'
import { isOrganizedByMe, computeAlreadyJoined } from '../Helpers'

export class Options extends React.Component {


  /********************************************************************************
 *************************                  ***************************************
 ********************         OPTIONS            **********************************
 *************************                  ***************************************
 *********************************************************************************/

  render() {
    let alreadyJoined = computeAlreadyJoined(this.props.user_id, this.props.eventData);

    return (
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, alignSelf: 'center' }}>
        <View style={{ borderRadius: 10 }} >
          {isOrganizedByMe(this.props.user_id, this.props.eventData.event.host_id) ? (
            <View>

              {this.props.editing ? (
                <View style={{ flexDirection: 'row' }} >
                  <OptionIcon name='check' color='green' callback={this.props.updateEvent} />
                  <OptionIcon name='remove' color='red' callback={this.props.cancelEdit} />
                </View>
              ) : (
                  <View style={{ flexDirection: 'row' }} >
                    <OptionIcon name='edit' callback={this.props.editEvent} />
                    <OptionIcon name='remove' color='red' callback={this.props.cancelEvent} />
                  </View>
                )}
            </View>
          ) : (
            <View style={{marginTop:10}}>
              {!alreadyJoined ?
                <Button title={"Join event !"} onPress={this.props.joinEvent} />
                :
                <Button buttonStyle={{ backgroundColor: 'green' }} icon={
                  <Icon
                    name="check"
                    size={15}
                    color="white"
                    type='font-awesome'
                  />} title={`| Not going?`} onPress={this.props.leaveEvent} />
                }
                </View>
            )}
        </View>
      </View>
    )
  }
}

