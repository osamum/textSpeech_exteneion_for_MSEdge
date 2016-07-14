//Speech Text extension for Microsoft Edge.
//v 0.8
//Osamu Monoe
(()=> {

var speech = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
var selected_voice_index = 999;
var selected_voice;

//オプションページで設定された内容を読み込む


var infoJSON = localStorage.getItem('extn_speech_info');
if( infoJSON !== null){
    //alert('setting is exist.');
    var speechInfo = JSON.parse(infoJSON);
    speech.volume = speechInfo.volume;
    //alert('volume load : OK.');
	speech.rate = speechInfo.rate;
    //alert('rate load : OK');
	speech.pitch = speechInfo.pitch; // 1 = normal
    //alert('pitch load : OK');
    selected_voice_index = speechInfo.voiceIndex;
    //alert('index load : OK');
    selected_voice = voices[selected_voice_index];
    //alert('voice load : OK');
} 

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

(()=> {
    var cnt = 0;
    voices.forEach(function(voice){
        var opt = document.createElement('option');
        createVoiceMenu(voice.name,cnt);
        cnt++;
    });
})();

//サブメニューを作成する
function createVoiceMenu(voiceName, index) {
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

//テキストを読み上げる
function speechText(speechText) {
    speech.text = speechText;
    if(selected_voice){
        speech.voice = selected_voice;
    };
    speechSynthesis.speak(speech);
}

})();