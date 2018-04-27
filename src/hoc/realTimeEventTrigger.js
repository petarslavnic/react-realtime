import React from 'react'
import PropTypes from 'prop-types'
import { getDisplayName } from '../utils/displayName'

const realTimeEventTrigger = (mapEventProps) => WrappedComponent => {
  return class extends React.PureComponent {
    constructor(props) {
      super(props)
      this.handleEventProps(props)
    }

    static displayName = `RealTimeEventTrigger(${getDisplayName(WrappedComponent)})`

    static propTypes = {
      trigger: PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
      this.handleEventProps(nextProps)
    }

    handleEventProps = props => {
      let newProps

      if (typeof mapEventProps === `function`) {
        newProps = mapEventProps(this.trigger, props)
      }

      if (typeof newProps !== `object`) {
        newProps = {}
      }

      this.newProps = { ...props, ...newProps }
    }

    trigger = (eventName, data) => {
      this.props.trigger(eventName, data)
    }

    render() {
      return <WrappedComponent {...this.newProps} />
    }
  }
}

export default realTimeEventTrigger
