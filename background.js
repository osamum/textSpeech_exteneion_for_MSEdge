//Speech Text extension for Microsoft Edge.
//v 0.8
//Osamu Monoe

(() => {
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
        {id: 'voiceType', type: 2, storage: true},
        {id: 'display',   type: 3, storage: false}
    ]

    let speechInfoJSON = localStorage.getItem(STORAGE_KEY);
    if(speechInfoJSON !== null){
        let speechInfo = JSON.parse(speechInfoJSON);
        CTRL_CONFIG
            .filter(isLocalStorage)
            .forEach((_ctrl)=>{
                if (_ctrl.type === 1) ctrl[_ctrl.id].value = speechInfo[_ctrl.id]; 
                if (_ctrl.type === 2) ctrl[_ctrl.id].selectedIndex = speechInfo[_ctrl.id];
            });
    }

    let speech = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    let selected_voice_index = 999;
    let selected_voice;

    // コンテキストメニューに "Speech for "%s"" を追加
    browser.contextMenus.create({
        id: 'menu_execSpeech',
        title: '"%s"を読み上げ', // %s は選択している文字列で置き換わる
        contexts: ['selection'],  // 選択しているときのみメニューに表示される
        onclick: (info, tab) => { //クリックされた際のアクション
            speechText(info.selectionText);
        }
    });

    // コンテキストメニューに区切り線を追加
    browser.contextMenus.create({
        id: 'menu_separator_01',
        type: 'separator',
        contexts: ['selection']  // 選択しているときのみメニューに表示される 
    });

    //テキストを読み上げる
    let speechText = (speechText) =>  {
        speech.text = speechText;
        if(selected_voice){
            speech.voice = selected_voice;
        };
        speechSynthesis.speak(speech);
    }

    //サブメニューを作成する
    let createVoiceMenu = (voiceName, index) => {
        // コンテキストメニューに "読み上げ" を追加
        browser.contextMenus.create({
            id: 'voice_' + index,
            title: voiceName, 
            contexts: ['selection'],  // 選択しているときのみメニューに表示される 
            type: 'radio',
            checked: (selected_voice_index===index),
            onclick: (info, tab) => {
                //クロージャを使用してメニュー作成時の index を保持する
                ((index2)=> { 
                    selected_voice_index = index2;
                    selected_voice = voices[index2];
                    speechText(info.selectionText);
                })(index);
            }
        });
    }

    voices.forEach((voice, index) => {
        let opt = document.createElement('option');
        createVoiceMenu(voice.name, index);
    });

})();


