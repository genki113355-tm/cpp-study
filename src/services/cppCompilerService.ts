/**
 * C++ コンパイル＆実行サービス (Wandbox API & Godbolt URL Generator)
 */

export interface CompileResult {
  status: number; // 0 = 正常終了, 非0 = 実行時エラー / シグナル
  program_output?: string;
  program_error?: string;
  compiler_output?: string;
  compiler_error?: string;
  isSuccess: boolean; // コンパイルおよび実行が成功したか
  executionTimeMs?: number;
  rawResponse?: any;
}

export interface CompileOptions {
  compiler?: string; // デフォルト: 'gcc-head'
  stdVersion?: 'c++23' | 'c++20' | 'c++17';
  stdin?: string;
}

/**
 * Wandbox 公開 REST API を呼び出して C++ コードをコンパイル・実行する
 * （CORS 対応のためブラウザから直接リクエスト可能）
 */
export async function compileCppCode(
  code: string,
  options: CompileOptions = {}
): Promise<CompileResult> {
  const compiler = options.compiler || 'gcc-head';
  const stdFlag = options.stdVersion === 'c++17' ? 'gnu++17' : options.stdVersion === 'c++20' ? 'gnu++20' : 'gnu++2b';
  const compileOptions = `warning,${stdFlag}`;

  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20秒タイムアウト

    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        compiler,
        options: compileOptions,
        stdin: options.stdin || '',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Wandbox API returned HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const executionTimeMs = Math.round(performance.now() - startTime);

    const hasCompilerError = Boolean(data.compiler_error && data.compiler_error.trim().length > 0);
    const exitStatus = typeof data.status === 'number' ? data.status : (hasCompilerError ? 1 : 0);
    const isSuccess = exitStatus === 0 && !hasCompilerError;

    return {
      status: exitStatus,
      program_output: data.program_output || '',
      program_error: data.program_error || '',
      compiler_output: data.compiler_output || '',
      compiler_error: data.compiler_error || '',
      isSuccess,
      executionTimeMs,
      rawResponse: data,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    const isAbort = err.name === 'AbortError';

    return {
      status: -1,
      compiler_error: isAbort 
        ? '⚠️ コンパイルタイムアウト（20秒を超過しました。無限ループや過度なテンプレート展開がないか確認してください）' 
        : `⚠️ 実行サーバーとの通信に失敗しました: ${err.message || 'ネットワーク状態を確認してください'}`,
      isSuccess: false,
      executionTimeMs,
    };
  }
}

/**
 * Compiler Explorer (Godbolt) で開くための URL を生成
 */
export function createGodboltUrl(code: string): string {
  const clientState = {
    sessions: [
      {
        id: 1,
        language: 'c++',
        source: code,
        compilers: [
          {
            id: 'g141',
            options: '-O2 -std=c++23 -Wall',
          },
        ],
      },
    ],
  };

  try {
    const json = JSON.stringify(clientState);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return `https://godbolt.org/clientstate/${base64}`;
  } catch {
    return 'https://godbolt.org/';
  }
}

/**
 * Wandbox Web UI で開くための URL を生成
 */
export function createWandboxWebUrl(code: string): string {
  try {
    const encoded = encodeURIComponent(code);
    return `https://wandbox.org/?code=${encoded}`;
  } catch {
    return 'https://wandbox.org/';
  }
}
