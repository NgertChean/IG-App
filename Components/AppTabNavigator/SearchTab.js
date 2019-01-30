import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, Alert, ImageBackground, Image} from "react-native";
import GridView from 'react-native-super-grid';
import { Container, Icon, Left, Right, Header, Card, CardItem, Body} from 'native-base';
import CardComponent from '../CardComponent';
import { fetchMedias } from '../instagram';
import _ from 'lodash';

class SearchTab extends Component {
    state = {
        medias: []
    };

    static navigationOptions = {
      tabBarIcon:  ({ tintColor })=>(
        <Icon name="ios-search" style={{ color:
        tintColor }} />
      )
    }

    constructor(props) {
        super(props);        
    }

    async componentDidMount() {
        const medias = await fetchMedias();
        this.setState({ medias: medias.data });
    }

    addToTrello(attachment){
      this.props.navigation.navigate('HomeScreen', {
          instagramAttachment: attachment
        }
      )
    }

    render() {
        return (
          <Container style={styles.container}>
            <GridView
              items={this.state.medias}
              itemDimension={100}
              spacing={5}
              style={styles.gridView}
              renderItem={item => (
                <TouchableHighlight 
                  onPress={() =>
                    Alert.alert(
                      'Hey!!!',
                      'Add to Trello?',
                      [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'OK', onPress: () => this.addToTrello(item.images.thumbnail.url)},
                      ],
                      { cancelable: false })
                  }
                >  
                  <ImageBackground                            
                    source={{uri: item.images.thumbnail.url}}
                    style={{ height: 100}}                    
                  >
                    <View style={{marginTop: 35}}>                        
                      <Text style={{textAlign: 'center'}}>
                        <Icon name='ios-heart' style={styles.iconText}/>
                        <Text style={styles.iconText}>{' ' + item.likes.count}</Text>
                        <Text>{'    '}</Text>
                        <Icon name='ios-chatbubbles' style={styles.iconText}/>
                        <Text style={styles.iconText}>{' ' +   item.comments.count}</Text>
                      </Text>                       
                    </View>
                  </ImageBackground>
                </TouchableHighlight>
              )}              
            />            
          </Container>
        );
    }
}

SearchTab.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default SearchTab;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    gridView: {
        flex: 1
    },
    iconText: {
        fontWeight: 'bold', 
        fontSize: 20, 
        color: 'white',
        marginTop: 30
    }
});