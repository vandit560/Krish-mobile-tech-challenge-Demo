import React from 'react'
import { View, StyleSheet } from 'react-native';

import { Provider } from 'react-redux';
import myStore from './reducers';
import { StackNavigator } from '@navigators'

const store = myStore()
export default class App extends React.Component {
    render() {
        return (
            <Provider store={store} >
                <StackNavigator />
            </Provider >)
    }
}