import React from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//https://www.google.com/search?sxsrf=ALiCzsZ5Y_3Zn0mXy6qtv7s5vR8bmAPqDw:1667310815809&q=planets+screen+design+in+mobile&tbm=isch&chips=q:planets+screen+design+in+mobile,online_chips:space+app:gSqfMftR2DU%3D&usg=AI4_-kTk8LmBEwxqOvXYxqanEH7077heWQ&sa=X&ved=2ahUKEwjB65_nkI37AhUWSGwGHZWvCNAQgIoDKAJ6BAgREBk&biw=1536&bih=758&dpr=1.25#imgrc=BWdYPPQY2NFwkM

import { actionCreators } from '@actions'
import Planets from '../../constants/planets_ui.json'
import { Images } from "../../assets";
import { responsiveFonts, responsiveHeight, responsiveWidth } from "../../helpers/scaling";
class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            searchData: '',
            dataList: Planets.results.slice(0, 10),
            mainData: Planets.results,
            climateList: [],
            terrainList: [],
            currentPage: 1,
            lastPage: parseInt(Planets.results.length / 10)
        }
    }


    componentDidMount() {
        this.props.navigation.setOptions({
            headerShown: true,

            headerRight: () => (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('FilterScreen')} style={{ flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(0), borderRadius: 20, paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveHeight(1) }}>
                    <Image style={{ width: responsiveWidth(5), height: responsiveHeight(5), marginLeft: responsiveWidth(2), }} resizeMode='contain' source={Images.icnFilter} />
                </TouchableOpacity>
            ),
            title: "Planets",
            headerBackVisible: false,
            headerShadowVisible: false
        })
        console.log("size :", this.state.dataList);
        this.props.navigation.addListener('focus', () => {
            this.filterData()
        })
        this.filterData()

    }

    filterData() {
        if (this.props.filterData.length > 0) {
            var climateFilter = this.props.filterData[this.props.filterData.findIndex(i => i.name == 'climate')].list
            var terrainFilter = this.props.filterData[this.props.filterData.findIndex(i => i.name == 'terrain')].list
            var sortingFilter = this.props.filterData[this.props.filterData.findIndex(i => i.name == 'sorting')].list
            var planetsData = [...Planets.results];
            var newArray = [...planetsData];
            if (climateFilter.length > 0 || terrainFilter.length > 0) {
                newArray = planetsData.filter(item => {
                    var splitData = [];
                    var splitData1 = []
                    if (climateFilter.length > 0) {
                        splitData = item.climate.split(',').filter(f => f.trim() == climateFilter[0].name.trim())
                    }
                    if (terrainFilter.length > 0) {
                        splitData1 = item.terrain.split(',').filter(f => f.trim() == terrainFilter[0].name.trim())
                    }

                    if ((climateFilter.length > 0 && splitData.length > 0) || (terrainFilter.length > 0 && splitData1.length > 0)) {

                        return item
                    }
                })
            }

            if (sortingFilter.length > 0) {
                if (sortingFilter[0].name == 'Name') {
                    if (this.props.filterData[2].sorting_order == 'asc') {
                        newArray.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                    } else {
                        newArray.sort((a, b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0))
                    }
                } else if (sortingFilter[0].name == 'Population') {
                    if (this.props.filterData[2].sorting_order == 'asc') {
                        newArray.sort((a, b) => (a.population > b.population) ? 1 : ((b.population > a.population) ? -1 : 0))
                    } else {
                        newArray.sort((a, b) => (a.population < b.population) ? 1 : ((b.population < a.population) ? -1 : 0))
                    }
                } else if (sortingFilter[0].name == 'Residents') {
                    if (this.props.filterData[2].sorting_order == 'asc') {
                        newArray.sort((a, b) => (a.residents.length > b.residents.length) ? 1 : ((b.residents.length > a.residents.length) ? -1 : 0))
                    } else {
                        newArray.sort((a, b) => (a.residents.length < b.residents.length) ? 1 : ((b.residents.length < a.residents.length) ? -1 : 0))
                    }
                }


            }

            this.setState({ dataList: [...newArray], mainData: [...newArray] })


        }
    }


    loadMoreResults = () => {

        if (this.state.currentPage < this.state.lastPage && this.state.mainData.length > this.state.currentPage * 10) {
            var currentPage = this.state.currentPage;
            // currentPage=currentPage+1;
            var data = this.state.mainData.slice((currentPage * 10), ((currentPage + 1) * 10))
            this.setState({
                currentPage: currentPage + 1,
                dataList: this.state.dataList.concat(data)

            })
        }
    }

    onChangeText(text) {
        var planetsData = this.state.mainData;
        var newArray = planetsData.filter(item => {
            return item.name.toLowerCase().search(text.toLowerCase()) > -1;
        })
        this.setState({ searchData: text, dataList: newArray })
    }

    _renderItem = ({ item }) => (
        <View style={styles.renderContainer}>

            <Text style={styles.renderItemText}>{item.name}</Text>

            <Text>Terrain : {item.terrain}</Text>
            <Text>Climate : {item.climate}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Population :{item.population}</Text>
                <Text>Residents :{item.residents.length}</Text>
            </View>
        </View>
    )

    _renderSearch = () => (
        <TextInput
            value={this.state.searchData}
            onChangeText={text => this.onChangeText(text)}
            placeholder={"Search Name"}
            style={styles.searchContainer}
        />
    )


    render() {
        return (
            <View style={{ flex: 1 }}>
                {this._renderSearch()}
                <FlatList
                    data={this.state.dataList}
                    renderItem={this._renderItem}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => this.loadMoreResults()}
                    onEndReachedThreshold={0.1}
                />
            </View>
        )
    }
}
const mapStatetoProps = (state) => {
    return {
        filterData: state.redState.filterData
    }
}
const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);
export default connect(mapStatetoProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
    searchContainer: {
        borderWidth: 1, marginHorizontal: responsiveWidth(2), borderRadius: responsiveWidth(2)
    },
    renderContainer: {
        borderWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginHorizontal: responsiveWidth(2),
        borderRadius: responsiveWidth(5),
        marginVertical: responsiveHeight(1)
    },
    renderItemText: {
        fontSize: responsiveFonts(15), fontWeight: "700", color: 'black'
    }
})