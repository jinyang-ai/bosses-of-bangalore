/**
 * Bosses of Bangalore — lead capture → Google Sheet (with UTM attribution)
 *
 * Setup (first time):
 * 1. Create a Google Sheet (e.g. "Bosses of Bangalore — Leads").
 * 2. In the Sheet: Extensions → Apps Script.
 * 3. Delete any starter code, paste THIS file, and Save.
 * 4. Click Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Authorize when prompted, then copy the Web app URL
 *    (looks like https://script.google.com/macros/s/AKfy.../exec).
 *
 * Updating (you already have a deployment):
 *  - Paste this newer version over the old code and Save.
 *  - Deploy → Manage deployments → (edit your existing deployment) → Deploy.
 *    Editing the SAME deployment keeps the URL unchanged, so the website needs
 *    no edits. (A "New deployment" would create a different URL.)
 *
 * The header row is created/upgraded automatically.
 */

var HEADERS = [
  'Timestamp', 'Name', 'Phone', 'Company',
  'Source', 'Medium', 'Campaign', 'Content', 'Term', 'Referrer'
];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Create the header on a fresh sheet, or upgrade an older 4-column header
    // (Timestamp/Name/Phone/Company) to include the attribution columns.
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

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
