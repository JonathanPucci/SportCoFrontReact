import * as React from 'react';
import { View, Text, Platform, TextInput, Image } from 'react-native';
import { Overlay, Button, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { styles } from './styles'
import SportsAvailable from '../../components/SportsAvailable';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SPORTS } from '../../constants/DbConstants';
import InputScrollView from 'react-native-input-scroll-view';
import { translate } from '../../App';


class FilterOverlay extends React.Component {


    /*********************************************************************************
     *************************                 ***************************************
     ********************      RENDERING STUFF    ************************************
     *************************                 ***************************************
     ********************************************************************************/

    render() {

        return (
            <View >
                <Overlay
                    isVisible={this.props.isChoosingAFilter}
                    onBackdropPress={() => { this.props.setState({ isChoosingAFilter: false }) }}
                    overlayStyle={styles.overlay}
                >
                    <InputScrollView
                        keyboardShouldPersistTaps='handled' style={styles.sports} topOffset={90}>
                        <SportsAvailable
                            sportsSelected={this.props.sportsAccepted}
                            sportsSelectedChanged={(newsports) => { this.props.setState({ sportsAccepted: newsports }) }}
                        />
                        <Button
                            titleStyle={{ fontSize: 20 }}
                            buttonStyle={{ marginTop: 50 }}
                            title={translate('Select All')}
                            onPress={() => { this.selectAllSports(); }}
                        />
                        {this.renderHostNameFilter()}
                        <Button
                            titleStyle={{ fontSize: 20 }}
                            buttonStyle={{ marginTop: 50, backgroundColor: 'green' }}
                            title={translate("Yep, all good")}
                            onPress={() => { this.props.filterBySport(true) }}
                        />
                    </InputScrollView>
                </Overlay>
            </View >
        );
    }

    renderHostNameFilter() {
        let dataToShow = [];
        if (this.props.hostIdFilter != '') {
            let user = this.props.allUsers.find(item => { return item.user_id == this.props.hostIdFilter });
            return (
                <View>
                    <Text style={{ textAlign: 'center', marginTop: 20 }}> {translate("Only show events hosted by")} </Text>
                    <TouchableWithoutFeedback
                        style={{ flexDirection: 'row', justifyContent: "center", alignSelf: 'center' }}
                        onPress={() => { this.props.setState({ hostIdFilter: '' }) }}
                    >
                        <Text style={{ alignSelf: "center", textAlign: 'center' }}>{user.user_name}</Text>
                        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                            <Icon
                                name='remove' reverse size={18}
                                color='red'
                                style={{ marginLeft: 40 }}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        }
        if (this.props.hostNameFilter.length > 0)
            dataToShow = this.props.allUsers.filter((item) => { return item.user_name.toLowerCase().includes(this.props.hostNameFilter.toLowerCase()) }).slice(0, 1);
        return (
            <View style={{ marginTop: 20 }}>
                {this.renderHostNameInput(translate('Filter By Host Name'), translate('Find by name') + '...', this.props.hostNameFilter, this.onHostNameFilterChanged)}
                <View style={{ flexDirection: "column" }}>
                    {dataToShow.map((user, index) => {
                        return (
                            <View key={'user' + index} style={{ flexDirection: 'row', justifyContent: 'center' }}  >
                                <TouchableWithoutFeedback
                                    style={{ marginLeft: 15 }}
                                    onPress={() => { this.props.setState({ hostIdFilter: user.user_id }) }}
                                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    {user.photo_url != null ?
                                        (
                                            <Image source={{ uri: user.photo_url + '?type=large&width=500&height=500&access_token='+fb_access_token }} style={styles.friendImage} />
                                        ) : (
                                            <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.friendImageNoBorder} />
                                        )
                                    }
                                    <Text style={{ alignSelf: 'center', marginLeft: 30 }}>{user.user_name}</Text>
                                    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                        <Icon name='check' reverse size={18}
                                            color='green'
                                            style={{ marginLeft: 30 }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

    renderHostNameInput = (title, placeholderText, data, callbackOnChange) => {
        return (
            <View>
                <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
                <TouchableWithoutFeedback style={styles.inputView}
                    onPress={() => { this[title].focus() }}>
                    <TextInput
                        style={styles.textInputFilter}
                        ref={(input) => { this[title] = input; }}
                        onChangeText={callbackOnChange}
                        defaultValue={data}
                        placeholder={placeholderText}
                        multiline
                    />
                </TouchableWithoutFeedback>
            </View>
        )
    }

    onHostNameFilterChanged = (text) => {
        this.props.setState({ hostNameFilter: text });
    }


    selectAllSports() {
        let newsports = SPORTS;
        this.props.setState({ sportsAccepted: newsports });
    }

    filterBySport(exit = false) {
        let newEvents = [];
        for (let index = 0; index < this.props.eventsRetrieved.length; index++) {
            const event = this.props.eventsRetrieved[index];
            if (this.props.sportsAccepted.includes(event.event.sport) &&
                (this.props.hostIdFilter == '' || event.event.host_id == this.props.hostIdFilter))
                newEvents.push(event);
        }
        this.props.setState({ events: [], isChoosingAFilter: !exit }, () => { this.setState({ events: newEvents }) });
    }

}

const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(FilterOverlay)

