import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from "react-native";
import { Card, CardItem, Body, Left, Badge, Button, Item } from 'native-base';
import VideoPlayer from 'react-native-video-controls';

import {updateCard} from '../trello'
import {WATCHED_LIST_ID} from '../../constants/trello_insta'

import _ from 'lodash';

class VideoCardComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			card: this.props.card
		};
	}

	upDateVideo = (attachment) => {
    this.state.card.attachments.forEach((Item) => {if(Item.id == attachment.id) Item.url = attachment.url;})
    this.forceUpdate();
	}

	render() {
    const { card } = this.state;
    const { watched, watchedCard } = this.props;
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
						<CardItem style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text>{ attachment.name }</Text>
							<Button 
								success
								style = {{paddingLeft:15, paddingRight: 15, borderRadius: 5}}
								onPress = {() => this.props.navigation.navigate('ManageVideoScreen', {
								  idCard: card.id, attachment: attachment, upDateVideo: this.upDateVideo
							})} >
								<Text>{ "Edit" }</Text>
							</Button>
								{!watched &&<Button 
									success 
									style = {{paddingLeft:15, paddingRight: 15, borderRadius: 5}}
									onPress = {() => {
									card.idList = WATCHED_LIST_ID;
									updateCard(card);
									watchedCard(card.id);
								}} >
								<Text>{ "watched" }</Text>
							</Button>}
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
