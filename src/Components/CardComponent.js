import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableHighlight, Animated } from 'react-native';
import { Card, CardItem, Body, Left, Badge } from 'native-base';

class CardComponent extends Component {

  normalCard(){
    return (
      <TouchableHighlight onPress = { this.props.onPress }>
        <Card>
          <CardItem>
            <Left>
              <Body>
                {this.props.card.labels.map(label => (
                  <Badge
                    key={ label.id }
                    style={{ backgroundColor: label.color || 'grey' }}
                  ><Text>{label.name}</Text></Badge>
                ))}
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            {this.props.card.attachments.length > 0 && (
              <Image
                source={{ uri: this.props.card.attachments[0].url }}
                style={{ height: 200, width: null, flex: 1 }}
              />
            )}
          </CardItem>

          <CardItem style={{ height: 20 }}>
            <Text />
          </CardItem>
          <CardItem>
            <Body>
              <Text>{ this.props.card.name }</Text>
            </Body>
          </CardItem>
        </Card>
      </TouchableHighlight>
    );
  }

  // just have image and label, no discription
  smallCard(){
    return (
      <TouchableHighlight onPress = { this.props.onPress }>
        <Card>
          <CardItem cardBody>
            {
              (this.props.card.attachments.length > 0) ? (
                <ImageBackground
                  source={{ uri: this.props.card.attachments[0].url }}
                  style={{ flex: 1, width: null, height: 100 }}
                >
                  <Body>
                  {this.props.card.labels.map(label => (
                    <Badge
                      key={ label.id }
                      style={{ backgroundColor: label.color || 'grey' }}
                    >
                      <Text>{label.name}</Text>
                    </Badge>
                  ))}
                  </Body>
                </ImageBackground>
              ):(
                <ImageBackground
                  source={require('../assets/images/noattach.png')}
                  style={{ flex: 1, width: null, height: 100 }}
                >
                  <Body>
                  {this.props.card.labels.map(label => (
                    <Badge
                      key={ label.id }
                      style={{ backgroundColor: label.color || 'grey' }}
                    >
                      <Text>{label.name}</Text>
                  </Badge>
                  ))}
                  </Body>
                </ImageBackground>
              )
            }
          </CardItem>
        </Card>
      </TouchableHighlight>
    );
  }
  render() {
    return this.props.isNormal ? this.normalCard() : this.smallCard();
  }
}

CardComponent.propTypes = {
  isNormal:  PropTypes.bool.isRequired,
  card:      PropTypes.object.isRequired,
  onPress:   PropTypes.func.isRequired
};

export default CardComponent;