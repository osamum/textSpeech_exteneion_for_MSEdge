//Speech Text extension for Microsoft Edge.
//v 0.8
//Osamu Monoe
(()=> {
    "use strict"
    // LocalStorage Key
    const STORAGE_KEY = 'extn_speech_info';
    const VOICE_PREFIX = 'voice_';

    let speech = new SpeechSynthesisUtterance();
    let voices = window.speechSynthesis.getVoices();
    let selected_voice_index = 999;
    let selected_voice;
    let speechInfo;
      
    //オプションページで設定された内容を読み込む関数
    function loadData() {
        let infoJSON = localStorage.getItem(STORAGE_KEY);
        if( infoJSON !== null){
            speechInfo = JSON.parse(infoJSON);
            speech.volume = speechInfo.volume;
	        speech.rate = speechInfo.rate;
	        speech.pitch = speechInfo.pitch; // 1 = normal
        } 
    }

    function addSeparator(itemID) {
        // コンテキストメニューに区切り線を追加
        browser.contextMenus.create({
            id: itemID,
            type: 'separator',
            contexts: ['selection']  // 選択しているときのみメニューに表示される 
        });
    }

    //サブメニューを作成する
    function createVoiceMenu(voiceName,defaultFlag, index) {
        // コンテキストメニューに "読み上げ" を追加
        browser.contextMenus.create({
            id: VOICE_PREFIX + index,
            title:voiceName, 
            contexts: ['selection'],  // 選択しているときのみメニューに表示される 
            type: 'radio',
            checked: defaultFlag,
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
    
    //テキストを読み上げる
    function speechText(speechText) {
        speech.text = speechText;
        if(selected_voice){
            speech.voice = selected_voice;
        };
        speechSynthesis.speak(speech);
    }

    // コンテキストメニューに "Speech for "%s"" を追加
    browser.contextMenus.create({
        id: 'menu_execSpeech',
        title: '"%s"を読み上げ', // %s は選択している文字列で置き換わる
        contexts: ['selection'],  // 選択しているときのみメニューに表示される
        onclick: (info, tab) => { //クリックされた際のアクション
            loadData();
            speechText(info.selectionText);
        }
    });

    // コンテキストメニューに区切り線を追加
    addSeparator('menu_separator_01');

    //音声ごとのサブメニューを作成
    voices.forEach(function(voice, index){
        createVoiceMenu(voice.name,voice.default,index);
    });

    
    // コンテキストメニューに区切り線を追加
    addSeparator('menu_separator_02');

    // コンテキストメニューにオプションメニューを追加
    browser.contextMenus.create({
        id: 'menu_option',
        title: 'オプション...', // %s は選択している文字列で置き換わる
        contexts: ['selection'],  // 選択しているときのみメニューに表示される
        onclick: (info, tab) => { //クリックされた際のアクション
           browser.tabs.create({
               url: browser.extension.getURL('/options.html')
           });
        }
    });

})();