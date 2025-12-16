import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailchimp from '@mailchimp/mailchimp_marketing';

@Injectable()
export class MailchimpService {
  private readonly logger = new Logger(MailchimpService.name);
  private readonly audienceId: any;

  constructor(private configService: ConfigService) {
    mailchimp.setConfig({
      apiKey: this.configService.get<string>('MAILCHIMP_API_KEY'),
      server: this.configService.get<string>('MAILCHIMP_SERVER_PREFIX'),
    });

    this.audienceId = this.configService.get<string>('MAILCHIMP_AUDIENCE_ID');
  }

  async addContact(
    email: string,
    firstName?: string,
    lastName?: string,
    tags?: string[],
  ) {
    try {
      //   const audienceId = this.configService.get<string>('MAILCHIMP_AUDIENCE_ID');

      const response = await mailchimp.lists.addListMember(this.audienceId, {
        email_address: email,
        status: 'subscribed', // 'subscribed', 'unsubscribed', 'cleaned', 'pending'
        merge_fields: {
          FNAME: firstName || '',
          LNAME: lastName || '',
        },
        tags: tags || [],
      });

      this.logger.log(`Contact ajouté avec succès: ${email}`);
      return response;
    } catch (error) {
      if (error.response?.body?.title === 'Member Exists') {
        this.logger.warn(`Le contact existe déjà: ${email}`);
        return this.updateContact(email, firstName, lastName, tags);
      }
      this.logger.error(`Erreur lors de l'ajout du contact: ${error.message}`);
      throw error;
    }
  }

  async updateContact(
    email: string,
    firstName?: string,
    lastName?: string,
    tags?: string[],
  ) {
    try {
      //  const audienceId = this.configService.get<string>('MAILCHIMP_AUDIENCE_ID');
      const subscriberHash = this.getSubscriberHash(email);

      const response = await mailchimp.lists.updateListMember(
        this.audienceId,
        subscriberHash,
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName || '',
            LNAME: lastName || '',
          },
        },
      );

      if (tags && tags.length > 0) {
        await this.addTags(email, tags);
      }

      this.logger.log(`Contact mis à jour avec succès: ${email}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Erreur lors de la mise à jour du contact: ${error.message}`,
      );
      throw error;
    }
  }

  async addTags(email: string, tags: string[]) {
    try {
      //   const audienceId = this.configService.get<string>('MAILCHIMP_AUDIENCE_ID');
      const subscriberHash = this.getSubscriberHash(email);

      const response = await mailchimp.lists.updateListMemberTags(
        this.audienceId,
        subscriberHash,
        {
          tags: tags.map((tag) => ({ name: tag, status: 'active' })),
        },
      );

      this.logger.log(`Tags ajoutés avec succès pour: ${email}`);
      return response;
    } catch (error) {
      this.logger.error(`Erreur lors de l'ajout des tags: ${error.message}`);
      throw error;
    }
  }

  async deleteContact(email: string) {
    try {
      //   const audienceId = this.configService.get<string>('MAILCHIMP_AUDIENCE_ID');
      const subscriberHash = this.getSubscriberHash(email);

      await mailchimp.lists.deleteListMember(this.audienceId, subscriberHash);
      this.logger.log(`Contact supprimé avec succès: ${email}`);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la suppression du contact: ${error.message}`,
      );
      throw error;
    }
  }

  private getSubscriberHash(email: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }
}
