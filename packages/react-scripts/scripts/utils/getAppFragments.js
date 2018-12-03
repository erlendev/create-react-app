'use strict';

const jsdom = require('jsdom');
const request = require('request');

const { JSDOM } = jsdom;

const requestAppFragments = callback =>
  request(process.env.APPRES_CMS_URL, callback);

const extractFragmentsFromDocument = document => {
  const scriptEl = document.getElementById('scripts');
  const stylesEl = document.getElementById('styles');
  const headingEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');

  const property = 'innerHTML';

  const fragments = {};
  if (scriptEl !== null) {
    fragments.NAV_SCRIPTS = scriptEl[property];
  }
  if (stylesEl !== null) {
    fragments.NAV_STYLES = stylesEl[property];
  }
  if (headingEl !== null) {
    fragments.NAV_HEADING = headingEl[property];
  }
  if (footerEl !== null) {
    fragments.NAV_FOOTER = footerEl[property];
  }

  return fragments;
};

const getAppFragments = () =>
  new Promise((resolve, reject) => {
    const callback = (error, response, body) => {
      if (!error && response.statusCode >= 200 && response.statusCode < 400) {
        const { document } = new JSDOM(body).window;
        resolve(extractFragmentsFromDocument(document));
      } else {
        console.log(error);
        reject(new Error(error));
      }
    };

    requestAppFragments(callback);
  });

module.exports = getAppFragments;
