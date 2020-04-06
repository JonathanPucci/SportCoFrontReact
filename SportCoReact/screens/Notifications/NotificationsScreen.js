import * as React from 'react';
import { Text, View } from 'react-native';
import { Divider } from 'react-native-elements'

import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles } from './styles'
import SportCoApi from '../../services/apiService';

const NEW_EVENT_NEARBY = 'NEW_EVENT_NEARBY';
const EVENT_HAS_CHANGED = 'EVENT_HAS_CHANGED';

class NotificationsScreen extends React.Component {

  constructor() {
    super()
    this.state = {
      notificationHistory: [{
        date: new Date(),
        messageType: NEW_EVENT_NEARBY,
        event_id: 1
      },
      {
        date: new Date() + 2,
        messageType: EVENT_HAS_CHANGED,
        event_id: 2
      }]
    }
    this.apiService = new SportCoApi()

  }

  componentDidMount() {
    this.apiService.getAllEntities('events')
      .then((data) => {
        this.setState({ event: data.data[0] })
      })
  }

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Divider style={styles.divider} />
        {
          this.state.notificationHistory.map((item, index) => {

            return (
              <View
                key={'keyHistory-' + index}
                style={styles.notificationView}>
                <Text>{item.messageType}</Text>
              </View>

            )
          })
        }
      </ScrollView>
    );
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)

