import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
    creator_folder: process.env.CREATOR_STORAGE_FOLDER || 'creator',
    user_folder: process.env.USER_STORAGE_FOLDER || 'user',
    account_name: process.env.STORAGE_ACCOUNT_NAME,
    account_key: process.env.STORAGE_ACCOUNT_KEY,
    blob_endpoint: process.env.STORAGE_BLOB_ENDPOINT,
    commonmedia_container: process.env.COMMON_MEDIA_STORAGE_FOLDER || 'cm',
    avatars_container: process.env.AVATARS_STORAGE_FOLDER || 'avatars',
    personalmedia_container: process.env.PERSONAL_MEDIA_STORAGE_FOLDER || 'pm',
}));
