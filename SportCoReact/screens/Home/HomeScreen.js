import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { styles } from './styles'

import SportCoApi from '../../services/apiService';
import { translate } from '../../App';

class HomeScreen extends React.Component {


  constructor() {
    super();
    this.state = {
      isVisible: false
    }
    this.api = new SportCoApi();
    // this.api.getEntities("events/area", {longitude : 42, latitude  : 43})
    // .then(data => {
    //   console.log(data)
    // })

  }


  navigateToSearch() {
    this.props.navigation.navigate('Search');
  }

  navigateToSpotManager() {
    this.props.navigation.navigate('SpotManager');
  }

  navigateToEventCreation() {
    this.props.navigation.navigate('Event', { eventData: { event: { event_id: "" } } });
  }

  componentDidMount() {
    setTimeout(()=> {
      this.navigateToEventCreation()
    },500);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={(sc) => this.scrollView = sc}
          style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>{translate('Welcome to Timaka')}</Text>
            <Text style={[styles.text]}>{translate('Amazing sport sessions ahead !')}</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image source={require('../../assets/images/logomultisports.png')} style={styles.image} />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>{translate('searchAndCreateLabel')} </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={styles.buttonView}>
              <Button
                title={`   ` + translate('Search')}
                color='white'
                icon={
                  <Icon
                    name="search"
                    size={20}
                    color="white"
                  />
                }
                onPress={this.navigateToSearch.bind(this)} />
            </View>

            <View style={styles.buttonView}>
              <Button
                title={`   ` + translate(`Create`)}
                color='white'
                icon={
                  <Icon
                    name="add-circle-outline"
                    size={20}
                    color="white"
                  />
                }
                onPress={this.navigateToEventCreation.bind(this)} />
            </View>
          </View>


          <Button
            containerStyle={{ marginTop: 10 }}
            title={''}
            color='white'
            type='clear'
            icon={
              <Icon
                name='arrow-down'
                size={50}
                color='grey'
                type='simple-line-icon'
              />
            }
            TouchableComponent={TouchableWithoutFeedback}
            onPress={() => { this.scrollView.scrollToEnd() }} />


          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>{translate('addFavSports')} </Text>
          </View>

          <View style={styles.buttonView}>
            <Button
              title={`   ` + translate(`AddSpot`)}
              color='white'
              icon={
                <Icon
                  name="map-marker-plus"
                  type='material-community'
                  size={20}
                  color="white"
                />
              }
              onPress={this.navigateToSpotManager.bind(this)}
            />
          </View>




        </ScrollView>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps)(HomeScreen)

