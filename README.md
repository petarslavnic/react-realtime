# React-RealTime

[![Build Status](https://travis-ci.org/petarslavnic/react-realtime.svg?branch=master)](https://travis-ci.org/petarslavnic/react-realtime)
[![codecov](https://codecov.io/gh/petarslavnic/react-realtime/branch/master/graph/badge.svg)](https://codecov.io/gh/petarslavnic/react-realtime)
[![npm version](https://badge.fury.io/js/react-realtime.svg)](https://badge.fury.io/js/react-realtime)

Set of components which provides easy integration Pusher like notification service into your React application.


## Installation

React Realtime requires **React 15.6.0 or later.**

```
npm i react-realtime
```

OR

```
yarn add react-realtime
```

## Usage

All components and functions are available on the top-level export.

```js
import { RealTimeProvider, RealTimeChannel, realTimeEventListener, realTimeEventTrigger } from 'react-realtime'
```

#### Pusher example:
In that case, we need pusher client library. You can find it [here](https://github.com/pusher/pusher-js). Lets first create functional component which will show user name:
```js
const UserName = ({ name }) => <span>{`User: ${name}`}</span>
```

Wrap user name component inside real-time listener hoc
```js
// Trough event comes data object
const mapDataToProps = (data, ownProps) => {
  return { ...data }
}

// bind to a specific event
const MyComponent = realTimeEventListener('my-event', null, mapDataToProps)(UserName)
```

Use wrapped component inside appropriate channel
```js
// Use your own APP_KEY and APP_CLUSTER from pusher account
const pusher = new Pusher(APP_KEY, {
  cluster: APP_CLUSTER
});

const App = () => {
  return (
    <RealTimeProvider connector={pusher}>
      <RealTimeChannel name="my-channel">
        <MyComponent />
      </RealTimeChannel>
    </RealTimeProvider>
  )
}

```
Trigger an event from debug console inside pusher dashboard and watch how username appears in your app.

## License

MIT
