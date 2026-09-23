/**
 * サイトが /cpp/ 配下で動作している場合（https://shirokuma-tech.jp/cpp/）でも画像が正しく解決されるようにするユーティリティ
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith('/cpp/')) {
    return cleanPath;
  }
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/cpp')) {
    return `/cpp${cleanPath}`;
  }
  return cleanPath;
};
