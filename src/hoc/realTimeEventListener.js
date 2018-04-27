import React from 'react'
import PropTypes from 'prop-types'
import { getDisplayName } from '../utils/displayName'

const realTimeEventListener = (eventName, mapEventCallback = null, mapEventProps = null) => WrappedComponent => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props)

      if (typeof eventName === `function`) {
        eventName = eventName(props)
      }

      if (typeof eventName !== `string`) {
        eventName = ``
      }

      this.eventName = eventName
      this.oldEventProps = this.newEventProps = { ...props }
    }

    static displayName = `RealTimeEventListener(${getDisplayName(WrappedComponent)})`

    static propTypes = {
      bind: PropTypes.func.isRequired,
      unbind: PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
      this.newEventProps = { ...this.newEventProps, ...nextProps }
    }

    componentDidMount() {
      this.props.bind(this.eventName, this.handleCallback)
    }

    componentWillUnmount() {
      this.props.unbind(this.eventName, this.handleCallback)
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
