# 荷物追跡 v2.0.0
外部API・アカウント不要の静的PWA。配送状況は自動取得せず、受取状態は手動。追跡番号は端末内保存と選んだ公式サイトへの遷移に利用。
## 起動とテスト
静的HTTPサーバーで配信（Service Worker は HTTPS または localhost）。Node.js 20以上: node --test tests/core.test.mjs
## 更新
リリースごとに VERSION / NOTES、release.json、index.htmlのバージョンを更新。変更したJS/CSSは新しいファイル名にし、index.html・import・sw.jsのASSETSとCACHEを更新する。既存v1はService Workerが更新された後のナビゲーションで新画面に切り替わる。
## データ
tracking_history_v1 を維持。旧履歴が不正な場合は上書きせず元のJSONをバックアップ可能。バックアップは既存優先で追加。福山通運は公式照会画面で番号の手入力が必要。直リンクの動作は実機で確認し、変わった場合は公式サイト一覧を利用。
## 実機検収
スマホ・PC、旧履歴、候補、保存、追跡、編集、受取、検索、削除、バックアップ、オフライン、更新通知、ダークモード、キーボード。
## 公式情報（2026-11-25）
- https://www.post.japanpost.jp/receive/tracking/
- https://faq.kuronekoyamato.co.jp/app/answers/detail/a_id/1518/
- https://www.sagawa-exp.co.jp/howto-search/
- https://www.seino.co.jp/seino/tts/howto/
- https://corp.fukutsu.co.jp/receive/
