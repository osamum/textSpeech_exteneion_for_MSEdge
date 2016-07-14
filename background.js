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
    var selected_voice_index = 999;
    var selected_voice;
    var speechInfo;
      
    //オプションページで設定された内容を読み込む関数
    function loadData() {
        var infoJSON = localStorage.getItem(STORAGE_KEY);
        if( infoJSON !== null){
            speechInfo = JSON.parse(infoJSON);
            speech.volume = speechInfo.volume;
	        speech.rate = speechInfo.rate;
	        speech.pitch = speechInfo.pitch; // 1 = normal
            selected_voice_index = speechInfo.voiceType;
            selected_voice = voices[selected_voice_index];
            //menuItems[selected_voice_index].checked = true;
            browser.contextMenus.update(VOICE_PREFIX + selected_voice_index,{checked: true});
        } 
    }

    //オプションページで設定された内容を読み込む。ただし登録時にしか動作しない
    loadData();


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
    browser.contextMenus.create({
        id: 'menu_separator_01',
        type: 'separator',
        contexts: ['selection']  // 選択しているときのみメニューに表示される 
    });

    voices.forEach(function(voice, index){
        var opt = document.createElement('option');
        createVoiceMenu(voice.name,voice.default,index);
    });

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

    // コンテキストメニューに区切り線を追加
    browser.contextMenus.create({
        id: 'menu_separator_02',
        type: 'separator',
        contexts: ['selection']  // 選択しているときのみメニューに表示される 
    });

    // コンテキストメニューに "Speech for "%s"" を追加
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

    //テキストを読み上げる
    function speechText(speechText) {
        speech.text = speechText;
        if(selected_voice){
            speech.voice = selected_voice;
        };
        speechSynthesis.speak(speech);
    }

})();