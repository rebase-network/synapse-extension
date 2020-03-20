
import * as chrome from "sinon-chrome";
import browser from 'sinon-chrome/webextensions'


describe(" mock chrome sendMessage", ()=>{

    beforeEach( ()=> {
      chrome.runtime.sendMessage.flush();
    });

    afterEach( ()=> {
      chrome.flush();
    });

    it("should send msg 123", ()=>{
        const mockSendMsg = jest.fn(chrome.runtime.sendMessage);
        mockSendMsg(123);
        expect(mockSendMsg).toHaveBeenCalledWith(123);
    })

    // it("should receive msg 456", ()=>{
    //     const mockSendMsg = jest.fn(chrome.runtime.sendMessage);
    //     const returnVal = mockSendMsg(456);

    //     const mockReceMsg = jest.fn(chrome.runtime.onMessage.addListener);
    //     // expect(mockReceMsg).toHaveBeenCalledWith([returnVal, null,null]);

    //     // mockReceMsg
    // })

})
