import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from "react-native";
import { Container, Content, Form, Item, Label, Button } from "native-base";

import { VideoPlayer as VideoClip } from 'react-native-video-processing';
import VideoPlayer from 'react-native-video-controls';
import RNVideoEditor from 'react-native-video-editor';
import RNFetchBlob from 'react-native-fetch-blob';
import Popover from 'react-native-popover-view';

// import TrimVideoView from './TrimVideoView';
import { addAttachment, deleteAttachment } from '../trello';

class StackedManageTrelloVideoCard extends Component {
	static navigationOptions = {
		title: 'Manage Trello Video Card'
	};

	constructor(props) {
		super(props);
		this.state = {
			playVideo: true,
			startTime: 0,
			endTime: 0,
			trimVideoPath: null,
			isPopoverVisible: true,
			videoPath: '',
		};
    this.currentTime = 0;
    this.clipUrls = [];
	}

	componentDidMount() {
		RNFetchBlob
			.config({
			  fileCache : true,
			})
			.fetch('GET', this.props.navigation.state.params.attachment.url)
			.then((res) => {
			  this.setState({videoPath: 'file://' + res.path(), isPopoverVisible: false});
			})
			.catch((errorMessage, statusCode) => {
				console.log(errorMessage, statusCode);
				this.setState({isPopoverVisible: false});
			})
  }
  
	videoClipping = () => {
		const startTime = this.currentTime > 15 ? this.currentTime - 15 : 0;
		const endTime = this.currentTime;
    if(endTime > startTime){
      console.log(startTime, endTime);   
      this.videoPlayerRef.trim({
				startTime: startTime,
				endTime: endTime
			})
			.then((newSource) => {
				console.log(newSource,'trimVideoPath')
				this.clipUrls.push('file://' + newSource)    
			})
			.catch(console.warn);
    }
  }
  
  upDate = () => {
		console.log(this.clipUrls, 'clipUrls');
		const params = this.props.navigation.state.params;
		const attachment = params.attachment;
		const idCard = params.idCard;
		const upDateVideo = params.upDateVideo;
		const goBack = this.props.navigation.goBack;

		this.setState({isPopoverVisible: true});
		
    RNVideoEditor.merge(
      this.clipUrls,
      (results) => {
        alert('Error: ' + results);
      },
      (results, file) => {
				attachment.url = "file://" + file;
				addAttachment(idCard, attachment);
				// deleteAttachment(idCard, attachment.id);
				upDateVideo(attachment);
				this.setState({isPopoverVisible: false});
				goBack();
      }
    );
  }

	render() {
		const { navigation } = this.props;
		const attachment = navigation.state.params.attachment;
		const {videoPath, isPopoverVisible} = this.state;
		return (
			<Container>
				<Content padder>
					<Form>
						<Item stackedLabel>
							<Label>{attachment.name}</Label>
						</Item>
						<VideoPlayer
							source = {{uri: videoPath}}
							repeat = { true }
							paused = { false }
							style={{ height: 260, width: null }}
							onProgress = {({currentTime}) => this.currentTime = Math.floor(currentTime)}
							disableBack = { true }
							disableFullscreen = {true}
						/>
						<VideoClip
							ref={(ref) => {
								this.videoPlayerRef = ref
							}}
							startTime={0}  // seconds
							endTime={0}   // seconds
							play={false}
							replay={false}
							height={0}
							width={400}
							source={videoPath}
							resizeMode={VideoClip.Constants.resizeMode.CONTAIN}
						/>
						<TouchableOpacity 
              style={{
                top: 10,
                width: 150,
								height: 50,
								alignSelf: 'center',
                justifyContent:'center',
                alignItems:'center',
                borderRadius: 25,
                backgroundColor: 'green',
              }}
              onPress = {this.videoClipping}
            >
              <Text style={{ textAlign: 'center',fontWeight:'bold', fontSize: 20 }}>{'Clip'}</Text>
            </TouchableOpacity>
					</Form>
				</Content>
				<Button success block onPress={this.upDate}>
					<Text textAlign='center'> Update </Text>
				</Button>
        <Popover
          isVisible={isPopoverVisible}
          fromView={this.touchable}
          onClose={() => {}}>
            <View style={{width: 200, height: 80,justifyContent:'center', alignItems:'center'}}>
              <Text style={{ textAlign: 'center',fontWeight:'bold', fontSize: 20 }}>{'Please wait ... '}</Text>
            </View>
        </Popover>
			</Container>
		);
	}
}

StackedManageTrelloVideoCard.propTypes = {
		navigation: PropTypes.object.isRequired
};

export default StackedManageTrelloVideoCard;
