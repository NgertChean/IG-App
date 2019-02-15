import React, { Component } from "react";
import PropTypes from 'prop-types';
import ManageCardView from './ManageCardView';
import {Alert} from 'react-native'

class StackedManageTrelloCard extends Component {
    static navigationOptions = {
        title: 'Manage Trello Card'
    };

    render() {
        const { navigation } = this.props;
        return (
            <ManageCardView
                cardId={navigation.state.params.cardId}
                instagramAttachment={navigation.state.params.instagramAttachment}
                navigation={navigation}
            />
        );
    }
}

StackedManageTrelloCard.propTypes = {
    navigation: PropTypes.object.isRequired
};

export default StackedManageTrelloCard;
