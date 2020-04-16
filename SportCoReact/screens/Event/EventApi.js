import SportCoApi from "../../services/apiService";
import { convertUTCDateToLocalDate } from './Helpers'
const apiService = new SportCoApi();


/*********************************************************************************
 *************************                 ***************************************
 ********************       EVENT EDITION     ************************************
 *************************                 ***************************************
 ********************************************************************************/

export function updateEvent() {
    if (this.state.eventData.event.event_id == '') {
        // Get Spot from region (create if not exist)
        // Then add spotId to event
        this.apiService.getEntities("spots/coordinates", this.state.regionPicked)
            .then((data) => {
                if (data.data.length != 0) {
                    let updatedEventWithSpot = {
                        event: {
                            ...this.state.eventData,
                            event: {
                                ...this.state.eventData.event,
                                spot_id: data.data[0].spot_id
                            },
                            spot: data.data[0]
                        }
                    }
                    this.apiService.addEntity('events', updatedEventWithSpot.event.event)
                        .then((res) => {
                            let eventP = {
                                user_id: this.state.loggedUser_id,
                                event_id: res.data.data.event_id
                            }
                            this.apiService.addEntity('eventparticipant', eventP)
                                .then((data) => {
                                    let newState = {
                                        editing: false,
                                        event: {
                                            ...updatedEventWithSpot.event,
                                            event: {
                                                ...updatedEventWithSpot.event.event,
                                                event_id: res.data.data.event_id
                                            }
                                        }
                                    };
                                    this.apiService.editEntity('userstats',
                                        {
                                            user_id: this.state.eventData.host.user_id,
                                            statToUpdate: this.state.eventData.event.sport + '_created',
                                        });
                                    this.setState(newState, () => { this.getData(true) });
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else {
                    //Spot is unknown yet, let's add it and retry
                    this.apiService.addEntity('spots', this.state.eventData.spot)
                        .then((data) => {
                            this.updateEvent();
                        })
                }
            })
            .catch((error) => {

            })

    } else {
        //avoid setState as we just want to set in DB and then getData !
        //TODO : check if there's not easier...
        //this.state.eventData.event.date.setMinutes(this.state.eventData.event.date.getMinutes() - this.state.eventData.event.date.getTimezoneOffset());

        this.state.eventData.event['reason_for_update'] = 'EVENT_CHANGED';
        this.state.eventData.event['data_name'] = 'event_id';

        this.apiService.editEntity('events', this.state.eventData.event)
            .then(() => {
                this.getData(true);
            })
    }
}

export function cancelEvent() {
    this.state.eventData.event['reason_for_update'] = 'EVENT_CANCELED';
    this.state.eventData.event['data_name'] = 'event_id';

    this.apiService.deleteEntity('events', this.state.eventData.event)
        .then((data) => {
            this.props.navigation.goBack();
        });
}

/*********************************************************************************
 *************************                 ***************************************
 ********************       JOIN OR LEAVE     ************************************
 *************************                 ***************************************
 ********************************************************************************/


export function joinEvent() {
    if (this.state.eventData.participants.length < this.state.eventData.event.participant_max) {
        let eventP = {
            user_id: this.state.loggedUser_id,
            event_id: this.state.eventData.event.event_id
        }
        this.apiService.addEntity('eventparticipant', eventP)
            .then(() => {
                this.getData(false);
            })
        this.apiService.editEntity('userstats',
            {
                user_id: this.state.loggedUser_id,
                statToUpdate: this.state.eventData.event.sport + '_joined'
            });
    } else {
        alert('Event is full, sorry !')
    }
}

export function leaveEvent() {
    let eventP = {
        user_id: this.state.loggedUser_id,
        event_id: this.state.eventData.event.event_id
    }
    this.apiService.deleteEntity('eventparticipant', eventP)
        .then(() => {
            this.getData(false);
        })
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
        user_name: this.props.auth.user.displayName,
        photo_url: this.props.auth.user.photoURL,
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
    this.getData();
}

export function cancelComment() {
    let comments = this.state.eventData.comments;
    comments.pop();
    this.setState({ eventData: { ...this.state.eventData, comments: comments } });
}