import { Users } from '../../../../app/models/server';
import { Settings } from '../../../../app/models/server/raw';
import { ISetting } from '../../../../definition/ISetting';

type WizardSettings = Array<ISetting>;

const url = 'https://go.rocket.chat/i/seats-cap-upgrade';

export const getSeatsRequestLink = (): string => {
	const workspaceId: ISetting | undefined = Promise.await(Settings.findOneById('Cloud_Workspace_Id'));
	const activeUsers = Users.getActiveLocalUserCount();
	const wizardSettings: WizardSettings = Promise.await(Settings.findSetupWizardSettings().toArray());

	const newUrl = new URL(url);

	if (workspaceId?.value) {
		newUrl.searchParams.append('workspaceId', String(workspaceId.value));
	}

	if (activeUsers) {
		newUrl.searchParams.append('activeUsers', String(activeUsers));
	}

	wizardSettings
		.filter(({ _id, value }) => ['Industry', 'Country', 'Size'].includes(_id) && value)
		.forEach((setting) => {
			newUrl.searchParams.append(setting._id.toLowerCase(), String(setting.value));
		});

	return newUrl.toString();
};
