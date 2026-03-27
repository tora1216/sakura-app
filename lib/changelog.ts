export const APP_VERSION = "1.2.0";

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2026-03-17",
    title: "初回リリース 🎉",
    changes: [
      "営業担当者の月次実績・目標の入力機能",
      "管理者ダッシュボード（全体集計・月次グラフ・担当者別詳細）",
      "担当者管理（追加・削除）",
      "管理者ページへのBasic認証",
      "レスポンシブ対応",
    ],
  },
];
