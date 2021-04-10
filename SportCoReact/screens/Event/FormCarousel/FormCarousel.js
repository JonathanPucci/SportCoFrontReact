import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { FORM_PAGE_WIDTH, FORM_PAGE_HEIGHT, FORM_BORDER_RADIUS, TITLE_HEIGHT } from './styles'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { connect } from 'react-redux'
import { MapViewSpotPicker } from "../EventMapView/EventMapViewPicker";
import SportsAvailable from "../../../components/SportsAvailable";
import { SaveButton } from "../OverlaysEventEdition";
import { translate } from "../../../App";
import DatePicker from 'react-native-date-picker'
import { Layout } from "../../../constants/Layout";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {app_locale} from "../Helpers";

export const FormTitle = ({ title }) => (
    <View style={{
        flex: 1,
        position: 'absolute',
        alignSelf: 'center',
        height: FORM_PAGE_HEIGHT,
        width: FORM_PAGE_WIDTH,
        borderTopLeftRadius: FORM_BORDER_RADIUS,
        borderTopRightRadius: FORM_BORDER_RADIUS,
        overflow: 'hidden'
    }}>
        <View style={{
            position: 'absolute',
            height: TITLE_HEIGHT,
            width: FORM_PAGE_WIDTH,
            backgroundColor: '#BBBB'
        }} />
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', paddingTop: 20 }}>
            {title}
        </Text>
    </View>
);

class FormStepSport extends Component {
    render() {

        return (
            <View >
                <FormTitle title={translate('Sport')} />
                <ScrollView style={{ marginTop: TITLE_HEIGHT }}>
                    <SportsAvailable
                        maxOne={true}
                        sportsSelected={[this.props.sport]}
                        sportsSelectedChanged={(newsports) => { this.props.onSportChange(newsports[0]) }}
                    />
                </ScrollView>
            </View>
        )
    }
}


class FormStepMapPicker extends Component {
    render() {
        
        let eventData = this.props.eventData;
        let eventRegion = {
            latitude: parseFloat(eventData.spot.spot_latitude),
            longitude: parseFloat(eventData.spot.spot_longitude),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        };
        return (
            <View style={{ flex: 1 }}>
                <FormTitle title={translate('Location')} />
                <KeyboardAwareScrollView
                    style={{ marginTop: TITLE_HEIGHT, flex: 1 }}
                    keyboardShouldPersistTaps="always"
                >
                    <MapViewSpotPicker
                        isFromTimakaOverlay={true}
                        stopEditingMapMarker={() => { this.props.setEditingProperty('Localisation', false) }}
                        regionPicked={!isNaN(eventRegion.latitude) ? eventRegion : this.props.regionPicked}
                        onRegionChange={(region) => { this.props.regionChanged(region); }}
                        selectedSpot={(i, r) => { this.props.setStateEventDataProperty('spot', 'WHOLE', r); }}
                    />
                </KeyboardAwareScrollView>
            </View>
        )
    }
}


class FormStepTeam extends Component {
    render() {
        return (
            <View >
                <FormTitle title={translate('Team')} />
                <ScrollView style={{ marginTop: TITLE_HEIGHT }}>

                </ScrollView>
            </View>
        )
    }
}


class FormStepDateTime extends Component {

    constructor(props){
        super(props);
        this.today = new Date();
        this.state={
            date : props.event.event.date
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center' }}>
                <FormTitle title={translate('Date')} />
                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', height:20 }}>
                    <DatePicker
                        minuteInterval={5}
                        minimumDate={this.today}
                        date={this.state.date}
                        mode={'datetime'}
                        locale={app_locale}
                        is24hourSource='locale'
                        onDateChange={this.onDateChange}
                    />
                </View>
            </View>
        )
    }

    onDateChange = (date) => {
        this.setState({date : date});
        this.props.onDateChange(date);
    }


}

const FormSteps = [
    'datetimePicker',
    'sportPicker',
    'mapPicker',
]

class FormCarousel extends Component {

    state = {
        saveLabel: 'Precisely',
        titleLabel: 'Date',
        activeSlide: 0
    }

    increaseFormStep = () => {
        if (this.myScroll.currentIndex < 2)
            this.myScroll.snapToNext();
        else
            this.props.successCreation()
    }

    changeLabels = () => {
        if (this.myScroll != undefined) {
            let saveLabel = this.myScroll.currentIndex == 0 ? 'Precisely' : this.myScroll.currentIndex == 1 ? 'Exactly' : "Let's Go"
            let titleLabel = this.myScroll.currentIndex == 0 ? 'Date' : this.myScroll.currentIndex == 1 ? 'Sport' : 'Location'
            this.setState({ saveLabel: saveLabel, titleLabel: titleLabel })
        }
    }

    get pagination() {
        return (
            <Pagination
                dotsLength={FormSteps.length}
                activeDotIndex={this.state.activeSlide}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginVertical: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 6 }}>
                    <Carousel
                        decelerationRate="fast"
                        ref={(ref) => this.myScroll = ref}
                        onScrollToIndexFailed={() => { }}
                        containerCustomStyle={{ marginTop: 20, alignSelf: 'center', overflow: 'hidden' }}
                        slideStyle={{ backgroundColor: '#EEE', borderRadius: FORM_BORDER_RADIUS, overflow: 'hidden' }}
                        enableMomentum={true}
                        onMomentumScrollEnd={() => { this.changeLabels() }}
                        onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        data={FormSteps}
                        keyboardShouldPersistTaps='always'
                        keyExtractor={(item, index) => {
                            return 'key' + index
                        }}
                        renderItem={({ item, index }) => {
                            switch (item) {
                                case 'mapPicker':
                                    return (
                                        <FormStepMapPicker
                                            eventData={this.props.eventData}
                                            setEditingProperty={this.props.setEditingProperty}
                                            regionPicked={this.props.regionPicked}
                                            regionChanged={this.props.regionChanged}
                                            setStateEventDataProperty={this.props.setStateEventDataProperty}
                                            increaseFormStep={this.increaseFormStep}
                                            exitEventCreation={this.props.exitEventCreation}
                                        />
                                    )
                                case 'datetimePicker':
                                    return (
                                        <FormStepDateTime
                                            event={this.props.eventData}
                                            onDateChange={this.props.onDateChange}
                                            increaseFormStep={this.increaseFormStep}
                                        />
                                    )
                                case 'sportPicker':
                                    return (
                                        <FormStepSport
                                            sport={this.props.sport}
                                            saveSport={this.props.saveSport}
                                            onSportChange={this.props.onSportChange}
                                            increaseFormStep={this.increaseFormStep}
                                        />
                                    )
                            }
                        }}
                        sliderWidth={FORM_PAGE_WIDTH}
                        itemWidth={FORM_PAGE_WIDTH}
                        itemHeight={FORM_PAGE_HEIGHT}
                    />
                    {this.pagination}
                </View>
                {this.renderOptions()}
            </View>
        )
    }

    renderOptions() {
        return (
            <View style={{ flex: 1, width: FORM_PAGE_WIDTH, alignSelf: 'center' }}>
                <SaveButton
                    borderRadius={FORM_BORDER_RADIUS}
                    title={`| ` + translate(this.state.saveLabel)}
                    callback={() => {
                        if (this.myScroll.currentIndex == 2)
                            this.props.setStateEventDataProperty('spot', 'WHOLE', this.props.regionPicked)
                        this.increaseFormStep()
                    }}
                />
                <Button
                    title={translate('Forget it')}
                    buttonStyle={{ marginTop: 10, marginBottom: 20, backgroundColor: "red", borderRadius: FORM_BORDER_RADIUS }}
                    onPress={this.props.exitEventCreation}
                />
            </View>
        )
    }

    scrollToElement(i = this.props.currentIndex, fromPress = false) {
        if (this.myScroll != undefined && this.myScroll != null)
            this.myScroll.snapToItem(i);
    }
}



const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

const mapStateToProps = (state) => ({
    ...state,
    eventDataFromStore: state.eventSaved.eventData
})

export default connect(mapStateToProps, mapDispatchToProps)(FormCarousel)

