/**
 * Bosses of Bangalore — lead capture → Google Sheet
 *
 * Setup:
 * 1. Create a Google Sheet (e.g. "Bosses of Bangalore — Leads").
 * 2. In the Sheet: Extensions → Apps Script.
 * 3. Delete any starter code, paste THIS file, and Save.
 * 4. Click Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Authorize when prompted, then copy the Web app URL
 *    (looks like https://script.google.com/macros/s/AKfy.../exec).
 * 6. Send that URL back and I'll wire it into the form + redeploy.
 *
 * The first row of the sheet is written automatically as a header.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Write a header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Company']);
    }

    var data = e.parameter; // form-encoded fields: name, phone, company
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.company || ''
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
