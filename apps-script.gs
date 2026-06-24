/**
 * Bosses of Bangalore — lead capture → Google Sheet + WATI WhatsApp ack
 *
 * Setup / update:
 * 1. In the Sheet: Extensions → Apps Script. Paste this over the old code, Save.
 * 2. Add the WATI token as a Script Property (keeps it out of the code/repo):
 *      Project Settings (⚙️) → Script Properties → Add script property
 *        Property: WATI_TOKEN
 *        Value:    <your WATI access token>
 * 3. Deploy → Manage deployments → edit the existing deployment →
 *      Version: New version → Deploy. (Keeps the same web-app URL.)
 *
 * On each submission this appends a row AND sends the approved "boss_ack"
 * WhatsApp utility template to the lead's number.
 */

var HEADERS = [
  'Timestamp', 'Name', 'Phone', 'Company',
  'Source', 'Medium', 'Campaign', 'Content', 'Term', 'Referrer'
];

// WATI config. The token is NOT here — it is read from Script Properties.
var WATI_ENDPOINT  = 'https://live-mt-server.wati.io/10180285';
var WATI_TEMPLATE  = 'boss_ack';
var WATI_BROADCAST = 'boss_ack_signup';
var WATI_PARAM_2   = 'the mission - great bosses have always hired directly, and Bangalore gets built by people like you.';
var WATI_PARAM_3   = 'Enter the adventure';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    } else {
      var firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
      if (firstRow[4] !== 'Source') {
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      }
    }

    var d = e.parameter;
    sheet.appendRow([
      new Date(),
      d.name || '',
      d.phone || '',
      d.company || '',
      d.utm_source || '',
      d.utm_medium || '',
      d.utm_campaign || '',
      d.utm_content || '',
      d.utm_term || '',
      d.referrer || ''
    ]);

    // Send the WhatsApp ack — never let a WATI failure block the Sheet write.
    try { sendWatiMessage(d); } catch (werr) {}

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendWatiMessage(d) {
  var token = PropertiesService.getScriptProperties().getProperty('WATI_TOKEN');
  if (!token) return; // not configured yet

  var phone = String(d.phone || '').replace(/\D/g, '');
  if (phone.length < 11) return; // expect country code + number, e.g. 91XXXXXXXXXX

  var firstName = String(d.name || '').trim().split(/\s+/)[0] || 'Boss';

  var url = WATI_ENDPOINT + '/api/v1/sendTemplateMessage?whatsappNumber=' + encodeURIComponent(phone);
  var payload = {
    template_name: WATI_TEMPLATE,
    broadcast_name: WATI_BROADCAST,
    parameters: [
      { name: '1', value: firstName + ' 🪷' },
      { name: '2', value: WATI_PARAM_2 },
      { name: '3', value: WATI_PARAM_3 }
    ]
  };

  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token, accept: '*/*' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
