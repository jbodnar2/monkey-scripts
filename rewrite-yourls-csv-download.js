class YourlsCsvDownloader {
  constructor() {
    this.csvData = "Short URL, Original URL, Date, User, Clicks\r\n";
  }

  downloadCsvReport() {
    this.generateCsvData();

    const csvBlob = new Blob([this.csvData], {
      type: "text/csv;charset=utf-8;",
    });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvFileName = `yourls_report-${new Date().toISOString().replace(/:/g, "-")}.csv`;

    const downloadLink = document.createElement("a");
    downloadLink.href = csvUrl;
    downloadLink.download = csvFileName;
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(csvUrl);
  }

  generateCsvData() {
    this.csvData += Array.from(
      document.querySelectorAll("#main_table tbody tr"),
    )
      .map((row) => {
        const shortUrl = row.querySelector("td[id|=keyword]")?.innerText || " ";
        const originalUrl =
          row.querySelector("td[id|=url] a")?.href.replace(/,/g, "%2C") || " ";
        const date =
          row
            .querySelector("td[id|=timestamp]")
            ?.innerText.replace(/,/g, "\u002C") || " ";
        const user = row.querySelector("td[id|=user]")?.innerText || " ";
        const clicks =
          row.querySelector("td[id|=clicks]")?.innerText.replace(/,/g, "") ||
          " ";

        return `"${shortUrl}","${originalUrl}","${date}","${user}","${clicks}"`;
      })
      .join("\r\n");
  }

  createDownloadButton() {
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download CSV Report";
    downloadButton.id = "download-csv-report";
    downloadButton.onclick = () => this.downloadCsvReport();
    downloadButton.style.cssText = `
    display: block;
    margin: 0 auto;
    margin-block-start: 1em;
    padding: 0.25em 0.75em;
    background: white;
    cursor: pointer;
    `;

    return downloadButton;
  }

  appendDownloadButtonToFooter() {
    const footer = document.querySelector("footer p");
    const downloadButton = this.createDownloadButton();

    footer.appendChild(downloadButton);
  }
}

const yourlsCsvDownloader = new YourlsCsvDownloader();
yourlsCsvDownloader.appendDownloadButtonToFooter();
