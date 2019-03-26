import React from 'react'
import PropTypes from 'prop-types'
import MessageWebView from './MessageWebView'
import { View } from 'react-native'

const youtubeHTML = ({ id, autoplay, width, height, options: { playsinline, showinfo, modestbranding, controls } }) => `
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            html, body {
                margin: 0;
                background: black;
            }
        </style>
    </head>
    <body>
        <div id="player"></div>
        <script>
        // load iframe player api code asynchronously
        // see docs https://developers.google.com/youtube/iframe_api_reference
        var tag = document.createElement('script')
        tag.src = "https://www.youtube.com/iframe_api"
        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        // create youtube iframe when api is ready
        var player;
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                height: '${height}',
                width: '${width}',
                playerVars: {
                    // see docs https://developers.google.com/youtube/player_parameters
                    rel: false,
                    playsinline: Number(${playsinline}),
                    frameborder: 0,
                    showinfo: Number(${showinfo}),
                    modestbranding: Number(${modestbranding}),
                    controls: Number(${controls}),
                    color: 'white'
                },
                videoId: '${id}',
                events: {
                    ${autoplay ? 'onReady: onPlayerReady,' : ''}
                    onStateChange: onPlayerStateChange
                }
            })
            function onPlayerReady(event) {
                event.target.playVideo()
                window.postMessage(JSON.stringify({
                    type: 'PLAYING',
                    duration: player.getDuration()
                }))
            }
            function onPlayerStateChange(event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    window.postMessage(JSON.stringify({
                        type: 'PLAYING',
                        payload: {
                            duration: player.getDuration()
                        }
                    }))
                }
                if (event.data === YT.PlayerState.ENDED) {
                    window.postMessage(JSON.stringify({
                        type: 'ENDED'
                    }))
                }
                if (event.data === YT.PlayerState.PAUSED) {
                    window.postMessage(JSON.stringify({
                        type: 'PAUSED',
                        payload: {
                            duration: player.getDuration(),
                            elapsed: player.getCurrentTime()
                        }
                    }))
                }
            }
            // handle messages from react native
            document.addEventListener("message", function(event) {
                const action = JSON.parse(event.data)
                switch (action.type) {
                    case 'SET_SIZE':
                        player.setSize(action.payload.width, action.payload.height)
                        break
                }
            }, false)
        }
        </script>
    </body>
    </html>
`

export default class YouTube extends React.Component {
    constructor(props) {
        super(props)
        this.state = { playback: null }
        this.onLayout = this.onLayout.bind(this)
        this.startedPlaying = this.startedPlaying.bind(this)
        this.stoppedPlaying = this.stoppedPlaying.bind(this)
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
    }
    onLayout({ width }) {
        const height = width / this.props.aspectRatio
        this.width = width
        this.height = height
        this.WebView.postMessage({
            type: 'SET_SIZE',
            payload: { width, height },
        })
    }
    startedPlaying({ duration }) {
    }
    stoppedPlaying({ elapsed }) {
    }
    render() {
        const { id, autoplay, onDonePlaying, youtubeOptions, style } = this.props
        return (
            <View style={{ flex: 1, ...style }} onLayout={e => this.onLayout(e.nativeEvent.layout)}>
                <MessageWebView
                    ref={x => (this.WebView = x)}
                    html={youtubeHTML({
                        id,
                        autoplay,
                        width: '100%',
                        height: '100%',
                        options: youtubeOptions,
                    })}
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    scrollEnabled={false}
                    onMessage={action => {
                        console.log(action)
                        switch (action.type) {
                            case 'PLAYING':
                                this.startedPlaying(action.payload)
                                break
                            case 'ENDED':
                            case 'PAUSED':
                                this.stoppedPlaying(action.payload)
                                break
                        }
                    }}
                />
            </View>
        )
    }
}

YouTube.propTypes = {
    id: PropTypes.string.isRequired,
}

YouTube.defaultProps = {
    aspectRatio: 16 / 9,
    autoplay: false,
    youtubeOptions: {
        playsinline: true,
        showinfo: false,
        modestbranding: true,
        controls: true,
    },
}
