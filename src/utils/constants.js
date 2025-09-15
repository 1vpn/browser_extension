export const isFirefox = process.env.BROWSER === 'firefox'
export const isEdge = process.env.BROWSER === 'edge'

export const action = isFirefox ? chrome.browserAction : chrome.action

export const websiteUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://1vpn.org'
    : 'https://1vpn.org'

export const androidUrl =
  'https://play.google.com/store/apps/details?id=com.one.vpnapp' +
  `&hl=${chrome.i18n.getUILanguage()}`

export const backupUrl = 'https://1vpn.website'

export const freeCredentials = {
  username: process.env.FREE_USERNAME,
  password: process.env.FREE_PASSWORD,
}

export const errorCodes = { invalidToken: 1001 }

export const reviewUrl =
  (isFirefox
    ? 'https://addons.mozilla.org/firefox/addon/1vpn/reviews'
    : isEdge
    ? 'https://microsoftedge.microsoft.com/addons/detail/dalhgafbhpdolibignjckpmiejgfddjp'
    : 'https://chromewebstore.google.com/detail/akcocjjpkmlniicdeemdceeajlmoabhg/reviews') +
  `?hl=${chrome.i18n.getUILanguage()}`

export const localeMessageKeys = [
  'upgrade',
  'signUp',
  'login',
  'continueText',
  'username',
  'password',
  'twoFaToken',
  'loading',
  'forgotPassword',
  'connected',
  'disconnected',
  'goToOptionsPage',
  'goToLocationsPage',
  'upgradeText1',
  'upgradeText2',
  'menu',
  'account',
  'options',
  'contactUs',
  'email',
  'plan',
  'premium',
  'free',
  'editInfo',
  'logout',
  'spoofGeolocation',
  'disableWebRtc',
  'disableAddressAutofill',
  'spoofGeolocationSubTitle',
  'disableWebRtcSubTitle',
  'disableAddressAutofillSubTitle',
  'locations',
  'reviewModalTitle',
  'reviewModalButton',
  'shareModalTitle',
  'shareText',
  'x',
  'facebook',
  'linkedin',
  'vk',
  'ok',
  'telegram',
  'upgradeLocation',
  'installSuccess',
  'installInstructions',
  'tryOurAndroidApp',
  'scanQrCodeOrClickButton',
  'scanOrClickQRCode',
  'downloadApp',
  'specialOffer',
  'sixtyPercentOff',
  'onAnnualPlan',
  'moreServerLocations',
  'fasterSpeeds',
  'moneyBackGuarantee',
  'claimOffer',
  'until',
  'au',
  'br',
  'ca',
  'cl',
  'fr',
  'de',
  'in',
  'jp',
  'kr',
  'mx',
  'nl',
  'pl',
  'ro',
  'sg',
  'es',
  'se',
  'uk',
  'use',
  'uss',
  'usw',
  'ue',
  'us',
  'uw',
  'za',
]
