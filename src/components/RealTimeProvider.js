import { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { connectorShape } from '../shapes'

class RealTimeProvider extends Component {
  getChildContext() {
    return { connector: this.connector }
  }

  static propTypes = {
    connector: connectorShape.isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = {
    connector: connectorShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.connector = props.connector
  }

  render() {
    return Children.only(this.props.children)
  }
}

export default RealTimeProvider
