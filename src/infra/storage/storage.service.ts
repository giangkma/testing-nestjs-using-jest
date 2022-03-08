import {
    BlobSASSignatureValues,
    BlobServiceClient,
    ContainerClient,
    ContainerSASPermissions,
    generateBlobSASQueryParameters,
    SASProtocol,
    StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import StorageConfig from '@src/config/storage.config';
import { Media } from '@src/domain/personalMedia';
import {
    ContainerType,
    dataAccessPolicies,
    SASInfo,
} from '@src/domain/storage';
import { UserModel } from '../database/model';
import { OrganizationRepository } from '../organization/organization.repository';
import { addMinutes } from 'date-fns';

@Injectable()
export class StorageService {
    private readonly sharedKeyCredential: StorageSharedKeyCredential;
    private readonly blobServiceClient: BlobServiceClient;
    constructor(
        private organizationRepository: OrganizationRepository,
        @Inject(StorageConfig.KEY)
        private readonly storageConfig: ConfigType<typeof StorageConfig>,
    ) {
        // create shared key credential
        const sharedKeyCredential = new StorageSharedKeyCredential(
            storageConfig.account_name,
            storageConfig.account_key,
        );

        // Init the BlobServiceClient
        this.blobServiceClient = new BlobServiceClient(
            storageConfig.blob_endpoint,
            sharedKeyCredential,
        );

        this.sharedKeyCredential = sharedKeyCredential;
    }

    /**
     *
     * @param {UserModel} user
     * @param {ContainerType} containerType
     * @param {string} consumerId
     * @returns {SASInfo} Sas
     */

    async generateSas(
        user: UserModel,
        containerType: ContainerType,
        consumerId?: string,
    ): Promise<SASInfo> {
        const containerName = await this.getContainerName(
            user,
            containerType,
            consumerId,
        );

        // Short TTL if requesting a PersonalSAS, since it is requested whenever client interacts with consumer's media
        const expiresOn =
            containerType === ContainerType.personalMedia
                ? addMinutes(new Date(), 30)
                : addMinutes(new Date(), 135);

        const blobSASSignatureValues: BlobSASSignatureValues = {
            containerName,
            expiresOn,
            permissions: ContainerSASPermissions.parse(
                dataAccessPolicies[containerType][user.role],
            ),
            protocol: SASProtocol.Https,
        };

        const generateSas = generateBlobSASQueryParameters(
            blobSASSignatureValues,
            this.sharedKeyCredential,
        );

        return {
            value: generateSas.toString(),
            expiresOn,
            containerName,
        };
    }

    async getContainerName(
        user: UserModel,
        containerType: ContainerType,
        consumerId?: string,
    ): Promise<string> {
        const organizationName = await this.organizationRepository.getOrganizationName(
            user,
        );

        if (consumerId) {
            return `${organizationName}-${containerType}-${consumerId}`;
        } else {
            return `${organizationName}-${containerType}`;
        }
    }
    /**
     * Get reference to container and ensure container created
     * @param {string} containerName
     * @returns {Promise<ContainerClient>}
     * @memberof StorageService
     */
    async getContainerClient(containerName: string): Promise<ContainerClient> {
        const containerClient = this.blobServiceClient.getContainerClient(
            containerName,
        );
        // create container if doesn't exist
        await containerClient.createIfNotExists();

        return containerClient;
    }

    /**
     * Delete container
     *
     * @param {string} containerName
     * @returns {Promise<void>}
     * @memberof StorageService
     */
    async deleteContainerClient(containerName: string): Promise<void> {
        const containerClient = await this.blobServiceClient.getContainerClient(
            containerName,
        );

        // delete container
        await containerClient.deleteIfExists();
    }

    /**
     * Upload file to folder in creator folder
     *
     * @param {string} folder
     * @param {string} filename
     * @returns {Promise<void>}
     * @memberof StorageService
     */
    async uploadCreatorFile(folder: string, filename: string): Promise<void> {
        // get reference to creator container
        const creatorContainer = await this.getContainerClient(folder);

        // save file to subfolder hierarchy by name to be able to traverse them https://stackoverflow.com/questions/49742201/how-to-save-a-file-to-a-subfolder-in-an-azure-blob-container
        const blobName = folder + '/' + filename;
        const blockBlobClient = creatorContainer.getBlockBlobClient(blobName);
        // TODO: handle server storage ( not needed for now )
    }

    async getCommonmedia(user: UserModel): Promise<Media[]> {
        const containerName = await this.getContainerName(
            user,
            ContainerType.commonMedia,
        );

        const containerClient = await this.getContainerClient(containerName);

        const blobs = containerClient.listBlobsFlat();
        const images: Media[] = [];
        for await (const blob of blobs) {
            images.push({
                id: blob.name,
            });
        }
        return images;
    }

    /**
     * Delete images
     *
     * @param {string} containerName
     * @param {string[]} imageIds
     * @returns {Promise<void>}
     * @memberof StorageService
     */
    async deleteImages(
        containerName: string,
        imageIds: string[],
    ): Promise<void> {
        const containerClient = await this.blobServiceClient.getContainerClient(
            containerName,
        );

        for await (const id of imageIds) {
            const blockBlobClient = containerClient.getBlockBlobClient(id);
            blockBlobClient.deleteIfExists();
        }
    }
}
