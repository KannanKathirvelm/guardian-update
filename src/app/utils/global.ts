// function to set https protocal for url
export function addHttpsProtocol(url: string, cdnUrl?: string) {
  if (url) {
    const pattern = url.match(/http/g);
    if (!pattern) {
      const cdn = new RegExp(cdnUrl, 'g');
      const cdnMatch = url.match(cdn);
      if (cdnMatch) {
        url = `https:${url}`;
      } else {
        url = cdnUrl + url;
      }
    }
  }
  return url;
}

/**
 * @function getLastSegmentFromUrl
 * Method used to get last segment from given url
 */
export function getLastSegmentFromUrl(url) {
  return url.match(/([^\/]*)\/*$/)[1];
}
