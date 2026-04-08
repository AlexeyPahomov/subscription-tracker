/**
 * Синхронно выставляет класс `g-root_theme_*` на document.body по prefers-color-scheme
 * до разбора остального DOM — уменьшает мигание темы при theme="system".
 */
export const gravitySystemThemeInlineScript = `(function(){try{var d=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var b=document.body;if(!b)return;if(!b.classList.contains("g-root"))b.classList.add("g-root");var list=b.classList,r=[];for(var i=0;i<list.length;i++){var c=list[i];if(c.indexOf("g-root_theme_")===0)r.push(c)}for(var j=0;j<r.length;j++)b.classList.remove(r[j]);b.classList.add("g-root_theme_"+d)}catch(e){}})();`;
