const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
require('@testing-library/jest-dom');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom;
let container;

describe('index.html', () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    container = dom.window.document.body;
  });

  it('should have a 24/7 headset icon in the urgent care section', () => {
    const urgentCareSection = container.querySelector('.urgent-care-container');
    const headsetIcon = urgentCareSection.querySelector('.fa-headset');
    expect(headsetIcon).toBeInTheDocument();
  });

  it('should have a first aid icon in the urgent care section', () => {
    const urgentCareSection = container.querySelector('.urgent-care-container');
    const firstAidIcon = urgentCareSection.querySelector('.fa-first-aid');
    expect(firstAidIcon).toBeInTheDocument();
  });
});
