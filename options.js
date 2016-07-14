(() => {
"use strict"
    // LocalStorage Key
    const STORAGE_KEY = 'extn_speech_info';

    // HTML TAG Property
    // id: TAG ID
    // storage: true: 保存, false: 保存しない
    const CTRL_CONFIG = [
        {id: 'saveBtn',   type: 0, storage: false},
        {id: 'clearBtn',  type: 0, storage: false},
        {id: 'volume',    type: 1, storage: true},
        {id: 'rate',      type: 1, storage: true},
        {id: 'pitch',     type: 1, storage: true},
        {id: 'display',   type: 3, storage: false}
    ]
   
    let isLocalStorage = (element, index, array) => element.storage;
    
    // Get HTML TAG Object
    let ctrl = {}
    CTRL_CONFIG.forEach((_ctrl)=>ctrl[_ctrl.id] = document.getElementById(_ctrl.id));

    // LocalStorageから保存されている画面設定を取得する
    let speechInfoJSON = localStorage.getItem(STORAGE_KEY);

    //let keys = ['volume', 'rate', 'pitch', 'voiceType','voiceIndex'];


    if(speechInfoJSON !== null){
        let speechInfo = JSON.parse(speechInfoJSON);
        CTRL_CONFIG
            .filter(isLocalStorage)
            .forEach((_ctrl)=>{
                if (_ctrl.type === 1) ctrl[_ctrl.id].value = speechInfo[_ctrl.id]; 
            });
        ctrl['display'].textContent = '保存されていた前回の設定を読み込みました。';
    }

    // 保存ボタンに対する処理を定義
    ctrl['saveBtn'].addEventListener('click', ()=> {
        let speechInfo = {};
        CTRL_CONFIG
            .filter(isLocalStorage)
            .forEach((_ctrl)=>{
                if (_ctrl.type === 1) speechInfo[_ctrl.id] = ctrl[_ctrl.id].value; 
            });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(speechInfo));
        ctrl['display'].textContent = '設定を保存しました。ブラウザーの次回起動時から有効になります。';        
    });

    // クリアボタンに対する処理を定義
    ctrl['clearBtn'].addEventListener('click', () => {
        localStorage.clear();
        ctrl['display'].textContent = '保存されていた前回の設定を削除しました。';
    })
})();
