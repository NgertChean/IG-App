import { ACCESS_TOKEN, CLIENT_ID, CLIENT_SECRET } from '../constants/trello_insta';

export const fetchUser = async () => {
	return fetch(`https://api.instagram.com/v1/self/?access_token=${ACCESS_TOKEN}`)
	.then(res => res.json())
};

export const fetchMedias = ()=> {
	return fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${ACCESS_TOKEN}`)
	.then(res => res.json())
}