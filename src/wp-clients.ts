import { Notice } from 'obsidian';
import WordpressPlugin from './main';
import { WpXmlRpcClient } from './wp-xml-rpc-client';
import {
  WpRestClient,
  WpRestClientAppPasswordContext,
  WpRestClientMiniOrangeContext,
  WpRestClientWpComOAuth2Context
} from './wp-rest-client';
import { WordPressClient } from './wp-client';
import { ERROR_NOTICE_TIMEOUT } from './consts';
import { WpProfile } from './wp-profile';
import { ApiType } from './plugin-settings';

export function getWordPressClient(
  plugin: WordpressPlugin,
  profile: WpProfile
): WordPressClient | null {
  if (!profile.endpoint || profile.endpoint.length === 0) {
    new Notice(plugin.i18n.t('error_noEndpoint'), ERROR_NOTICE_TIMEOUT);
    return null;
  }
  let client: WordPressClient | null = null;
  switch (profile.apiType) {
    case ApiType.XML_RPC:
      client = new WpXmlRpcClient(plugin, profile);
      break;
    case ApiType.RestAPI_miniOrange:
      client = new WpRestClient(plugin, profile, new WpRestClientMiniOrangeContext());
      break;
    case ApiType.RestApi_ApplicationPasswords:
      client = new WpRestClient(plugin, profile, new WpRestClientAppPasswordContext());
      break;
    case ApiType.RestApi_WpComOAuth2:
      if (profile.wpComOAuth2Token) {
        client = new WpRestClient(plugin, profile, new WpRestClientWpComOAuth2Context(
          profile.wpComOAuth2Token.blogId,
          profile.wpComOAuth2Token.accessToken
        ));
      } else {
        new Notice(plugin.i18n.t('error_invalidWpComToken'), ERROR_NOTICE_TIMEOUT);
      }
      break;
    default:
      client = null;
      break;
  }
  return client;
}
