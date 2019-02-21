import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from "react-native";
import { Card, CardItem, Body, Left, Badge, Button } from 'native-base';
import VideoPlayer from 'react-native-video-controls';

import _ from 'lodash';

class VideoCardComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			card: this.props.card
		};
	}

	render() {
		const { card } = this.state;
		return (
			<View>
				{card.attachments.map(attachment => (
					<Card key = {attachment.id} >
						<CardItem>
							<Left>
								<Body style={{ flexDirection: 'row' }}>
								{card.labels.map(label => (
									<Badge
									key={ label.id }
									style={{ backgroundColor: label.color || 'grey' }}
									><Text>{label.name}</Text></Badge>
								))}
								</Body>
							</Left>
						</CardItem>
						<CardItem cardBody>
							{/* <TouchableOpacity
									onPress = {() => this.setState({playVideoID: attachment.id})}
							> */}
								<VideoPlayer
									source = {{uri: attachment.url}}
									repeat = { true }
									paused = { attachment.id != this.state.playVideoID }
									style={{ height: 260, width: null }} 
									onError = {(err)=>{console.log(err,'error')}}
									onEnd = {() => this.setState({playVideoID: '0'})}
									disableBack = { true }
									disableFullscreen = {true}
								/>
						{/* </TouchableOpacity> */}
						</CardItem>
						<CardItem>
							<Button success onPress = {() => this.props.navigation.navigate('ManageVideoScreen', {
								card: card, attachment: attachment
							})} >
								<Text>{ attachment.name }</Text>
							</Button>
						</CardItem>
					</Card>
				))}  
			</View>
		);
	}
}

VideoCardComponent.propTypes = {
	card: PropTypes.object.isRequired,
	navigation: PropTypes.object.isRequired
};
export default VideoCardComponent;
