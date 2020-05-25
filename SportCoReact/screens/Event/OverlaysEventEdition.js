import * as React from 'react';
import { Text, View, TextInput, Picker, ScrollView } from 'react-native';
import { styles } from './styles'
import MapView from 'react-native-maps';
import { Button, Icon, Overlay, Divider } from 'react-native-elements'
import { GoogleMapsAutoComplete } from "../../components/GoogleMapsAutoComplete"
import SmoothPicker from "react-native-smooth-picker";
import Bubble from './Bubble'
import SportsAvailable from '../../components/SportsAvailable';
import SportCoApi from '../../services/apiService';
import ProfileInput from '../Profile/ProfileInput';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import { Layout } from '../../constants/Layout';
import Colors from '../../constants/Colors';
import { translate } from '../../App';
import DatePicker from 'react-native-date-picker';


export class OverlaySport extends React.Component {

    render() {
        return (
            <Overlay
                isVisible={this.props.isEditingSport}
                onBackdropPress={this.props.stopEditingSport}
            >
                <View style={styles.sports}>
                    <SportsAvailable
                        maxOne={true}
                        sportsSelected={[this.props.sport]}
                        sportsSelectedChanged={(newsports) => { this.props.onSportChange(newsports[0]) }}
                    />
                    <SaveButton
                        title={`| ` + translate("That's better")}
                        callback={this.props.saveSport}
                    />
                </View>
            </Overlay>
        )
    }

}

export class OverlayDateTimePicker extends React.Component {

    render() {
        return (
            <View>
                <Overlay
                    isVisible={this.props.isEditingDate}
                    onBackdropPress={() => { this.props.stopEditingDate() }}
                >
                    <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <DatePicker
                            minimumDate={new Date()}
                            date={new Date(this.props.event.event.date)}
                            mode={'datetime'}
                            is24Hour={true}
                            onDateChange={this.props.onDateChange}
                        />
                        <SaveButton
                            title={`| ` + translate("Save")}
                            callback={this.props.increaseFormStep}
                        />

                    </View>
                </Overlay>

            </View>
        )
    }

}

export class OverlayDescription extends React.Component {
    render() {
        return (
            <Overlay
                isVisible={this.props.isEditingDescription}
                onBackdropPress={() => { this.props.stopEditingDescription() }}
            >
                <View>
                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Description</Text>
                    <View style={{
                        width: "90%",
                        borderColor: 'gray',
                        borderWidth: 1,
                        borderRadius: 20,
                        marginVertical: 30,
                        alignSelf: 'center'

                    }}>
                        <TextInput
                            style={{
                                alignItems: 'center',
                                overflow: "hidden",
                                alignSelf: 'center',
                                textAlign: 'center',
                                height: 100
                            }}
                            autoFocus
                            onChangeText={this.props.onDescriptionChange}
                            defaultValue={this.props.description}
                            placeholder={translate('descriptionPlaceholder')}
                            multiline
                        />
                    </View>
                    <SaveButton
                        title={`| ` + translate('Save') + `?`}
                        callback={this.props.saveDescription}
                    />
                </View>
            </Overlay>
        )
    }
}

export class OverlayLevel extends React.Component {
    render() {
        return (
            <Overlay
                isVisible={this.props.isEditingLevel}
                onBackdropPress={() => { this.props.stopEditingLevel() }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ flex: 0.1, alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>
                        {translate('Level')}
                    </Text>
                    <Picker
                        selectedValue={this.props.level}
                        style={{ flex: 1, height: 50, width: 150, alignSelf: 'center' }}
                        onValueChange={this.props.onLevelChange}
                    >
                        {this.props.levels.map((level, index) => {
                            return (
                                <Picker.Item key={'level-' + index} label={level} value={level} />
                            )
                        })}
                    </Picker>
                    <View style={{ flex: 1 }}>
                        <SaveButton
                            title={`| ` + translate('Save') + `?`}
                            callback={this.props.saveLevel}
                        />
                    </View>
                </View>

            </Overlay >
        )
    }
}

export class OverlayMinMaxParticipants extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.event.event.participants_min != prevProps.event.event.participants_min && this.refListMin != undefined)
            this.refListMin.refs.smoothPicker.scrollToIndex({
                animated: false,
                index: this.props.event.event.participants_min,
                viewOffset: -30
            });
        if (this.props.event.event.participants_max != prevProps.event.event.participants_max && this.refListMax != undefined)
            this.refListMax.refs.smoothPicker.scrollToIndex({
                animated: false,
                index: this.props.event.event.participants_max,
                viewOffset: -30
            });
    }

    render() {
        let selectedMin = this.props.event.event.participants_min;
        let selectedMax = this.props.event.event.participants_max;
        return (
            <Overlay
                isVisible={this.props.isEditingParticipantNumbers}
                onBackdropPress={this.props.stopEditingParticipantNumbers}
            >
                <View>
                    <View style={{ margin: 20 }}>
                        <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Min</Text>
                        <View style={styles.wrapperPickerContainer}>
                            <View style={styles.wrapperHorizontal}>
                                <SmoothPicker
                                    onScrollToIndexFailed={() => { }}
                                    initialScrollToIndex={selectedMin}
                                    ref={ref => (this.refListMin = ref)}
                                    keyExtractor={(_, index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    onSelected={({ item, index }) => { this.props.onPMinChange(item, index) }}
                                    bounces={true}
                                    data={Array.from({ length: 15 }, (_, i) => 0 + i)}
                                    renderItem={({ item, index }) => (
                                        <Bubble horizontal selected={index === selectedMin} >
                                            {item}
                                        </Bubble>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ margin: 20 }}>
                        <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold' }}>Max</Text>
                        <View style={styles.wrapperPickerContainer}>
                            <View style={styles.wrapperHorizontal}>
                                <SmoothPicker
                                    onScrollToIndexFailed={() => { }}
                                    initialScrollToIndex={selectedMax}
                                    ref={ref => (this.refListMax = ref)}
                                    keyExtractor={(_, index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    onSelected={({ item, index }) => { this.props.onPMaxChange(item, index) }}
                                    bounces={true}
                                    data={Array.from({ length: 15 }, (_, i) => 0 + i)}
                                    renderItem={({ item, index }) => (
                                        <Bubble horizontal selected={index === selectedMax} >
                                            {item}
                                        </Bubble>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ margin: 20 }}>
                        <SaveButton
                            title={`| ` + translate('Save') + `?`}
                            callback={this.props.saveParticipants}
                        />
                    </View>
                </View>
            </Overlay>
        )
    }
}



export class SaveButton extends React.Component {
    render() {
        return (
            <View>
                <Button
                    buttonStyle={{ backgroundColor: 'green', borderRadius: this.props.borderRadius ? this.props.borderRadius : 0 }}
                    icon={
                        <Icon
                            name="check"
                            size={15}
                            color="white"
                            type='font-awesome'
                        />}
                    title={this.props.title}
                    onPress={this.props.callback} />
            </View>
        )
    }
}


const initialLayout = { width: Layout.window.width };

export class OverlayShareWithin extends React.Component {

    state = {
        friendNameFilter: '',
        teamNameFilter: '',
        index: 0,
    }

    onFriendFilterChange = (text) => {
        this.setState({ friendNameFilter: text })
    }

    onTeamFilterChange = (text) => {
        this.setState({ teamNameFilter: text })
    }

    render() {
        const routes = [
            { key: 'first', title: 'Friends' },
            { key: 'second', title: 'Teams' },
        ];

        const renderScene = SceneMap({
            first: this.FirstRoute,
            second: this.SecondRoute,
        });

        const renderTabBar = props => (
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: Colors.timakaColor }}
                style={{ backgroundColor: 'white' }}
                renderLabel={({ route, focused, color }) => (
                    <Text style={{ color: 'black', margin: 8 }}>
                        {route.title}
                    </Text>
                )}
            />
        );
        let index = this.state.index;
        return (
            <Overlay isVisible={this.props.sharingWithin}
                onBackdropPress={this.props.stopSharingWithin}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    onIndexChange={(index) => { this.setState({ index: index }) }}
                    initialLayout={initialLayout}
                />
            </Overlay>
        );
    }



    renderBlocSharing(title, placeholder, data, filter) {
        return (
            <View >
                <ProfileInput title={title} placeholderText={placeholder}
                    data={filter}
                    callbackOnChange={title == 'Friends' ? this.onFriendFilterChange : this.onTeamFilterChange}
                    isAdding={false} />
                <ScrollView style={{ margin: 10 }}>
                    {data
                        .filter((value) => {
                            if (title == 'Friends')
                                return value.user_name.toLowerCase().includes(filter.toLowerCase())
                            else
                                return value.team_name.toLowerCase().includes(filter.toLowerCase())
                        })
                        .map((item, index) => {
                            return (
                                <View key={title + '-' + index} style={{ margin: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>{title == 'Friends' ? item.user_name : item.team_name}</Text>
                                    {item.succesfully_sent ?
                                        <Icon name='check' size={15} color='green' reverse />
                                        :
                                        <Icon name='account-arrow-right-outline' type='material-community'
                                            color={Colors.timakaColor} size={20} raised
                                            onPress={() => { this.props.notifyWithin(title == 'Friends' ? 'FRIEND' : 'TEAM', item, index) }} />
                                    }
                                </View>
                            )
                        })}
                </ScrollView>
            </View>
        )
    }

    FirstRoute = () => (
        <View style={{ marginTop: 20 }}>
            {this.renderBlocSharing('Friends', translate("Friend Name filter here ..."), this.props.currentUserFriends, this.state.friendNameFilter)}
        </View>
    );

    SecondRoute = () => (
        <View style={{ marginTop: 20 }}>
            {this.renderBlocSharing('Teams', translate('Team Name filter here ...'), this.props.currentUserTeams, this.state.teamNameFilter)}
        </View>
    );
}


