import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
    Text,
    Image,
    TouchableHighlight,
    StyleSheet,
    Alert
} from "react-native";
import { Container, Content, Textarea, Form, Item, Label, Button, View, Icon } from "native-base";
import ImagePicker from 'react-native-image-picker';
import { fetchCard, createCard, updateCard, addAttachment } from './trello';
import { LIST_ID } from '../constants/trello_insta';
import runPromiseSerial from './promiseSerial';

class ManageCardView extends Component {
    state = {
        name: null,
        card: null,
        attachments: []
    }
    constructor(props) {
        super(props);
        this.handleAction = this.handleAction.bind(this);
        this.handlePressAddAttachment = this.handlePressAddAttachment.bind(this);
    }
    async componentDidMount() {
        const { cardId, instagramAttachment } = this.props;
        if (cardId) {
            const card = await fetchCard(cardId);
            this.setState({ name: card.name, card });
            if(instagramAttachment !== ''){
                this.setState({
                    attachments: [
                        { uri: instagramAttachment }, 
                        ...this.state.attachments                        
                    ]
                })
            }
        }
    }

    handlePressAddAttachment() {
        ImagePicker.showImagePicker({
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }, async (response) => {
            if (!response.didCancel && !response.error) {
                this.setState({
                    attachments: [
                        ...this.state.attachments,
                        { uri: response.uri }
                    ]
                })
            }
        });
    }

    async handleAction() {
        const { cardId, navigation } = this.props;
        const { name, attachments } = this.state;
        if (cardId) {
            await updateCard(cardId, { name });
            
            const promiseSerial = attachments.map(attachment => {
                return async () => {
                    await addAttachment(cardId, {
                        ...attachment,
                        name: `attachment_${Date.now()}`,
                        mimeType: 'image/jpeg'
                    });
                };
            });
            await runPromiseSerial(promiseSerial);

            navigation.navigate('HomeScreen');
        } else {
            await createCard({
                name,
                pos: 'top',
                idList: LIST_ID
            });

            navigation.navigate('HomeScreen');
        }
    }

    render() {
        const { cardId } = this.props;
        const { name, card, attachments } = this.state;

        return (
            <Container>
                <Content padder>
                    <Form>
                        <Item stackedLabel>
                            <Label>Card name</Label>
                            <Textarea
                                rowSpan={5}
                                bordered
                                placeholder="Enter card name here" style={styles.cardName}
                                value={name}
                                onChangeText={name => this.setState({ name })}
                            />
                        </Item>
                        {cardId && (
                            <Item stackedLabel>
                                <Label>Attachments</Label>
                                {card && card.attachments.map(attachment => (
                                    <Image
                                        key={attachment.id}
                                        source={{ uri: attachment.url }}
                                        style={{ height: 200, width: '100%', marginTop: 8 }}
                                    />
                                ))}
                                {attachments && attachments.map((attachment, i) => (
                                    <Image
                                        key={i}
                                        source={{ uri: attachment.uri }}
                                        style={{ height: 200, width: '100%', marginTop: 8 }}
                                    />
                                ))}
                                <Button iconLeft transparent onPress={this.handlePressAddAttachment}>
                                    <Icon name="ios-add" />
                                    <Text>Add attachment</Text>
                                </Button>
                            </Item>
                        )}
                    </Form>
                </Content>
                <Button success block onPress={this.handleAction}>
                    <Text textAlign='center'>
                        {cardId ? 'Update' : 'Create'}
                    </Text>
                </Button>
            </Container>
        );
    }
}

ManageCardView.propTypes = {
    instagramAttachment: PropTypes.string,
    cardId: PropTypes.string,
    navigation: PropTypes.object.isRequired
};

export default ManageCardView;

const styles = StyleSheet.create({
    cardName: {
        width: '100%'
    }
});
