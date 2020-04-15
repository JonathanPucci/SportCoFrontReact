import React, {Component} from 'react';
import { View } from "react-native";

class Todo extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitState()
  }

  getInitState = () => ({
    draftData: props.eventData
  })

  updateDraftData = (text) => {
    this.setState({draftData: text})
  }

  cancel = () => {
    this.setState(this.getInitState())
  }

  componentDidMount() {
    loadData()
  }

  render() {
    return <View>
      <TextInput 
        value={this.state.draftData}
        onChange={this.updateDraftData}
      />
      <Touchable onPress={this.cancel} />
    </View>
  }

}

const mapDispatchToProps = state => ({
  eventData: state.events,
  hasError: state.hasError
})

// exports connect(mapDispatchToProps)(Component)

/**
 * Ailleurs
 */

const loadData = async () => {
  try {
    const data = await getDataFromNetwork()
    store.dispatch(actionCreator('LOAD_EVENT_SUCCESS', data))
  } catch (error) {
    store.dispatch(actionCreator('LOAD_EVENT_ERROR'))
  }
}

/**
 * Reducer
 */

 const reducer = (action) => {
   switch (action.type) {
    case 'LOAD_EVENT_SUCCESS':
      return {...state, events : action.payload, hasError: false}
      break;
    case 'LOAD_EVENT_ERROR':
      return {...state, hasError : true}
      break;
    default:
      break;
   }
 }