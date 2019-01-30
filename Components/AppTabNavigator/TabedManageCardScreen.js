import React, { Component } from "react";
import PropTypes from 'prop-types';
import ManageCardView from '../ManageCardView';
import { Icon } from 'native-base'

class AddMediaTab extends Component {

    static navigationOptions = {

      tabBarIcon:  ({tintColor})=>(
        <Icon name="ios-add-circle" style={{ color:
        tintColor }} />
      )
    }

    render() {
        const { navigation } = this.props;
        return (
            <ManageCardView navigation={navigation} />
        );
    }
}

AddMediaTab.propTypes = {
    navigation: PropTypes.object.isRequired
};

export default AddMediaTab;
