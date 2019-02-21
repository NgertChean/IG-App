import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Trimmer, ProcessingManager, VideoPlayer } from 'react-native-video-processing';
import RNFetchBlob from 'react-native-fetch-blob';
import Popover from 'react-native-popover-view';

class TrimVideoView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playVideo: true,
			startTime: 0,
			endTime: 0,
      trimVideoPath: null,
      isPopoverVisible: true,
      videoPath: null,
      frame: [],
		};
    this.checkFrames = this.checkFrames.bind(this);
	}

  componentDidMount() {
    RNFetchBlob
      .config({
        fileCache : true,
      })
      .fetch('GET', this.props.url)
      .then((res) => {
        this.setState({videoPath: 'file://' + res.path(), isPopoverVisible: false});
      })
      .catch((errorMessage, statusCode) => {
        console.log(statusCode);
      })
  }
  
  videoPlayTime(nativeEvent){
    // console.log(nativeEvent,'videoPlayTIme')
  }

  checkFrames(frame){
    console.log(frame);
    this.setState({frame})
  }

  trimVideo = async () => {
    const {frame, startTime, endTime} = this.state;
    if(endTime > startTime){
      console.log(startTime, endTime);
      // setTimeout( () => this.setState({isPopoverVisible: true}), 1);      
      this.videoPlayerRef.trim({
          startTime: startTime,
          endTime: endTime
        })
        .then((newSource) => {
          console.log(newSource,'trimVideoPath')
          this.setState({
            trimVideoPath: 'file://' + newSource,
            isPopoverVisible: false,
            playVideo: true,
            startTime: 0,
            endTime: 0
          });
        })
        .catch(console.warn);
    }
  }

	render() {
    const { isPopoverVisible, playVideo, videoPath, trimVideoPath, startTime, endTime } = this.state;
    if(!videoPath) return (
      <View>
       <Popover
          isVisible={isPopoverVisible}
          fromView={this.touchable}
          onClose={() => {}}>
            <View style={{width: 300, height: 120,justifyContent:'center', alignItems:'center'}}>
                <Text style={{ textAlign: 'center',fontWeight:'bold', fontSize: 20 }}>{'Please wait,\n your video is loading ... '}</Text>
            </View>
        </Popover>
      </View>
    );
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<VideoPlayer
					ref={(ref) => {
						this.videoPlayerRef = ref
          }}
          startTime={startTime}  // seconds
          endTime={endTime}   // seconds
					play={playVideo}
          replay={true}
          height={260}
					width={400}
          source={trimVideoPath ? trimVideoPath : videoPath}
          resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
					onChange={({ nativeEvent }) => this.videoPlayTime(nativeEvent)}
				/>
        <Trimmer
          checkFrames = {this.checkFrames}
          source={ videoPath }
          onChange={(e) => {
            if(e.startTime) this.setState({startTime: Math.round(e.startTime * 1000)});
            if(e.endTime) this.setState({endTime: Math.round(e.endTime * 1000)});
            this.setState({playVideo: false, trimVideoPath: null});
          }}
          themeColor={'white'} // iOS only
          thumbWidth={30} // iOS only
          trackerColor={'green'} // iOS only
        />
        <TouchableOpacity 
          style={{
            top: 10,
            width: 150,
            height: 50,
            justifyContent:'center',
            alignItems:'center',
            borderRadius: 25,
            backgroundColor: 'green',
          }}
          onPress = {this.trimVideo}
        >
          <Text style={{ textAlign: 'center',fontWeight:'bold', fontSize: 20 }}>{'Preview'}</Text>
        </TouchableOpacity>
        <Popover
          isVisible={isPopoverVisible}
          fromView={this.touchable}
          onClose={() => {}}>
            <View style={{width: 300, height: 120,justifyContent:'center', alignItems:'center'}}>
                <Text style={{ textAlign: 'center',fontWeight:'bold', fontSize: 20 }}>{'Please wait,\n your video is loading ... '}</Text>
            </View>
        </Popover>
			</View>
		);
	}
}

TrimVideoView.propTypes = {
		url: PropTypes.string
};

export default TrimVideoView;