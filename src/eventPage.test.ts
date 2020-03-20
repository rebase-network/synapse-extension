
import * as chrome from "sinon-chrome";
import browser from 'sinon-chrome/webextensions'
import { assert } from 'chai';

var fs = require('fs');
var sinon = require('sinon');
var chrome = require('sinon-chrome');
// var assert = require('chai').assert;
// var jsdom = require('jsdom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// sinon.assert.expose(global.assert, {prefix: ''});

describe('background page', function () {

  var window;
  // console.log(jsdom);
  // console.log("--------------------------");
  // console.log(jsdom.parse);
  beforeEach(function (done) {
    new JSDOM({
          // generated background page
          html: '<html></html>',
          // js source
          src: [fs.readFileSync('src/eventPage.ts', 'utf-8')],
          created: function (errors, wnd) {
              // attach `chrome` to window
              wnd.chrome = chrome;
              wnd.console = console;
          },
          done: function (errors, wnd) {
              if (errors) {
                  console.log(errors);
                  done(true);
              } else {
                  window = wnd;
                  done();
              }
          }
      });
  });

  afterEach(function () {
      chrome.reset();
      // window.close();
  });

  it('should listener called one time', function () {
      assert.calledOnce(chrome.runtime.onMessage.addListener);
      // const mockAddListener = jest.fn(chrome.runtime.onMessage.addListener);
      // expect(mockAddListener).toBeCalledTimes(1);
      // assert.calledOnce(chrome.tabs.onCreated.addListener);
      // assert.calledOnce(chrome.tabs.onRemoved.addListener);
  });

  // it('should update badge on startup', function () {
  //     assert.calledOnce(chrome.tabs.query);
  //     assert.calledOnce(chrome.browserAction.setBadgeText);
  //     assert.calledWithMatch(chrome.browserAction.setBadgeText, {
  //         text: '4'
  //     });
  // });

  // it('should return tabs by request from popup', function () {
  //     chrome.tabs.query.reset();
  //     var sendResponse = sinon.spy();
  //     chrome.runtime.onMessage.trigger('get-tabs', {}, sendResponse);
  //     assert.calledOnce(chrome.tabs.query);
  //     assert.calledOnce(sendResponse);
  //     assert.calledWith(sendResponse, sinon.match.array);
  //     assert.calledWith(sendResponse, sinon.match(function (value) {
  //         return value.length === 4;
  //     }));
  // });
});

// describe(" mock chrome sendMessage", ()=>{

//     beforeEach( ()=> {
//       chrome.runtime.sendMessage.flush();
//     });

//     afterEach( ()=> {
//       chrome.flush();
//     });

//     it("should send msg 123", ()=>{
//         const mockSendMsg = jest.fn(chrome.runtime.sendMessage);
//         mockSendMsg(123);
//         expect(mockSendMsg).toHaveBeenCalledWith(123);
//     })

//     // it("should receive msg 456", ()=>{
//     //     const mockSendMsg = jest.fn(chrome.runtime.sendMessage);
//     //     const returnVal = mockSendMsg(456);

//     //     const mockReceMsg = jest.fn(chrome.runtime.onMessage.addListener);
//     //     // expect(mockReceMsg).toHaveBeenCalledWith([returnVal, null,null]);

//     //     // mockReceMsg
//     // })

// })
