// 平台偵測 + 載入對應字型（在 <head> 同步執行，避免字型閃爍）
//
//   web      中文：思源黑體 Noto Sans TC   英數：Montserrat   （Google Fonts）
//   ios      中文：蘋方 PingFang TC        英數：SF Pro       （系統內建，不需下載）
//   android  中文：思源黑體 Noto Sans TC   英數：Roboto       （Google Fonts）
//
// 測試用強制切換：網址加 ?platform=ios / android / web，auto = 恢復自動偵測
// 例：#/moderator?platform=android（會記在這台裝置的瀏覽器）
(function () {
  var KEY = 'proto-platform';
  var FONTS = {
    web: 'family=Montserrat:wght@300;400;500;600&family=Noto+Sans+TC:wght@400;500;700',
    android: 'family=Roboto:wght@300;400;500;700&family=Noto+Sans+TC:wght@400;500;700',
    ios: null,
  };

  function detect() {
    var ua = navigator.userAgent;
    // iPadOS 13+ 會偽裝成 Mac，用觸控點判斷
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    return 'web';
  }

  function readOverride() {
    var q = location.search + '&' + (location.hash.split('?')[1] || '');
    var m = q.match(/[?&]platform=(\w+)/);
    try {
      if (m && m[1] === 'auto') localStorage.removeItem(KEY);
      else if (m && FONTS.hasOwnProperty(m[1])) localStorage.setItem(KEY, m[1]);
      return localStorage.getItem(KEY);
    } catch (e) {
      return m && FONTS.hasOwnProperty(m[1]) ? m[1] : null;
    }
  }

  var platform = readOverride() || detect();
  document.documentElement.setAttribute('data-platform', platform);

  var families = FONTS[platform];
  if (families) {
    document.write(
      '<link rel="preconnect" href="https://fonts.googleapis.com">' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?' + families + '&display=swap">'
    );
  }
})();
