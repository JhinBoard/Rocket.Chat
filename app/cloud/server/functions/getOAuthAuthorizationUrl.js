import { Random } from 'meteor/random';

import { getRedirectUri } from './getRedirectUri';
import { settings } from '../../../settings';
import { userScopes } from '../oauthScopes';
import { Settings } from '../../../models/server/raw';

export async function getOAuthAuthorizationUrl() {
	const state = Random.id();

	await Settings.updateValueById('Cloud_Workspace_Registration_State', state);

	const cloudUrl = settings.get('Cloud_Url');
	const client_id = settings.get('Cloud_Workspace_Client_Id');
	const redirectUri = getRedirectUri();

	const scope = userScopes.join(' ');

	return `${ cloudUrl }/authorize?response_type=code&client_id=${ client_id }&redirect_uri=${ redirectUri }&scope=${ scope }&state=${ state }`;
}
