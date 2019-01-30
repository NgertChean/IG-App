import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, ImageBackground, TouchableHighlight } from "react-native";
import GridView from 'react-native-super-grid';
import { Container, Content, Icon, Header, Item, Input, Button, Badge} from 'native-base';
import CardComponent from '../CardComponent';
import { fetchCards } from '../trello';
import _ from 'lodash';

class HomeTab extends Component {
    state = {
        cards: [],
        filteredCards: [],
        changedLabel: '',
        isNormal: true,
        allLabels: [],
        instagramAttachment: ''
    };

    static navigationOptions = {
      header: null
    };

    constructor(props) {
        super(props);        
        this.handleLabelChange = this.handleLabelChange.bind(this);        
    }

    async componentDidMount() {
        const { navigation } = this.props;
        if (navigation.state.params) {
          this.setState({instagramAttachment: navigation.state.params.instagramAttachment})
        }
        const cards = await fetchCards();
        this.setState({ cards, filteredCards: cards });
        this.findAllPossibleLabels();  
    }

    handleLabelChange(changedLabel) {
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

    dispNormal(){
      return this.state.filteredCards.map(card => (
        <CardComponent key={card.id} isNormal={true} card={card} onPress={() => {
            this.props.navigation.navigate('ManageCardScreen', {
              cardId: card.id,
              instagramAttachment: this.state.instagramAttachment
            });
          }} />
        ));
    }

    dispCollection(){
      const window = Dimensions.get('window');
      return (
        <GridView
          items={this.state.filteredCards}
          itemDimension={100}
          spacing={2}
          style={styles.gridView}
          renderItem={item => (
            <CardComponent key={item.id} isNormal={false} card={item} onPress={() => {
              this.props.navigation.navigate('ManageCardScreen', {
              cardId: item.id,
              instagramAttachment: this.state.instagramAttachment
              });
            }} />
          )}
        />
      );
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
      var retVal = false
      arry.map(arry_ele =>(
        (arry_ele === ele) ? retVal = true : null
      ))

      return retVal
    }

    render() {
        const { changedLabel } = this.state;
        return (
            <Container>
              <Header searchBar rounded>
                <Item>
                  <Icon name="ios-search" />
                  <Input
                    placeholder="Search"
                    value={changedLabel}
                    onChangeText={this.handleLabelChange}
                  /> 
                  {this.state.isNormal ? (
                    <Button style={{marginLeft: 10, hight: 50}} small bordered onPress={()=>{  
                      this.setState({isNormal: !this.state.isNormal});}}>
                      <Icon name='keypad' />
                    </Button>
                  ):(
                    <Button style={{marginLeft: 10, hight: 50}} small bordered onPress={()=>{this.setState({isNormal: !this.state.isNormal});}}>
                      <Icon name='film' />
                    </Button>
                  )}    
                </Item>      
              </Header>

              <ScrollView
                horizontal={ true }
                style = { styles.labelSwiper }
                showsHorizontalScrollIndicator = { true }
                showsVerticalScrollIndicator = { false }
              >
                <TouchableHighlight onPress={() => {this.onPressScrollView('')}} style={{width:100, height:100}}>
                  <ImageBackground                            
                    source={require('../../assets/images/border.png')}
                    style={{ flex: 1, width: 100, height: 100 }}
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
                    <View style={{width:100, height:100}}>
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

              <Content>
                {this.state.isNormal ?  this.dispNormal() : this.dispCollection()}
              </Content>
            </Container>
        );
    }
}

HomeTab.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default HomeTab;

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
