import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Text } from "react-native";
import { Container, Content, Form, Item, Label, Button } from "native-base";

import TrimVideoView from './TrimVideoView';

class StackedManageTrelloVideoCard extends Component {
	static navigationOptions = {
		title: 'Manage Trello Video Card'
	};

	render() {
		const { navigation } = this.props;
		const attachment = navigation.state.params.attachment;
		return (
			<Container>
				<Content padder>
					<Form>
						<Item stackedLabel>
							<Label>{attachment.name}</Label>
						</Item>
						<TrimVideoView
								url = {attachment.url}
							/>
					</Form>
				</Content>
				<Button success block onPress={() => {}}>
					<Text textAlign='center'> Update </Text>
				</Button>
			</Container>
		);
	}
}

StackedManageTrelloVideoCard.propTypes = {
		navigation: PropTypes.object.isRequired
};

export default StackedManageTrelloVideoCard;
