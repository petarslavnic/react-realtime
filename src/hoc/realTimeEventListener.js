import React from 'react'
import { channelShape } from '../shapes'
import { getDisplayName } from '../utils/displayName'

const realTimeEventListener = (eventName, mapEventCallback = null, mapEventProps = null) => WrappedComponent => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props)

      if (typeof eventName === `function`) {
        eventName = eventName(props)

        if (typeof eventName !== `string`) {
          throw new Error(`The result of a given function needs to be string type!`)
        }
      }

      this.eventName = eventName
      this.oldEventProps = this.newEventProps = { ...props }

      if (typeof this.eventName !== `string`) {
        throw new Error(`Passed event name value needs to be string type!`)
      }
    }

    static displayName = `RealTimeEventListener(${getDisplayName(WrappedComponent)})`

    static contextTypes = {
      channel: channelShape.isRequired,
    }

    componentWillReceiveProps(nextProps) {
      this.newEventProps = { ...this.newEventProps, ...nextProps }
    }

    componentDidMount() {
      this.context.channel.bind(this.eventName, this.handleCallback)
    }

    componentWillUnmount() {
      this.context.channel.unbind(this.eventName, this.handleCallback)
    }

    handleCallback = data => {
      if (typeof mapEventCallback === `function`) mapEventCallback(data, this.props)
      if (typeof mapEventProps === `function`) {
        const eventProps = mapEventProps(data, this.props)

        if (typeof eventProps === `object`) {
          this.newEventProps = { ...this.newEventProps, ...eventProps }
        }

        let needUpdate = false

        if (this.newEventProps !== this.oldEventProps) {
          Object.keys(this.newEventProps).forEach(propName => {
            if (this.newEventProps[propName] !== this.oldEventProps[propName]) {
              needUpdate = true
            }
          })
        }

        if (needUpdate) {
          this.oldEventProps = this.newEventProps
          this.forceUpdate()
        }
      }
    }

    render() {
      return <WrappedComponent { ...this.newEventProps } />
    }
  }
}

export default realTimeEventListener
