# React-RealTime

[![Build Status](https://travis-ci.org/petarslavnic/react-realtime.svg?branch=master)](https://travis-ci.org/petarslavnic/react-realtime)
[![codecov](https://codecov.io/gh/petarslavnic/react-realtime/branch/master/graph/badge.svg)](https://codecov.io/gh/petarslavnic/react-realtime)
[![npm version](https://badge.fury.io/js/react-realtime.svg)](https://badge.fury.io/js/react-realtime)

Set of components which provides easy integration Pusher like notification service into your React application.


## Installation

React Realtime requires **React 16.8.0 or later.**

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
import {
  RealTimeProvider,
  RealTimeChannel,
  useRealTimeEventListener,
  useRealTimeEventTrigger,
  useRealTimeConnectionEventListener,
} from 'react-realtime'
```

#### Pusher example:
In that case, we need pusher client library. You can find it [here](https://github.com/pusher/pusher-js).

Channel event listener example:
```js
import React, { useState, useCallback } from 'react'
import { useRealTimeEventListener } from 'react-realtime'

const MyComponent = () => {
  const [name, setName] = useState('')
  const onMyEventCallback = useCallback(data => {
    // do something with real-time data
    // for example set username
    const { name } = data
    setName(name)
  }, [])

  useRealTimeEventListener('user-updated-event', onMyEventCallback)

  return <span>{`User: ${name}`}</span>
}
```

Channel event trigger example:
```js
import React, { useMemo, useCallback } from 'react'
import { useRealTimeEventTrigger } from 'react-realtime'

const MyComponent = () => {
  const data = useMemo(() => {
    // for example return empty object
    return {}
  }, [])
  const trigger = useRealTimeEventTrigger()
  const handleClick = useCallback(() => {
    trigger('client-my-event', data)
  }, [])

  return <span onClick={handleClick}>My Component</span>
}
```

Connection event listener example:
```js
import React, { useState, useCallback } from 'react'
import { useRealTimeConnectionEventListener } from 'react-realtime'

const MyComponent = () => {
  const [status, setStatus] = useState('connected')
  const onStateChange = useCallback(status => {
    setStatus(status)
  }, [])

  useRealTimeConnectionEventListener('state_change', onStateChange)

  return <span>{`Connection status: ${status}`}</span>
}
```

Use MyComponent inside appropriate channel
```js
import React from 'react'
import Pusher from 'pusher-js'
import { RealTimeProvider, RealTimeChannel } from 'react-realtime'

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
