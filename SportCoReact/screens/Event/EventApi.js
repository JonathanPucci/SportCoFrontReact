import SportCoApi from "../../services/apiService";
import { convertUTCDateToLocalDate } from './Helpers'
import { saveOrUpdateEventToNativeCalendar, removeEventFromNativeCalendar } from "../EventCalendar/EventCalendar";
const apiService = new SportCoApi();


/*********************************************************************************
 *************************                 ***************************************
 ********************       EVENT EDITION     ************************************
 *************************                 ***************************************
 ********************************************************************************/

export async function updateEvent() {
    try {
        if (this.state.eventData.event.event_id == '') {
            // Get Spot from region (create if not exist)
            // Then add spotId to event
            try {
                let spotData = {};
                if (this.state.eventData.spot == undefined || this.state.eventData.spot.spot_id == '' || this.state.eventData.spot.spot_id == undefined) {
                    let d = await this.apiService.getEntities("spots/coordinates", this.state.regionPicked);
                    if (d.data.length != 0)
                        spotData = d.data[0];
                    else {
                        //Spot is unknown yet, let's add it and retry
                        this.state.eventData.spot["spot_name"] = "Another spot.."
                        const newSpotData = await this.apiService.addEntity('spots', this.state.eventData.spot);
                        if (newSpotData.data.data.spot_id) {
                            this.state.eventData.spot['spot_id'] = newSpotData.data.data.spot_id
                            this.updateEvent();
                            throw "savedNewSpot";
                        }
                    }
                }
                else {
                    /*************************************
                     * ************ CREATION *************
                     *************************************/
                    let d = await this.apiService.getSingleEntity("spots", this.state.eventData.spot.spot_id);
                    spotData = d.data;
                }
                let updatedEventWithSpot = {
                    ...this.state.eventData.event,
                    spot_id: spotData.spot_id
                }
                updatedEventWithSpot.date.setSeconds(0, 0);
                console.log(updatedEventWithSpot.date);
                try {
                    const newEventAddedData = await this.apiService.addEntity('events', updatedEventWithSpot)
                    let newEventId = newEventAddedData.data.data.event_id;
                    let eventP = {
                        user_id: this.props.auth.user_id,
                        event_id: newEventId
                    }
                    await this.apiService.addEntity('eventparticipant', eventP);
                    if (this.props.auth.user.auto_save_to_calendar)
                        saveOrUpdateEventToNativeCalendar(updatedEventWithSpot);
                    await this.apiService.editEntity('userstats',
                        {
                            user_id: this.state.eventData.host.user_id,
                            statToUpdate: this.state.eventData.event.sport + '_created',
                            adding: true
                        });
                    this.setState({
                        editing: false,
                        refreshing: false,
                        eventData: {
                            ...this.state.eventData,
                            event: {
                                ...this.state.eventData.event,
                                event_id: newEventId
                            }
                        }
                    })
                } catch (error) {
                    console.log("0" + error)
                }
            } catch (error) {
                console.log("1" + error)
            }
        } else {
            //avoid setState as we just want to set in DB and then getData !
            //TODO : check if there's not easier...
            //this.state.eventData.event.date.setMinutes(this.state.eventData.event.date.getMinutes() - this.state.eventData.event.date.getTimezoneOffset());

            this.state.eventData.event['reason_for_update'] = 'EVENT_CHANGED';
            this.state.eventData.event['data_name'] = 'event_id';

            await this.apiService.editEntity('events', this.state.eventData.event)
            this.getData(true);
        }
    } catch (err) {
        console.log("2" + err)
    }
}

export async function cancelEvent() {
    this.state.eventData.event['reason_for_update'] = 'EVENT_CANCELED';
    this.state.eventData.event['data_name'] = 'event_id';

    await this.apiService.deleteEntity('events', this.state.eventData.event)
    await this.apiService.editEntity('userstats',
        {
            user_id: this.state.eventData.host.user_id,
            statToUpdate: this.state.eventData.event.sport + '_created',
            adding: false
        });
    this.props.navigation.goBack();
}

/*********************************************************************************
 *************************                 ***************************************
 ********************       JOIN OR LEAVE     ************************************
 *************************                 ***************************************
 ********************************************************************************/


export async function joinEvent() {
    if (this.state.eventData.participants.length < this.state.eventData.event.participants_max) {
        let eventP = {
            user_id: this.props.auth.user_id,
            event_id: this.state.eventData.event.event_id
        }
        await this.apiService.addEntity('eventparticipant', eventP);
        if (this.props.auth.user.auto_save_to_calendar)
            saveOrUpdateEventToNativeCalendar(this.state.eventData.event);
        await this.getData();
        this.setInitEventData();
        this.apiService.editEntity('userstats',
            {
                user_id: this.props.auth.user_id,
                statToUpdate: this.state.eventData.event.sport + '_joined',
                adding: true
            });
    } else {
        alert('Event is full, sorry !')
    }
}

export async function leaveEvent() {
    let eventP = {
        user_id: this.props.auth.user_id,
        event_id: this.state.eventData.event.event_id
    }
    await this.apiService.deleteEntity('eventparticipant', eventP)
    if (this.props.auth.user.auto_save_to_calendar)
        removeEventFromNativeCalendar(this.state.eventData.event);
    await this.getData();
    this.setInitEventData();
    this.apiService.editEntity('userstats',
        {
            user_id: this.props.auth.user_id,
            statToUpdate: this.state.eventData.event.sport + '_joined',
            adding: false
        });
}






/*********************************************************************************
 *************************                 ***************************************
 ********************           COMMENTS      ************************************
 *************************                 ***************************************
 ********************************************************************************/


export function addComment() {
    let comments = this.state.eventData.comments.slice().sort((a, b) => (new Date(a.date)) - (new Date(b.date)));
    let newComment = {
        isNew: true,
        user_id: this.props.auth.user_id,
        user_name: this.props.auth.user.user_name,
        photo_url: this.props.auth.user.photo_url,
        user: this.props.auth.user,
        comment_text: '',
        date: 'NEW',
        event_id: this.state.eventData.event.event_id
    }
    comments.push(newComment);
    this.setState({ eventData: { ...this.state.eventData, comments: comments } })
}

export function onCommentChangeText(text) {
    let comments = this.state.eventData.comments;
    comments[comments.length - 1].comment_text = text;
    this.setState({ eventData: { ...this.state.eventData, comments: comments } });
}

export async function validateComment() {
    let ec = this.state.eventData.comments[this.state.eventData.comments.length - 1];
    ec.date = convertUTCDateToLocalDate(new Date());
    const data = await apiService.addEntity('eventcomment', ec)
    await this.getData();
    this.setInitEventData();
}

export function cancelComment() {
    let comments = this.state.eventData.comments;
    comments.pop();
    this.setState({ eventData: { ...this.state.eventData, comments: comments } });
}