// ==UserScript==
// @name        Yourls Download CSV
// @namespace   https://github.com/jbodnar2/
// @author      jbodnar2@gsu.edu
// @license     GPLv3
// @version     1.0.0
// @description Adds a Download CSV button to footer of the YOURLS admin page.
// @match       https://lib.gsu.edu/admin
// @grant       none
// @downloadURL https://github.com/jbodnar2/stunning-fortnight/raw/main/yourls-download-csv.js
// @updateURL   https://github.com/jbodnar2/stunning-fortnight/raw/main/yourls-download-csv.js
// @homepageURL https://github.com/jbodnar2/stunning-fortnight
// @supportURL  https://github.com/jbodnar2/stunning-fortnight/issues
// ==/UserScript==

/**
 * Downloads a CSV report of the YOURLS short URLs and their metadata.
 * The report includes the short URL, original URL, date, user, and number of clicks.
 */
function downloadCsvReport() {
  // Initialize the CSV data with the header row
  let csvData = "Short URL, Original URL, Date, User, Clicks\r\n";

  // Iterate over each row in the main table
  csvData += Array.from(document.querySelectorAll("#main_table tbody tr"))
    .map((row) => {
      // Extract the data from each cell in the row - handle commas in urls, dates, and clicks
      const shortUrl = row.querySelector("td[id|=keyword]")?.innerText || " ";
      const originalUrl =
        row.querySelector("td[id|=url] a")?.href.replace(/,/g, "%2C") || " ";
      const date =
        row
          .querySelector("td[id|=timestamp]")
          ?.innerText.replace(/,/g, "\u002C") || " ";
      const user = row.querySelector("td[id|=user] ")?.innerText || " ";
      const clicks =
        row.querySelector("td[id|=clicks] ")?.innerText.replace(/,/g, "") ||
        " ";

      // Format the data as a CSV row and return it
      return `"${shortUrl}","${originalUrl}","${date}","${user}","${clicks}"`;
    })
    .join("\r\n"); // Join all the rows with newline characters

  // Create a Blob object from the CSV data
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Get the current date and time to append to filename so that multiple reports don't overwrite each other
  const postfix = new Date().toISOString().replace(/:/g, "-");

  // Create a download link element
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `yourls_report-${postfix}.csv`;
  downloadLink.style.display = "none";

  // Add the download link to the document body and trigger the click event
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up by removing the download link from the document body
  document.body.removeChild(downloadLink);

  // Revoke the object URL to free up memory
  URL.revokeObjectURL(url);
}

/**
 * Creates a button element that, when clicked, will download a CSV report
 * of the YOURLS short URLs and their metadata. The report includes the
 * short URL, original URL, date, user, and number of clicks.
 *
 * @returns {Element} The created button element.
 */
const createDownloadButton = () => {
  const button = document.createElement("button");
  button.textContent = "Download CSV Report";
  button.id = "download-csv-report";
  button.onclick = downloadCsvReport;
  button.style.cssText = `
    /* Center the button horizontally */
    display: block;
    margin: 0 auto;

    /* Add some space above the button */
    margin-block-start: 1em;

    /* Add some padding to the button */
    padding: 0.25em 0.75em;

    /* Set the background color of the button to white */
    background: white;

    /* Change the cursor to a pointer when hovering over the button */
    cursor: pointer;
  `;

  return button;
};

/**
 * Appends the download CSV report button to the footer section of the page.
 */
const appendDownloadButtonToFooter = () => {
  // Get the footer element
  const footer = document.querySelector("footer p");

  // Create the download CSV report button
  const button = createDownloadButton();

  // Add the button to the footer
  footer.appendChild(button);
};

appendDownloadButtonToFooter();
