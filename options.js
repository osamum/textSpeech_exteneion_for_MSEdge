(() => {
"use strict"
    // LocalStorage Key
    const STORAGE_KEY = 'extn_speech_info';

    // HTML TAG Property
    // id: TAG ID
    // storage: true: 保存, false: 保存しない
    const CTRL_CONFIG = [
        {id: 'page_caption', type: 0, storage: false},
        {id: 'saveBtn',   type: 0, storage: false},
        {id: 'clearBtn',  type: 0, storage: false},
        {id: 'volume',    type: 1, storage: true},
        {id: 'rate',      type: 1, storage: true},
        {id: 'pitch',     type: 1, storage: true},
        {id: 'display',   type: 3, storage: false}
    ]
   
    let isLocalStorage = (element, index, array) => element.storage;

    //UI に表示する文字列をロード(国際化対応)
    let captions = {
        pageTitle: browser.i18n.getMessage('option_page_title'),
        message : {
             loadPreviousData : browser.i18n.getMessage('loadPreviousData'),
             deletePreviousData : browser.i18n.getMessage('deletePreviousData'),
             saveData : browser.i18n.getMessage('saveData')
         },
         button :{
             label_save:  browser.i18n.getMessage('label_save'),
             label_clear:  browser.i18n.getMessage('label_clear')
            }
    };
    
    // Get HTML TAG Object
    let ctrl = {}
    CTRL_CONFIG.forEach((_ctrl)=>ctrl[_ctrl.id] = document.getElementById(_ctrl.id));

    //設定ページのタイトルをロード
    ctrl['page_caption'].innerText = captions.pageTitle;

    // LocalStorageから保存されている画面設定を取得する
    let speechInfoJSON = localStorage.getItem(STORAGE_KEY);
    if(speechInfoJSON !== null){
        let speechInfo = JSON.parse(speechInfoJSON);
        CTRL_CONFIG
            .filter(isLocalStorage)
            .forEach((_ctrl)=>{
                if (_ctrl.type === 1) ctrl[_ctrl.id].value = speechInfo[_ctrl.id]; 
            });
        ctrl['display'].textContent = captions.message.loadPreviousData; //'保存されていた前回の設定を読み込みました。';
    }

    // 保存ボタンに対する処理を定義
    ctrl['saveBtn'].addEventListener('click', ()=> {
        let speechInfo = {};
        CTRL_CONFIG
            .filter(isLocalStorage)
            .forEach((_ctrl)=>{
                if (_ctrl.type === 1) speechInfo[_ctrl.id] = ctrl[_ctrl.id].value; 
            });
        //設定情報を localStorage に保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(speechInfo));
        ctrl['display'].textContent = captions.message.saveData; //'設定を保存しました。ブラウザーの次回起動時から有効になります。';        
    });
    ctrl['saveBtn'].innerText = captions.button.label_save;

    // クリアボタンに対する処理を定義
    ctrl['clearBtn'].addEventListener('click', () => {
        localStorage.clear();
        ctrl['display'].textContent = captions.message.deletePreviousData; //'保存されていた前回の設定を削除しました。';
    })
    ctrl['clearBtn'].innerText = captions.button.label_clear;
})();
