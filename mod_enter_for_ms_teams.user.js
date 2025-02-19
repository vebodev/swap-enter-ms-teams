// ==UserScript==
// @name            Modify Enter for Microsoft Teams
// @match           https://teams.microsoft.com/*
// @grant           none
// @namespace       https://github.com/vebodev/swap-enter-ms-teams
// @description     Mod Enter->Line Break, Ctrl-Enter->Send Message for Microsoft Teams
// @author          vebodev
// @license         MIT
// @homepage        https://github.com/vebodev/swap-enter-ms-teams
// @homepageURL     https://github.com/vebodev/swap-enter-ms-teams
// @downloadURL     https://github.com/vebodev/swap-enter-ms-teams/raw/master/mod-enter-ms-teams.user.js
// @updateURL       https://github.com/vebodev/swap-enter-ms-teams/raw/master/mod-enter-ms-teams.user.js
// @supportURL      https://github.com/vebodev/swap-enter-ms-teams/issues
// @icon            https://github.githubassets.com/pinned-octocat.svg
// @version         1.0.0
// @grant           none
// ==/UserScript==

(function() {
    'use strict';
    let isProcessing = false; // 防止递归的标记

    // 新增：检测提及弹窗是否可见
    function isMentionPopupOpen() {
        const popup = document.querySelector('div[data-tid="AutocompletePopup-Mentions"]');
        return popup && 
               popup.offsetParent !== null && // 检测可见性
               getComputedStyle(popup).display !== 'none';
    }

    function isEditor(target) {
        return target.closest('div[data-tid="ckeditor"][contenteditable="true"]');
    }

    function handleKeydown(e) {
        if (!isEditor(e.target) || isProcessing || isMentionPopupOpen()) return; // 新增检测条件

        isProcessing = true; // 开始处理

        try {
            // 处理普通Enter -> 转换为Shift+Enter
            if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const newEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true
                });
                e.target.dispatchEvent(newEvent);
            }

            // 处理Ctrl+Enter -> 转换为原生Enter
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                e.stopImmediatePropagation();

                const newEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    cancelable: true
                });
                e.target.dispatchEvent(newEvent);
            }
        } finally {
            isProcessing = false; // 重置标记
        }
    }

    // 单次事件绑定
    document.addEventListener('keydown', handleKeydown, {
        capture: true,
        passive: false
    });
})();

