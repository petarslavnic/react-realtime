import { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { connectorShape, channelShape } from '../shapes'

class RealTimeChannel extends Component {
  getChildContext() {
    return { channel: this.channel }
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
  }

  static contextTypes = {
    connector: connectorShape.isRequired,
  }

  static childContextTypes = {
    channel: channelShape.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.channel = context.connector.subscribe(this.props.name)
  }

  componentWillUnmount() {
    this.context.connector.unsubscribe(this.props.name)
  }

  render() {
    return Children.only(this.props.children)
  }
}

export default RealTimeChannel
