import * as React from 'react';
import { SocialIcon } from 'react-native-elements'
import { Linking } from 'react-native';
import { translate } from '../App';

export class Social extends React.Component {
  render() {
    return (<SocialIcon
      type={this.props.name}
      size={32}
      onPress={() => { this.openSocialLink() }}
    />
    )
  }

  openSocialLink() {
    switch (this.props.name) {
      case 'instagram':
        // if (this.props.instagramUserName != null)
        //   Linking.openURL('instagram://user?username=' + this.props.instagramUserName)
        alert(translate('alertInstagramLink'))
        break;
      case 'facebook':
        // if (this.props.facebookUserId != null)
        // Linking.openURL('fb://page/3147119735300212')
        alert(translate("alertFBLink"))

        break;

      default:
        break;
    }
  }

}