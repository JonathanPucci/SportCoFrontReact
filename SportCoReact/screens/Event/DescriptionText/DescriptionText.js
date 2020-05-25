
import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from './styles'
import { Icon } from 'react-native-elements'
import { mapLevelImage } from '../Helpers'
import { translate } from '../../../App';


export class DescriptionText extends React.Component {


    constructor(props) {
        super(props);
        this.state = {

        };

    }


    /********************************************************************************
   *************************                  ***************************************
   ********************         DESCRIPTION        **********************************
   *************************                  ***************************************
   *********************************************************************************/

    render() {
        let title = this.props.title;
        let data = this.props.data;
        let centered = this.props.centered || 'auto';
        let isMutable = this.props.isMutable != undefined ? this.props.isMutable : true;
        let levelImage = null;
        if (title == 'Level') {
            levelImage = mapLevelImage(this.props.sport, null, data.toLowerCase());
        }
        return (
            <View style={[
                { flex: 1, flexDirection: 'column' },

                title == 'Min' || title == 'Going' || title == 'Max' ? this.props.editing ? { bottom: 22.5 } : { bottom: 8.5 } : {}
            ]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.props.editing && isMutable && (
                        <Icon
                            raised
                            name='edit'
                            type='font-awesome'
                            color='orange'
                            size={title == 'Min' ? 8 : 15}
                            onPress={() => this.props.setEditingProperty(title, true)} />
                    )}
                    <Text 
                    numberOfLines={1}
                    style={[
                        styles.titleDescription,
                        centered != 'auto' ? { textAlign: 'center' } : {},
                        this.props.editing ? { top: 15 } : {}
                    ]}>{translate(title)}</Text>
                </View>
                <View style={[
                    styles.titleDescriptionText,
                    {
                        flexDirection: 'row',
                        marginTop: title == 'Min' || title == 'Going' || title == 'Max' || title == 'Visibility' ? this.props.editing ? 20 : 10 : 0,
                        bottom: this.props.editing && (title == 'Min' || title == 'Visibility') ? 5 : 0,
                        width: title == 'Visibility' ? 140 : 'auto',
                        alignSelf: centered
                    }]}>
                    {title == 'Level' && (
                        <Image source={levelImage} style={{
                            position: 'absolute',
                            bottom: this.props.editing ? 40 : 50,
                            left: this.props.editing ? 100 : 60,
                            height: 40,
                            width: 40
                        }} />
                    )}
                    <Text style={[
                        styles.titleDescriptionText,
                        {
                            alignSelf: centered,
                            textAlign: centered,
                        }
                    ]}>
                        {data}
                    </Text>
                    {title == 'Visibility' && (
                        <View style={{ flexDirection: 'row', right: 10, bottom: this.props.editing ? 15 : 28 }}>
                            <Icon name={'eye'} type='material-community' />
                            <View style={{ bottom: 3 }}>
                                <Icon name={data == 'PRIVATE' ? 'lock' : 'lock-open'} />
                            </View>
                        </View>
                    )}
                </View>
            </View>
        )
    }

}