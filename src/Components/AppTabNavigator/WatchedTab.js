import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, ImageBackground, Image, TouchableHighlight, TouchableOpacity } from "react-native";
import GridView from 'react-native-super-grid';
import { Container, Content } from 'native-base';
import { EventRegister } from 'react-native-event-listeners';

import { fetchCards } from '../trello';
import { WATCHED_LIST_ID as LIST_ID } from '../../constants/trello_insta';
import VideoCardComponent from '../VideoComponents/VideoCardComponent'

import _ from 'lodash';

class WatchedTab extends Component {
    state = {
        cards: [],
        filteredCards: [],
        changedLabel: '',
        allLabels: [],
        playVideoID: '0'
    };

    static navigationOptions = {
      header: null
    };

    constructor(props) {
        super(props);
        this.EventRegister_Update= EventRegister.addEventListener('UploadWatch', () => {
          this.componentDidMount();
        })  
    }

    async componentDidMount() {
        const cards = await fetchCards();
        const videos = _.filter(cards, card => card.idList == LIST_ID);
        console.log(videos);
        this.setState({ cards: videos, filteredCards: videos });
        this.findAllPossibleLabels();
    }

    findAllPossibleLabels(){
      const {cards} = this.state;      
      var allLabels = [];

      cards.map(card => (
        card.labels.map(label=>(
            this.isExist(allLabels, label.name) ?  null : allLabels.push(label.name)
          )
        )
      ))
      this.setState({allLabels});
    }

    isExist(arry, ele){
      var retVal = false;
      for (var i = 0; i < arry.length; i++) {
        (arry[i] === ele) ? retVal = true : null;
      }
      return retVal
    }   

    onPressScrollView(changedLabel){
      const { cards } = this.state;
        this.setState({
          changedLabel,
          filteredCards: _.filter(cards, card => {
            const isTagFiltered = _.some(
              card.labels,
              label =>
                label.name.toLowerCase().indexOf(changedLabel.toLowerCase()) >= 0
            );
            if (isTagFiltered) return true;
            return card.name.toLowerCase().indexOf(changedLabel.toLowerCase()) >= 0;
          })
        });
    } 

    render() {
        const { changedLabel } = this.state;
        return (
            <Container>
                <ScrollView
                  horizontal={ true }
                  style = { styles.labelSwiper }
                  showsHorizontalScrollIndicator = { true }
                  showsVerticalScrollIndicator = { false }
                >  
                  <TouchableHighlight onPress={() => {this.onPressScrollView('')}} style={{width:100, height:100}}>
                    <ImageBackground                            
                      source={require('../../assets/images/border.png')}
                      style={{ flex: 1, width: 100, height: 100}}
                    >
                      <Text
                        style={{textAlign: 'center', fontWeight: 'bold', marginTop: 30, color: 'white', width: 100, height: 100, fontSize: 20}} 
                      >
                        All
                      </Text>
                    </ImageBackground>
                  </TouchableHighlight> 

                  {
                    this.state.allLabels.map(label => (
                      <View key = {label} style={{width:100, height:120}}>
                        <ImageBackground                            
                          source={require('../../assets/images/border.png')}
                          style={{ flex: 1, width: 100, height: 100}}
                        >
                          <Text
                            style={{textAlign: 'center', fontWeight: 'bold', marginTop: 30, color: 'white', width: 100, height: 100, fontSize: 20}} 
                            onPress={() => {this.onPressScrollView(label)}}>
                              {label}
                          </Text>
                        </ImageBackground>
                      </View>
                    ))  
                  }                  
                </ScrollView>
                <Content>
                {
                  this.state.filteredCards.map(card => (
                    <VideoCardComponent key = {card.id} watched = {true} card = {card} navigation = {this.props.navigation}/>                       
                  ))
                }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({    
  labelSwiper: {
      backgroundColor: 'white',
      height: 100,
      maxHeight: 100
  },
  gridView: {
      borderRadius: 10,
      paddingTop: 0,
      flex: 1,
      borderColor: 'black'
  }
});

WatchedTab.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default WatchedTab;
