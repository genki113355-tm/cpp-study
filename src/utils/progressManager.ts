/**
 * シロクマC++ラボ：学習進捗管理エンジン（レベル1：防衛的堅牢化）
 * - 実在性サニタイズ（カリキュラム更新時の不整合根絶）
 * - スキーマバージョン管理と旧フォーマット自動移行
 * - 機種変更・別ブラウザ連携用のワンクリック引継ぎコード（エクスポート/インポート）
 */

const STORAGE_KEY_V1 = 'cpp_progress_v1';
const LEGACY_STORAGE_KEY = 'cpp_completed_chapters';

export interface ProgressBackupData {
  version: 1;
  app: 'shirokuma-cpp';
  exportedAt: string;
  completedChapters: number[];
}

/**
 * 実在する章IDのみにフィルタリングし、重複・不正値を排除（サニタイズ）
 */
export function sanitizeCompletedChapters(raw: unknown, validIds: number[]): number[] {
  if (!Array.isArray(raw)) return [];
  const validSet = new Set(validIds);
  const sanitized = raw
    .map((item) => Number(item))
    .filter((num) => !isNaN(num) && validSet.has(num));
  return Array.from(new Set(sanitized)).sort((a, b) => a - b);
}

/**
 * ローカルストレージから進捗を安全に読み込み（自動マイグレーション＆サニタイズ）
 */
export function loadCompletedChapters(validIds: number[]): number[] {
  if (typeof window === 'undefined') return [];

  try {
    // 1. 新フォーマット（v1）の確認
    const v1Data = localStorage.getItem(STORAGE_KEY_V1);
    if (v1Data) {
      const parsed = JSON.parse(v1Data);
      if (parsed && Array.isArray(parsed.completedChapters)) {
        return sanitizeCompletedChapters(parsed.completedChapters, validIds);
      }
    }

    // 2. 旧フォーマット（legacy）からの自動移行
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyData) {
      const parsed = JSON.parse(legacyData);
      const sanitized = sanitizeCompletedChapters(parsed, validIds);
      // 新フォーマットへ自動マイグレーション保存
      saveCompletedChapters(sanitized, validIds);
      return sanitized;
    }
  } catch (err) {
    console.error('[ProgressManager] Failed to load progress:', err);
  }

  return [];
}

/**
 * 進捗データをローカルストレージへ安全に保存（サニタイズ済み）
 */
export function saveCompletedChapters(completed: number[], validIds: number[]): number[] {
  const sanitized = sanitizeCompletedChapters(completed, validIds);
  if (typeof window === 'undefined') return sanitized;

  try {
    const payload: ProgressBackupData = {
      version: 1,
      app: 'shirokuma-cpp',
      exportedAt: new Date().toISOString(),
      completedChapters: sanitized,
    };
    // 新フォーマット
    localStorage.setItem(STORAGE_KEY_V1, JSON.stringify(payload));
    // 後方互換性のため旧キーにも配列形式で保存
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('[ProgressManager] Failed to save progress:', err);
  }

  return sanitized;
}

/**
 * 別端末・別ブラウザへの引き継ぎ用コード（Base64テキスト）を生成
 */
export function generateBackupCode(completed: number[], validIds: number[]): string {
  const sanitized = sanitizeCompletedChapters(completed, validIds);
  const payload: ProgressBackupData = {
    version: 1,
    app: 'shirokuma-cpp',
    exportedAt: new Date().toISOString(),
    completedChapters: sanitized,
  };

  const jsonStr = JSON.stringify(payload);
  // UTF-8対応のBase64エンコード
  const base64 = btoa(encodeURIComponent(jsonStr));
  return `SKCP-V1:${base64}`;
}

/**
 * 引き継ぎコードから進捗を復元（バリデーション＆サニタイズ）
 */
export function restoreFromBackupCode(
  code: string,
  validIds: number[]
): { success: boolean; chapters?: number[]; message: string } {
  const trimmed = code.trim();
  if (!trimmed) {
    return { success: false, message: '引継ぎコードが入力されていません。' };
  }

  try {
    let base64Part = trimmed;
    if (trimmed.startsWith('SKCP-V1:')) {
      base64Part = trimmed.slice('SKCP-V1:'.length);
    }

    let parsed: any;
    const raw = atob(base64Part);
    try {
      parsed = JSON.parse(decodeURIComponent(raw));
    } catch {
      parsed = JSON.parse(raw);
    }

    if (parsed.app !== 'shirokuma-cpp' || !Array.isArray(parsed.completedChapters)) {
      return { success: false, message: 'このサイト（シロクマC++ラボ）の有効な引継ぎコードではありません。' };
    }

    const sanitized = sanitizeCompletedChapters(parsed.completedChapters, validIds);
    return {
      success: true,
      chapters: sanitized,
      message: `${sanitized.length}件の学習進捗を正常に復元しました！`,
    };
  } catch {
    return {
      success: false,
      message: 'コードの形式が正しくないか、破損しています。コピーした文字列を再度ご確認ください。',
    };
  }
}
