import React from "react";
import { View, Text } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Screen from '@screens'

const Stack = createNativeStackNavigator();

export class StackNavigator extends React.Component {
    _addScreen(name) {
        return (
            <Stack.Screen
                name={name}
                component={Screen[name]}
            />)
    }


    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                {this._addScreen('HomeScreen')}
                {this._addScreen('FilterScreen')}
                    
                    
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}