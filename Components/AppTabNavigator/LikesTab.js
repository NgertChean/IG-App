import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, ImageBackground, Image, TouchableHighlight } from "react-native";
import GridView from 'react-native-super-grid';
import { Container, Content, Icon, Header, Item, Input, Button, Badge} from 'native-base';
import CardComponent from '../CardComponent';
import { fetchCards } from '../trello';
import _ from 'lodash';

class LikesTab extends Component {
    state = {
        cards: [],
        filteredCards: [],
        changedLabel: '',
        allLabels: []
    };

    static navigationOptions = {
      tabBarIcon:  ({ tintColor })=>(
        <Icon name="ios-heart" style={{ color:
        tintColor }} />
      )
    }

    constructor(props) {
        super(props);        
    }

    async componentDidMount() {
        const cards = await fetchCards();
        this.setState({ cards, filteredCards: cards });
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
                    style = {{marginTop: 25}}
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
                    <View style={{width:100, height:120}}>
                      <ImageBackground                            
                        source={require('../../assets/images/border.png')}
                        style={{ flex: 1, width: 100, height: 100}}
                      >
                        <Text
                          style={{textAlign: 'center', fontWeight: 'bold', marginTop: 30, color: 'white', width: 100, height: 100}} 
                          onPress={() => {this.onPressScrollView(label)}}>
                            {label}
                        </Text>
                      </ImageBackground>
                    </View>
                  ))  
                }                  
                </ScrollView>

                <ScrollView
                    showsHorizontalScrollIndicator = { false }
                    showsVerticalScrollIndicator = { true }
                >                
                {
                    this.state.filteredCards.map(card => (
                        card.attachments.map(attachment => (
                          <View>
                            <Image
                                source={{uri: attachment.url}}
                                style={{ height: 200, width: 375 }} 
                            />
                            <View style={{height: 2}}>
                            </View>
                          </View>
                        ))                        
                    ))
                }
                </ScrollView>   
            </Container>
        );
    }
}

LikesTab.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default LikesTab;
