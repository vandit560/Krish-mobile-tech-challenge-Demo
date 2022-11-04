import React from "react";
import { View, Text, FlatList, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//https://www.google.com/search?sxsrf=ALiCzsZ5Y_3Zn0mXy6qtv7s5vR8bmAPqDw:1667310815809&q=planets+screen+design+in+mobile&tbm=isch&chips=q:planets+screen+design+in+mobile,online_chips:space+app:gSqfMftR2DU%3D&usg=AI4_-kTk8LmBEwxqOvXYxqanEH7077heWQ&sa=X&ved=2ahUKEwjB65_nkI37AhUWSGwGHZWvCNAQgIoDKAJ6BAgREBk&biw=1536&bih=758&dpr=1.25#imgrc=BWdYPPQY2NFwkM

import { actionCreators } from '@actions'
import Planets from '../../constants/planets_ui.json'
import { responsiveFonts, responsiveHeight, responsiveWidth } from "../../helpers/scaling";
import { Images } from "../../assets";
import { reducerType } from "../../constants/reducerType";
class FilterScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            searchData: '',
            dataList: Planets.results,
            isShowClimate: false,
            isShowTerrain: false,
            isShowSorting: false,
            sorting_order: 'asc',
            climateList: [],
            terrainList: [],
            sortingList: [
                {
                    name: 'Name',
                    isSelected: false
                },
                {
                    name: 'Population',
                    isSelected: false
                },
                {
                    name: 'Residents',
                    isSelected: false
                },
            ]
        }
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerShown: true,

            headerLeft: () => (
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveHeight(1) }}>
                    <Image style={{ transform: [{ rotate: '90deg' }], width: responsiveWidth(5), height: responsiveHeight(5), }} resizeMode='contain' source={Images.icnArrowDown} />
                </TouchableOpacity>
            ),
            title: "Filter",
            headerBackVisible: false,
            headerShadowVisible: false
        })


        var climateList = []
        var terrainList = []
        this.state.dataList.map((item) => {
            var Climate = item.climate.split(',');
            var Terrain = item.terrain.split(',');
            Terrain = Terrain.map((i) => { return { name: i, isSelected: false } })
            Climate = Climate.map((i) => { return { name: i, isSelected: false } })
            terrainList = [...terrainList, ...Terrain]
            climateList = [...climateList, ...Climate]
        });
        terrainList = terrainList.filter((v, i, a) => a.findIndex((t) => t.name == v.name) === i);
        climateList = climateList.filter((v, i, a) => a.findIndex((t) => t.name == v.name) === i);
        this.setState({ climateList: climateList, terrainList: terrainList })
    }

    onPressSubmit = () => {
        var filterData = [
            {
                name: 'climate',
                list: this.state.climateList.filter(i => i.isSelected)
            },
            {
                name: 'terrain',
                list: this.state.terrainList.filter(i => i.isSelected)
            },
            {
                name: 'sorting',
                list: this.state.sortingList.filter(i => i.isSelected),
                sorting_order: this.state.sorting_order,
            }
        ];
        console.log("dispatchData :", this.props);
        this.props.dispatchData(filterData, reducerType.filterData)
        this.props.navigation.goBack()
    }

    onPressReset = () => {
        var sortingList = [...this.state.sortingList];
        sortingList = sortingList.map((i) => { return { name: i.name, isSelected: false } })
        var climateList = [...this.state.climateList];
        climateList = climateList.map((i) => { return { name: i.name, isSelected: false } })
        var terrainList = [...this.state.terrainList];
        terrainList = terrainList.map((i) => { return { name: i.name, isSelected: false } })
        this.setState({ sortingList, terrainList, climateList }, () => {
            this.props.dispatchData([], reducerType.filterData)
        })
    }

    onPressSelect = (key, index) => {
        if (key == 'Terrain') {
            var terrainList = [...this.state.terrainList];
            terrainList[index].isSelected = !terrainList[index].isSelected
            this.setState({ terrainList: terrainList })
        } else if (key == 'Climate') {
            var climateList = [...this.state.climateList];
            climateList = climateList.map((i) => { return { name: i.name, isSelected: false } })
            climateList[index].isSelected = !climateList[index].isSelected
            this.setState({ climateList: climateList })
        } else {
            var sortingList = [...this.state.sortingList];
            sortingList = sortingList.map((i) => { return { name: i.name, isSelected: false } })
            sortingList[index].isSelected = !sortingList[index].isSelected
            this.setState({ sortingList: sortingList })
        }
    }

    _renderHeader = (title, flag, onPress) => (
        <TouchableOpacity
            onPress={onPress}
            style={styles.renderHeaderContainer}>
            <Text style={styles.renderHeaderText}>{title}</Text>
            <Image source={Images.icnArrowDown} style={styles.renderIconContainer(flag)}></Image>
        </TouchableOpacity>
    )

    _renderItem = ({ item, index }, key) => (
        <TouchableOpacity
            onPress={() => this.onPressSelect(key, index)}
            style={styles.renderItemContainer}>
            <Text style={styles.renderItemText}>{item.name.trim()}</Text>
            <View style={styles.renderSelectContainer}>
                {item.isSelected && <View style={styles.selectContainer} />}

            </View>
        </TouchableOpacity>
    )

    _renderFilterClimate = () => (
        <View style={styles.shadowContainer}>
            {this._renderHeader('Climate', this.state.isShowClimate, () => this.setState({ isShowClimate: !this.state.isShowClimate, isShowTerrain: false, isShowSorting: false }))}
            {this.state.isShowClimate && <FlatList
                scrollEnabled={false}
                numColumns={2}
                data={this.state.climateList}
                renderItem={(item) => this._renderItem(item, 'Climate')}
            />}
        </View>
    )

    _renderFilterTerrain = () => (
        <View style={styles.shadowContainer}>

            {this._renderHeader('Terrain', this.state.isShowTerrain,
                () => this.setState({ isShowTerrain: !this.state.isShowTerrain, isShowClimate: false, isShowSorting: false }))}
            {this.state.isShowTerrain &&
                <FlatList
                    scrollEnabled={false}
                    numColumns={2}
                    data={this.state.terrainList}
                    renderItem={(item) => this._renderItem(item, 'Terrain')}
                />}

        </View>
    )

    _renderFilterSort = () => (
        <View style={styles.shadowContainer}>
            {this._renderHeader('Sorting', this.state.isShowSorting, () => this.setState({ isShowSorting: !this.state.isShowSorting, isShowClimate: false, isShowTerrain: false }))}
            {this.state.isShowSorting &&
                <>
                    <FlatList
                        scrollEnabled={false}
                        data={this.state.sortingList}
                        renderItem={(item) => this._renderItem(item, 'Sorting')}
                    />

                    <View style={styles.sortingContainer}>
                        <TouchableOpacity onPress={() => this.setState({ sorting_order: 'asc' })}>
                            <Image source={Images.icnSortAZ} style={{ tintColor: this.state.sorting_order == 'asc' ? 'red' : undefined }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ sorting_order: 'dec' })}>
                            <Image source={Images.icnSortZA} style={{ tintColor: this.state.sorting_order == 'dec' ? 'red' : undefined }} />
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    )

    _renderButton = () => (
        <View style={styles.allButtonContainer}>
            <TouchableOpacity
                onPress={() => this.onPressReset()}
                style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    this.onPressSubmit();
                }}
                style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    )

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, backgroundColor: 'white' }}
                >

                    {this._renderFilterClimate()}
                    {this._renderFilterTerrain()}
                    {this._renderFilterSort()}


                </ScrollView>
                {this._renderButton()}
            </View>
        )
    }
}
const mapStatetoProps = (state) => {
    return {}
}
const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);
export default connect(mapStatetoProps, mapDispatchToProps)(FilterScreen)

const styles = StyleSheet.create({
    shadowContainer: {

        borderRadius: 5,
        borderWidth: 2,
        marginVertical: responsiveHeight(1),
        marginHorizontal: responsiveWidth(2)
    },

    allButtonContainer: {
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginVertical: responsiveHeight(2)
    },
    buttonContainer: {
        height: responsiveHeight(6), width: responsiveWidth(25), borderRadius: 8, backgroundColor: '#3D2E89', alignItems: 'center', justifyContent: 'center'
    },
    buttonText: {
        fontSize: responsiveFonts(15), fontWeight: "500", color: 'white'
    },
    sortingContainer: {
        justifyContent: 'space-around', flexDirection: 'row', marginVertical: responsiveHeight(3)
    },
    renderItemContainer: {
        flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: responsiveWidth(3), marginVertical: responsiveHeight(1)
    },
    renderItemText: {
        fontSize: responsiveFonts(15), fontWeight: "500", color: 'black'
    },
    renderSelectContainer: {
        width: responsiveWidth(5), aspectRatio: 1, borderRadius: responsiveWidth(2.5), borderWidth: 1, padding: 3
    },
    selectContainer: {
        flex: 1, backgroundColor: 'gray', borderRadius: responsiveWidth(2.5)
    },
    renderHeaderContainer: {
        flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: responsiveWidth(3), marginVertical: responsiveHeight(1)
    },
    renderHeaderText: {
        fontSize: 20, fontWeight: "bold", color: 'black'
    },
    renderIconContainer: (flag) => {
        return {
            width: responsiveWidth(6), aspectRatio: 1, transform: [{ rotate: flag ? '180deg' : '0deg' }]
        }
    },
})