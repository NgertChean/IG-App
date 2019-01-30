import firebaseApp from './firebase';
import queryString from 'query-string';
import { BOARD_ID, API_KEY, API_TOKEN } from '../constants/trello_insta';

export const fetchCards = async () => {
    const response = await fetch(
        `https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${API_KEY}&token=${API_TOKEN}&attachments=true`
    );
    const cards = await response.json();
    return cards;
};

export const fetchCard = async (cardId) => {
    const response = await fetch(
        `https://api.trello.com/1/boards/${BOARD_ID}/cards/${cardId}?key=${API_KEY}&token=${API_TOKEN}&attachments=true`
    );
    const card = await response.json();
    return card;
};

export const updateCard = async (cardId, card) => {
    const baseUrl = `https://api.trello.com/1/cards/${cardId}`;
    const query = {
        key: API_KEY,
        token: API_TOKEN,
        ...card
    };
    await fetch(`${baseUrl}?${queryString.stringify(query)}`, { method: 'put' });
};

export const createCard = async (card) => {
    const baseUrl = 'https://api.trello.com/1/cards';
    const query = {
        key: API_KEY,
        token: API_TOKEN,
        ...card
    };
    await fetch(`${baseUrl}?${queryString.stringify(query)}`, { method: 'post' });
};

export const addAttachment = async (cardId, attachment) => {
    const baseUrl = `https://api.trello.com/1/cards/${cardId}`;
    const response = await fetch(attachment.uri);
    const blob = await response.blob();
    if (!_isBlob(blob)) return;
    const imageRef = firebaseApp.storage().ref('attachments').child(attachment.name);
    await imageRef.put(blob);
    let url = await imageRef.getDownloadURL();
    const query = {
        key: API_KEY,
        token: API_TOKEN,
        url,
        name: attachment.name,
        mimeType: attachment.mimeType
    };
    try {
        await fetch(`${baseUrl}/attachments?${queryString.stringify(query)}`, { method: 'POST' });
    } catch (error) {
        console.log('error: ', error)
        throw error;
    }
};

const _isBlob = blob => {
    if (!blob instanceof Blob)
      throw new Error(
        'Object is not an instance of Blob ' + JSON.stringify(blob)
      );

    const { size, type } = blob;
    const { blobId, name } = blob.data;

    if (typeof blobId !== 'string')
        throw new Error("Blob doesn't have a valid id " + blobId);
    if (typeof name !== 'undefined' && typeof name !== 'string')
        throw new Error("Blob doesn't have a valid name " + name);
    if (typeof size !== 'number' && size <= 0)
        throw new Error("Blob doesn't have a valid size " + size);
    if (typeof type !== 'string')
        throw new Error("Blob doesn't have a valid type " + type);

    return true;
};
