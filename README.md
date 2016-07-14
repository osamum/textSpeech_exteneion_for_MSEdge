# textSpeech_exteneion_for_MSEdge

Microsoft Edge にて、選択されたテキストを読み上げるための拡張です。 

マウスの右ボタンをクリックした際に表示されるコンテキストメニューに読み上げのためのメニューを追加します。 

使用可能な音声の種類は、Windows 10 に言語パックを追加することで増やすことができます。

[既知の問題]

optionページ (option.js) で設定を LocalStorage に保存していますが、拡張のメインのロジックが記述してある background.js から読みだせません。

現在 Windows フィードバックにて報告しています。

===== English =====

This is Text Speech extension for Microsoft Edge.

The extension does read the selected text in the browser.

You can add more voice type that use Windows 10 language pack add feature.

[Known issue]

Now, Does not share option page's localStorage and background.js's localStorage.
