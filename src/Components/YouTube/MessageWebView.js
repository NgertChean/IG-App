import React from 'react'
import { WebView } from 'react-native'

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode = `(${String(function() {
    var originalPostMessage = window.postMessage
    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer)
    }
    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    }
    window.postMessage = patchedPostMessage
})})();`

export default class MessageWebView extends React.Component {
    constructor(props) {
        super(props)
        this.postMessage = this.postMessage.bind(this)
    }
    postMessage(action) {
        this.WebView.postMessage(JSON.stringify(action))
    }
    render() {
        const { html, source, url, onMessage, ...props } = this.props
        return (
            <WebView
                {...props}
                injectedJavaScript={patchPostMessageJsCode}
                source={source ? source : html ? { html } : url}
                ref={x => {
                    this.WebView = x
                }}
                javaScriptEnabled
                onMessage={e => onMessage(JSON.parse(e.nativeEvent.data))}
            />
        )
    }
}
