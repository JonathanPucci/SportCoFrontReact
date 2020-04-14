import SportCoApi from "../../services/apiService";
import { convertUTCDateToLocalDate } from './Helpers'
const apiService = new SportCoApi();


/*********************************************************************************
 *************************                 ***************************************
 ********************       EVENT EDITION     ************************************
 *************************                 ***************************************
 ********************************************************************************/

export function updateEvent() {
    if (this.state.event.event.event_id == '') {
        // Get Spot from region (create if not exist)
        // Then add spotId to event
        this.apiService.getEntities("spots/coordinates", this.state.regionPicked)
            .then((data) => {
                if (data.data.length != 0) {
                    let updatedEventWithSpot = {
                        event: {
                            ...this.state.event,
                            event: {
                                ...this.state.event.event,
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
                                            user_id: this.state.event.host.user_id,
                                            statToUpdate: this.state.event.event.sport + '_created',
                                        });
                                    this.setState(newState, () => { this.getData() });
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else {
                    //Spot is unknown yet, let's add it and retry
                    this.apiService.addEntity('spots', this.state.event.spot)
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
        //this.state.event.event.date.setMinutes(this.state.event.event.date.getMinutes() - this.state.event.event.date.getTimezoneOffset());

        this.state.event.event['reason_for_update'] = 'EVENT_CHANGED';
        this.state.event.event['data_name'] = 'event_id';

        this.apiService.editEntity('events', this.state.event.event)
            .then(() => {
                this.getData();
            })
    }
}

export function editEvent() {
    this.setState({ editing: true, eventBeforeEdit: this.state.event })
}

export function cancelEdit() {
    this.setState({ editing: false, event: this.state.eventBeforeEdit });
}

export function cancelEvent() {
    this.state.event.event['reason_for_update'] = 'EVENT_CANCELED';
    this.state.event.event['data_name'] = 'event_id';

    this.apiService.deleteEntity('events', this.state.event.event)
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
    let eventP = {
        user_id: this.state.loggedUser_id,
        event_id: this.state.event.event.event_id
    }
    this.apiService.addEntity('eventparticipant', eventP)
        .then(() => {
            this.getData();
        })
    this.apiService.editEntity('userstats',
        {
            user_id: this.state.loggedUser_id,
            statToUpdate: this.state.event.event.sport + '_joined'
        });
}

export function leaveEvent() {
    let eventP = {
        user_id: this.state.loggedUser_id,
        event_id: this.state.event.event.event_id
    }
    this.apiService.deleteEntity('eventparticipant', eventP)
        .then(() => {
            this.getData();
        })
}






/*********************************************************************************
 *************************                 ***************************************
 ********************           COMMENTS      ************************************
 *************************                 ***************************************
 ********************************************************************************/


export function addComment() {
    let comments = this.state.event.comments.slice().sort((a, b) => (new Date(a.date)) - (new Date(b.date)));
    let newComment = {
        isNew: true,
        user_id: this.props.auth.user_id,
        user_name: this.props.auth.user.displayName,
        photo_url: this.props.auth.user.photoURL,
        comment_text: '',
        date: 'NEW',
        event_id: this.state.event.event.event_id
    }
    comments.push(newComment);
    this.setState({
        event: { ...this.state.event, comments: comments }
    })
}

export function onCommentChangeText(text) {
    let comments = this.state.event.comments;
    comments[comments.length - 1].comment_text = text;
    this.setState({ event: { ...this.state.event, comments: comments } });
}

export function validateComment() {
    let ec = this.state.event.comments[this.state.event.comments.length - 1];
    ec.date = convertUTCDateToLocalDate(new Date());
    apiService.addEntity('eventcomment', ec)
        .then(() => {
            this.getData();
        })
}

export function cancelComment() {
    let comments = this.state.event.comments;
    comments.pop();
    this.setState({ event: { ...this.state.event, comments: comments } });
}