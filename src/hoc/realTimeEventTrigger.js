import React from 'react'
import { channelShape } from '../shapes'
import { getDisplayName } from '../utils/displayName'

const realTimeEventTrigger = (mapEventProps) => WrappedComponent => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props)
      this.handleEventProps(props)
    }

    static displayName = `RealTimeEventTrigger(${getDisplayName(WrappedComponent)})`

    static contextTypes = {
      channel: channelShape.isRequired,
    }

    componentWillReceiveProps(nextProps) {
      this.handleEventProps(nextProps)
    }

    handleEventProps = props => {
      if (typeof mapEventProps !== `function`) {
        throw new Error(`First argument for this function need to be a function type!`)
      }

      this.eventProps = mapEventProps(this.trigger, props)

      if (typeof this.eventProps !== `object`) {
        throw new Error(`Passed event props need to be object type!`)
      }
    }

    trigger = (eventName, data) => {
      this.context.channel.trigger(eventName, data)
    }

    render() {
      const newProps = { ...this.props, ...this.eventProps }
      return <WrappedComponent { ...newProps} />
    }
  }
}

export default realTimeEventTrigger
