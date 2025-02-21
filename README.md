# 使い方

## ダウンロード
↓のリンクのStremMorph-???.zipのファイルをダウンロードしてください
https://github.com/DOGON309/StreamMorph/releases

## 起動手順
StreamMorph-???.zipを解凍してください
### windows
- 全て展開を行い
  ![image](https://github.com/user-attachments/assets/9f6532b9-6fcd-4b43-947e-cc809d14acb8)

- 解凍後のフォルダ内のmain.exeをダブルクリック（警告等が出たら詳細情報をクリックし実行してください）
  最初の起動には少し時間がかかります…
- コマンドプロンプト（黒い画面）が表示されたらCtrl（キーボードの一番左下）を押しながらコマンドプロンプト上の http://localhost:8080 をクリックしてください
  ![image](https://github.com/user-attachments/assets/4d92dc5d-a699-49db-8c86-0923968de67f)
- 自身が設定しているデフォルトのブラウザでトップページが表示されます
  ![image](https://github.com/user-attachments/assets/44401ea9-41fc-4da9-8431-c5c9f6a14647)

## 文字の設定
### 追加手順
- トップページの [ループテキスト編集] をクリック
- [追加] をクリックしモーダル上の入力欄に流した文字の入力する
- モーダル上の [追加] をクリックする事で文字の追加ができます
  （文字は何個でも追加できます…ただ多すぎると、とてつもない速さで文字が流れます）

## プロパティの設定
高さ・幅・スピード・背景色・文字の色を変更できます
### 変更手順
- トップページの[ループテキスト設定] をクリック
- 各プロパティの数値・色をお好みに変更する
- [保存] をクリックすることで設定を反映できます

## 開発者
### exe化
コマンドでpyinstallerを使用しています
```pyinstaller -F --add-data "templates:templates" --onefile --clean main.py```