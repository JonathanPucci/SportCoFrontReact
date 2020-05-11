import * as React from 'react';
import { Image, View, TouchableWithoutFeedback, Platform } from 'react-native';
import { Text, Icon } from 'react-native-elements'

import { connect } from 'react-redux'

import { styles, MAX_ON_LINE, MARGIN_BETWEEN_ICONS, OPTION_ICON_SIZE } from './styles'
import { mapSportIcon } from '../../helpers/mapper';
import * as RootNavigation from '../../navigation/RootNavigation.js';
import { DEFAULT_PROFILE_PIC } from '../../constants/AppConstants'
import Colors from '../../constants/Colors';


class Members extends React.Component {

    state = {
        selectedMember: -1
    }

    render = () => {
        let nuplets = this.buildNUplets(this.props.items);
        return (
            <View>
                <Text style={styles.desc}>Members {this.props.toBeValidated ? 'to validate' : ''}</Text>
                <View style={{ marginTop: 10, flexDirection: 'column', marginLeft: 15 }}>
                    {nuplets.map((memberLine, index) => {
                        return (
                            <View key={'memberLine-' + index} style={{ flexDirection: 'row', marginTop: 20 }}>
                                {memberLine.map((member, index) => {
                                    let isSelected = this.props.selectedMember == member.member_id;
                                    return (
                                        <View
                                            key={'member-' + index}
                                            style={{ marginLeft: MARGIN_BETWEEN_ICONS }}
                                        >
                                            <View style={styles.viewMember}>
                                                <TouchableWithoutFeedback
                                                    style={{ height: '100%', width: '100%' }}
                                                    onPress={() => {
                                                        this.props.canSelect ?
                                                            this.props.selectedChanged(member.member_id)
                                                            :
                                                            RootNavigation.navigateToProfile(member.email)
                                                    }}>
                                                    <View style={[{
                                                        height: '100%',
                                                        width: '100%'
                                                    },
                                                    (this.props.canSelect && isSelected) ? Platform.OS == 'ios' ? {
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 12,
                                                        },
                                                        shadowOpacity: 0.58,
                                                        shadowRadius: 16.00,
                                                    } : {
                                                            backgroundColor: 'green',
                                                        } : {}]}>
                                                        {member.photo_url != null ?
                                                            <Image source={{ uri: member.photo_url + '?type=large&width=500&height=500' }} style={styles.memberImage} />
                                                            :
                                                            <Image source={DEFAULT_PROFILE_PIC} resizeMode='contain' style={styles.memberImageNoBorder} />
                                                        }
                                                    </View>
                                                </TouchableWithoutFeedback>

                                                <View style={styles.iconOnEvent}>
                                                    {this.props.team.team_manager == member.member_id ?
                                                        <View style={styles.iconOnEventCrown}>
                                                            <Icon name='crown' type='material-community' reverse size={10}
                                                                color={Colors.timakaColor}
                                                                style={{ marginBottom: 10 }}
                                                            />
                                                        </View >
                                                        :
                                                        <View style={styles.iconOnEventName}>
                                                            <Text style={{ color: "white", fontSize: 8, textAlign: "center" }}>
                                                                {member.user_name != undefined ?
                                                                    (member.user_name.split(' ')[0][0] +
                                                                        (member.user_name.split(' ').length > 0 ? member.user_name.split(' ')[1][0] : ''))
                                                                    : ''}
                                                            </Text>
                                                        </View >
                                                    }
                                                </View >
                                                {this.props.toBeValidated && (
                                                    <View>
                                                        <View style={styles.iconOnEventAccept}>
                                                            <Icon name='check' type='font-awesome' color='green' size={OPTION_ICON_SIZE} raised
                                                                onPress={() => { this.acceptMember(member) }} />
                                                        </View >

                                                        <View style={styles.iconOnEventDecline}>
                                                            <Icon name='remove' type='font-awesome' color='red' size={OPTION_ICON_SIZE} raised
                                                                onPress={() => { this.declineMember(member) }} />
                                                        </View >
                                                    </View >
                                                )}
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>

                        )

                    })}

                </View>
            </View >
        )
    }

    buildNUplets(items) {
        let res = [];
        let line = [];
        for (let index = 0; index < items.length; index++) {
            line.push(items[index]);
            if (line.length == MAX_ON_LINE) {
                res.push(line);
                line = [];
            }
            if (index == items.length - 1) {
                res.push(line);
            }
        }
        return res;
    }

    acceptMember(member) {
        this.props.acceptMember(member);
    }

    declineMember(member) {
        this.props.declineMember(member);

    }

}



const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps)(Members)

