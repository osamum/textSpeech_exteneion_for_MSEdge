var $id = function(id){return document.getElementById(id)};
    //SpeechSynthesis のインスタンスを生成
    var speech = new SpeechSynthesisUtterance();
  
    var ctrl_text,
        crtl_volume,
        ctrl_rate,
        ctrl_pitch,
        ctrl_lang,
        ctrl_voiceType,
        ctrl_display;
     
    function setCtrl(){
        crtl_volume = $id('volume');
        ctrl_rate = $id('rate');
        ctrl_pitch = $id('pitch');
        //ctrl_lang = $id('lang');
        ctrl_voiceType = $id('voiceType');
        ctrl_display = $id('display');
    };

    function setHandlers() {
       $id('saveBtn').addEventListener('click', ()=> {
            var speechInfo ={};
            speechInfo.volume = crtl_volume.value;
	        speechInfo.rate = ctrl_rate.value;
	        speechInfo.pitch = ctrl_pitch.value; // 1 = normal
            speechInfo.voiceIndex = ctrl_voiceType.selectedIndex;
            var speechInfoJSON = JSON.stringify(speechInfo);    
           localStorage.setItem('extn_speech_info',speechInfoJSON);
           ctrl_display.textContent = '設定を保存しました。ブラウザーの次回起動時から有効になります。';
       });

       $id('clearBtn').addEventListener('click', ()=>{
           localStorage.clear();
           ctrl_display.textContent = '保存されていた前回の設定を削除しました。';
       })
    }

     function initControl(){
        speechSynthesis.getVoices().forEach(function(voice){
            var opt = document.createElement('option');
            opt.innerText = voice.name;
            //voiceTypes.push(voice);
            ctrl_voiceType.appendChild(opt);
        });
    }

    function loadData() {
        var speechInfoJSON = localStorage.getItem('extn_speech_info');
        if(speechInfoJSON !== null){
            var speechInfo = JSON.parse(speechInfoJSON);
            crtl_volume.value = speechInfo.volume;
            ctrl_rate.value = speechInfo.rate;
            ctrl_pitch.value = speechInfo.pitch;
            ctrl_voiceType.selectedIndex = speechInfo.voiceIndex;
            ctrl_display.textContent = '保存されていた前回の設定を読み込みました。';
        }
    }

    window.onload = ()=>{
         setCtrl();
         initControl();
         loadData();
         setHandlers();
    };
