// ==UserScript==
// @name         知乎增强
// @name:zh-CN   知乎增强
// @name:zh-TW   知乎增強
// @name:en      Zhihu enhancement
// @version      2.1.5
// @author       X.I.U
// @description  移除登录弹窗、屏蔽首页视频、默认收起回答、快捷收起回答/评论（左键两侧）、快捷回到顶部（右键两侧）、屏蔽用户、屏蔽关键词、移除高亮链接、屏蔽盐选内容、净化搜索热门、净化标题消息、展开问题描述、显示问题作者、置顶显示时间、完整问题时间、区分问题文章、直达问题按钮、默认高清原图、默认站外直链
// @description:zh-TW  移除登錄彈窗、屏蔽首頁視頻、默認收起回答、快捷收起回答/評論、快捷回到頂部、屏蔽用戶、屏蔽關鍵詞、移除高亮鏈接、屏蔽鹽選內容、淨化搜索熱門、淨化標題消息、置頂顯示時間、完整問題時間、區分問題文章、默認高清原圖、默認站外直鏈...
// @description:en  A more personalized Zhihu experience~
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://greasyfork.org/scripts/4122051
// @supportURL   https://github.com/XIU2/UserScript
// @homepageURL  https://github.com/XIU2/UserScript
// ==/UserScript==

'use strict';
var menu_ALL = [
    ['menu_defaultCollapsedAnswer', '默认收起回答', '默认收起回答', true],
    ['menu_collapsedAnswer', '一键收起回答', '一键收起回答', true],
    ['menu_collapsedNowAnswer', '快捷收起回答/评论 (点击两侧空白处)', '快捷收起回答/评论', true],
    ['menu_backToTop', '快捷回到顶部 (右键两侧空白处)', '快捷回到顶部', true],
    ['menu_blockUsers', '屏蔽指定用户', '屏蔽指定用户', true],
    ['menu_customBlockUsers', '自定义屏蔽用户', '自定义屏蔽用户', ['故事档案局', '盐选推荐', '盐选科普', '盐选成长计划', '知乎盐选会员', '知乎盐选创作者', '盐选心理', '盐选健康必修课', '盐选奇妙物语', '盐选生活馆', '盐选职场', '盐选文学甄选', '盐选作者小管家', '盐选博物馆', '盐选点金', '盐选测评室', '盐选科技前沿', '盐选会员精品']],
    ['menu_blockKeywords', '屏蔽指定关键词', '屏蔽指定关键词', true],
    ['menu_customBlockKeywords', '自定义屏蔽关键词', '自定义屏蔽关键词', []],
    ['menu_blockType', '屏蔽指定类别 (视频/文章等)', '勾选 = 屏蔽该类别的信息流', ''],
    ['menu_blockTypeVideo', '视频 [首页、搜索页、问题页]', '视频（首页、搜索页、问题页）', true],
    ['menu_blockTypeArticle', '文章 [首页、搜索页]', '文章（首页、搜索页）', false],
    ['menu_blockTypeTopic', '话题 [搜索页]', '话题（搜索页）', false],
    ['menu_blockTypeSearch', '杂志文章、相关搜索等 [搜索页]', '相关搜索、杂志等（搜索页）', false],
    ['menu_blockYanXuan', '屏蔽盐选内容', '屏蔽盐选内容', false],
    ['menu_cleanSearch', '净化搜索热门 (默认搜索词及热门搜索)', '净化搜索热门', false],
    ['menu_cleanTitles', '净化标题消息 (标题中的私信/消息)', '净化标题提醒', false],
    ['menu_questionRichTextMore', '展开问题描述', '展开问题描述', false],
    ['menu_publishTop', '置顶显示时间', '置顶显示时间', true],
    ['menu_typeTips', '区分问题文章', '区分问题文章', true],
    ['menu_toQuestion', '直达问题按钮', '直达问题按钮', true]
], menu_ID = [];
for (let i=0;i<menu_ALL.length;i++){ // 如果读取到的值为 null 就写入默认值
    if (GM_getValue(menu_ALL[i][0]) == null){GM_setValue(menu_ALL[i][0], menu_ALL[i][3])};
}
registerMenuCommand();

// 注册脚本菜单
function registerMenuCommand() {
    if (menu_ID.length > menu_ALL.length){ // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
        for (let i=0;i<menu_ID.length;i++){
            GM_unregisterMenuCommand(menu_ID[i]);
        }
    }
    for (let i=0;i<menu_ALL.length;i++){ // 循环注册脚本菜单
        menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
        if (menu_ALL[i][0] === 'menu_customBlockUsers') {
            if (menu_value('menu_blockUsers')) menu_ID[i] = GM_registerMenuCommand(`#?? ${menu_ALL[i][1]}`, function(){customBlockUsers()});
        } else if (menu_ALL[i][0] === 'menu_customBlockKeywords') {
            if (menu_value('menu_blockKeywords')) menu_ID[i] = GM_registerMenuCommand(`#?? ${menu_ALL[i][1]}`, function(){customBlockKeywords()});
        } else if (menu_ALL[i][0] === 'menu_blockType') {
            menu_ID[i] = GM_registerMenuCommand(`#?? ${menu_ALL[i][1]}`, function(){menu_setting('checkbox', menu_ALL[i][1], menu_ALL[i][2], true, [menu_ALL[i+1], menu_ALL[i+2], menu_ALL[i+3], menu_ALL[i+4]])});
        } else if (menu_ALL[i][0] != 'menu_blockTypeVideo' && menu_ALL[i][0] != 'menu_blockTypeArticle' && menu_ALL[i][0] != 'menu_blockTypeTopic' && menu_ALL[i][0] != 'menu_blockTypeSearch') {
            menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3]?'?':'?'} ${menu_ALL[i][1]}`, function(){menu_switch(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`,`${menu_ALL[i][2]}`)});
        }
    }
    menu_ID[menu_ID.length] = GM_registerMenuCommand('? 反馈 & 建议', function () {window.GM_openInTab('https://github.com/XIU2/UserScript#xiu2userscript', {active: true,insert: true,setParent: true});window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/419081/feedback', {active: true,insert: true,setParent: true});});
}


// 菜单开关
function menu_switch(menu_status, Name, Tips) {
    if (menu_status == 'true'){
        GM_setValue(`${Name}`, false);
        GM_notification({text: `已关闭 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});
    }else{
        GM_setValue(`${Name}`, true);
        GM_notification({text: `已开启 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});
    }
    registerMenuCommand(); // 重新注册脚本菜单
};


// 返回菜单值
function menu_value(menuName) {
    for (let menu of menu_ALL) {
        if (menu[0] == menuName) {
            return menu[3]
        }
    }
}


// 脚本设置
function menu_setting(type, title, tips, line, menu) {
    let _br = '', _html = `<style class="zhihuE_SettingStyle">.zhihuE_SettingRoot {position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);width: auto;min-width: 400px;max-width: 600px;height: auto;min-height: 150px;max-height: 400px;color: #535353;background-color: #fff;border-radius: 3px;}
.zhihuE_SettingBackdrop_1 {position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 203;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;overflow-x: hidden;overflow-y: auto;-webkit-transition: opacity .3s ease-out;transition: opacity .3s ease-out;}
.zhihuE_SettingBackdrop_2 {position: absolute;top: 0;right: 0;bottom: 0;left: 0;z-index: 0;background-color: rgba(18,18,18,.65);-webkit-transition: background-color .3s ease-out;transition: background-color .3s ease-out;}
.zhihuE_SettingRoot .zhihuE_SettingHeader {padding: 10px 20px;color: #fff;font-weight: bold;background-color: #3994ff;border-radius: 3px 3px 0 0;}
.zhihuE_SettingRoot .zhihuE_SettingMain {padding: 10px 20px;border-radius: 0 0 3px 3px;}
.zhihuE_SettingHeader span {float: right;cursor: pointer;}
.zhihuE_SettingMain input {margin: 10px 6px 10px 0;cursor: pointer;vertical-align:middle}
.zhihuE_SettingMain label {margin-right: 20px;user-select: none;cursor: pointer;vertical-align:middle}
.zhihuE_SettingMain hr {border: 0.5px solid #f4f4f4;}
[data-theme="dark"] .zhihuE_SettingRoot {color: #adbac7;background-color: #343A44;}
[data-theme="dark"] .zhihuE_SettingHeader {color: #d0d0d0;background-color: #2D333B;}
[data-theme="dark"] .zhihuE_SettingMain hr {border: 0.5px solid #2d333b;}</style>
        <div class="zhihuE_SettingBackdrop_1"><div class="zhihuE_SettingBackdrop_2"></div><div class="zhihuE_SettingRoot">
            <div class="zhihuE_SettingHeader">${title}<span class="zhihuE_SettingClose" title="点击关闭"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></span></div>
            <div class="zhihuE_SettingMain"><p>${tips}</p><hr>`
    if (line) _br = '<br>'
    for (let i=0; i<menu.length; i++) {
        if (GM_getValue(menu[i][0])) {
            _html += `<label><input name="zhihuE_Setting" type="checkbox" value="${menu[i][0]}" checked="checked">${menu[i][1]}</label>${_br}`
        } else {
            _html += `<label><input name="zhihuE_Setting" type="checkbox" value="${menu[i][0]}">${menu[i][1]}</label>${_br}`
        }
    }
    _html += `</div></div></div>`
    document.body.insertAdjacentHTML('beforeend', _html); // 插入网页末尾
    setTimeout(function() { // 延迟 100 毫秒，避免太快
        // 关闭按钮 点击事件
        document.querySelector('.zhihuE_SettingClose').onclick = function(){this.parentElement.parentElement.parentElement.remove();document.querySelector('.zhihuE_SettingStyle').remove();}
        // 点击周围空白处 = 点击关闭按钮
        document.querySelector('.zhihuE_SettingBackdrop_2').onclick = function(event){if (event.target == this) {document.querySelector('.zhihuE_SettingClose').click();};}
        // 复选框 点击事件
        document.getElementsByName('zhihuE_Setting').forEach(function (checkBox) {
            checkBox.addEventListener('click', function(){if (this.checked) {GM_setValue(this.value, true);} else {GM_setValue(this.value, false);}});
        })
    }, 100)
}


// 添加收起回答观察器
function getCollapsedAnswerObserver() {
    if (!window._collapsedAnswerObserver) {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.target.hasAttribute('script-collapsed')) return
                // 短的回答
                if (mutation.target.classList.contains('RichContent')) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType != Node.ELEMENT_NODE) continue
                        if (addedNode.className != 'RichContent-inner') continue
                        if (addedNode.offsetHeight < 400) break
                        const button = mutation.target.querySelector('.ContentItem-actions.Sticky [data-zop-retract-question]');
                        if (button) {
                            mutation.target.setAttribute('script-collapsed', '');
                            button.click();
                            return
                        }
                    }
                // 长的回答
                } else if (mutation.target.tagName === 'DIV' && !mutation.target.style.cssText && !mutation.target.className) {
                    if (mutation.target.parentElement.hasAttribute('script-collapsed')) return
                    const button = mutation.target.querySelector('.ContentItem-actions.Sticky [data-zop-retract-question]');
                    if (button) {
                        mutation.target.parentElement.setAttribute('script-collapsed', '');
                        button.click();
                        return
                    }
                }
            }
        })

        observer.start = function() {
            if (!this._active) {
                this.observe(document, { childList: true, subtree: true });
                this._active = true;
            }
        }
        observer.end = function() {
            if (this._active) {
                this.disconnect();
            }
        }

        window.addEventListener('urlchange', function() {
            observer[location.href.indexOf('/answer/') === -1 ? 'start' : 'end']();
        })
        window._collapsedAnswerObserver = observer;
    }
    return window._collapsedAnswerObserver
}


// 默认收起回答
function defaultCollapsedAnswer() {
    if (!menu_value('menu_defaultCollapsedAnswer')) return
    const observer = getCollapsedAnswerObserver();
    if (location.href.indexOf('/answer/') === -1) {
        observer.start();
    }
}


// 一键收起回答（全部）
function collapsedAnswer() {
    if (!menu_value('menu_collapsedAnswer')) return
    if (document.querySelector('.CornerAnimayedFlex') && !document.getElementById('collapsed-button')) {
        document.head.appendChild(document.createElement('style')).textContent = '.CornerButton{margin-bottom:8px !important;}.CornerButtons{bottom:45px !important;}';
        document.querySelector('.CornerAnimayedFlex').insertAdjacentHTML('afterBegin', '<button id="collapsed-button" data-tooltip="收起全部回答" data-tooltip-position="left" data-tooltip-will-hide-on-click="false" aria-label="收起全部回答" type="button" class="Button CornerButton Button--plain"><svg class="ContentItem-arrowIcon is-active" aria-label="收起全部回答" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.005z"></path></svg></button>');
        document.getElementById('collapsed-button').onclick = function () {
            if (location.pathname === '/' || location.pathname === '/hot' || location.pathname === '/follow') {
                document.querySelectorAll('.ContentItem-rightButton').forEach(function (el) {
                    if (el.hasAttribute('data-zop-retract-question')) {
                        el.click()
                    }
                });
            } else {
                document.querySelectorAll('[script-collapsed]').forEach(function(scriptCollapsed) {
                    scriptCollapsed.querySelectorAll('.ContentItem-actions [data-zop-retract-question], .ContentItem-actions.Sticky [data-zop-retract-question]').forEach(function(button) {
                        button.click();
                    })
                })
                document.querySelectorAll('.RichContent:not([script-collapsed]) .ContentItem-actions.Sticky [data-zop-retract-question]').forEach(function(button) {
                    let el = button.parentElement;
                    while (!el.classList.contains('RichContent')) {
                        el = el.parentElement;
                    }
                    if (el) {
                        el.setAttribute('script-collapsed', '');
                    }
                    button.click();
                })
                const observer = getCollapsedAnswerObserver();
                observer.start();
                if (!menu_value('menu_defaultCollapsedAnswer') && !observer._disconnectListener) {
                    window.addEventListener('urlchange', function() {
                        observer.end();
                        window._collapsedAnswerObserver = null;
                    })
                    observer._disconnectListener = true;
                }
            }
        }
    }
}


// 收起当前回答、评论（监听点击事件，点击网页两侧空白处）
function collapsedNowAnswer(selectors) {
    backToTop(selectors) // 快捷回到顶部
    if (!menu_value('menu_collapsedNowAnswer')) return
    document.querySelector(selectors).onclick = function(event){
        if (event.target == this) {
            // 下面这段主要是 [收起回答]，顺便 [收起评论]（如果展开了的话）
            let rightButton = document.querySelector('.ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom')
            if (rightButton) { // 悬浮在底部的 [收起回答]（此时正在浏览回答内容 [中间区域]）
                // 固定的 [收起评论]（先看看是否展开评论）
                let commentCollapseButton = rightButton.querySelector('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) commentCollapseButton.click();
                // 再去收起回答
                rightButton = rightButton.querySelector('.ContentItem-rightButton[data-zop-retract-question]')
                if (rightButton) rightButton.click();

            } else { // 固定在回答底部的 [收起回答]（此时正在浏览回答内容 [尾部区域]）

                // 悬浮的 [收起评论]（此时正在浏览评论内容 [中间区域]）
                //if (getXpath('//button[text()="收起评论"]',document.querySelector('.Comments-container'))) {getXpath('//button[text()="收起评论"]',document.querySelector('.Comments-container')).click();console.log('asfaf')}

                let answerCollapseButton_ = false;
                for (let el of document.querySelectorAll('.ContentItem-rightButton[data-zop-retract-question]')) { // 遍历所有回答底部的 [收起] 按钮
                    if (isElementInViewport(el)) { // 判断该 [收起] 按钮是否在可视区域内
                        // 固定的 [收起评论]（先看看是否展开评论，即存在 [收起评论] 按钮）
                        let commentCollapseButton = el.parentNode.querySelector('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                        // 如果展开了评论，就收起评论
                        //if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) commentCollapseButton.click();
                        if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                            commentCollapseButton.click();
                            if (!isElementInViewport(commentCollapseButton)) scrollTo(0,el.offsetTop+50)
                        }
                        el.click() // 再去收起回答
                        answerCollapseButton_ = true; // 如果找到并点击收起了，就没必要执行下面的代码了（可视区域中没有 [收起回答] 时）
                        break
                    }
                }
                // 针对完全看不到 [收起回答] 按钮时（如 [头部区域]，以及部分明明很长却不显示悬浮横条的回答）
                if (!answerCollapseButton_) {
                    for (let el of document.querySelectorAll('.List-item, .Card.AnswerCard, .Card.TopstoryItem')) { // 遍历所有回答主体元素
                        if (isElementInViewport_(el)) { // 判断该回答是否在可视区域内
                            // 固定的 [收起评论]（先看看是否展开评论，即存在 [收起评论] 按钮）
                            let commentCollapseButton = el.querySelector('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                            // 如果展开了评论，就收起评论
                            if (commentCollapseButton && commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                                commentCollapseButton.click();
                                if (!isElementInViewport(commentCollapseButton)) scrollTo(0,el.offsetTop+50)
                            }
                            let answerCollapseButton__ = el.querySelector('.ContentItem-rightButton[data-zop-retract-question]');
                            if (answerCollapseButton__) answerCollapseButton__.click() // 再去收起回答
                            break
                        }
                    }
                }
            }

            // 下面这段只针对 [收起评论]（如果展开了的话）
            let commentCollapseButton_ = false, commentCollapseButton__ = false;
            // 悬浮的 [收起评论]（此时正在浏览评论内容 [中间区域]）
            let commentCollapseButton = getXpath('//button[text()="收起评论"]',document.querySelector('.Comments-container'))
            if (commentCollapseButton) {
                commentCollapseButton.click();
            } else { // 固定的 [收起评论]（此时正在浏览评论内容 [头部区域]）
                let commentCollapseButton_1 = document.querySelectorAll('.ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type, .ContentItem-action > button.Button.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                if (commentCollapseButton_1.length > 0) {
                    for (let el of commentCollapseButton_1) {
                        if (el.textContent.indexOf('收起评论') > -1) {
                            if (isElementInViewport(el)) {
                                el.click()
                                commentCollapseButton_ = true // 如果找到并点击了，就没必要执行下面的代码了（可视区域中没有 [收起评论] 时）
                                break
                            }
                        }
                    }
                }
                if (commentCollapseButton_ == false) { // 可视区域中没有 [收起评论] 时（此时正在浏览评论内容 [头部区域] + [尾部区域](不上不下的，既看不到固定的 [收起评论] 又看不到悬浮的 [收起评论])），需要判断可视区域中是否存在评论元素
                    let commentCollapseButton_1 = document.querySelectorAll('.Comments-container')
                    if (commentCollapseButton_1.length > 0) {
                        for (let el of commentCollapseButton_1) {
                            if (isElementInViewport(el)) {
                                let parentElement = findParentElement(el, 'List-item') || findParentElement(el, 'Card '),
                                    commentCollapseButton = parentElement.querySelector('.ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                                if (commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                                    commentCollapseButton.click()
                                    if (!isElementInViewport(commentCollapseButton)) {console.log(parentElement,parentElement.offsetTop,parentElement.offsetHeight);scrollTo(0,parentElement.offsetTop+parentElement.offsetHeight-50)}
                                    commentCollapseButton__ = true // 如果找到并点击了，就没必要执行下面的代码了（可视区域中没有 评论元素 时）
                                    break
                                }
                            }
                        }
                    }
                    if (commentCollapseButton__ == false) { // 如果上面的都没找到，那么就尝试寻找评论末尾的 [评论回复框]
                        let commentCollapseButton_2 = document.querySelectorAll('.Editable-content')
                        if (commentCollapseButton_2.length > 0) {
                            for (let el of commentCollapseButton_2) {
                                if (isElementInViewport(el)) {
                                    let parentElement = findParentElement(el, 'List-item') || findParentElement(el, 'Card '),
                                    commentCollapseButton = parentElement.querySelector('.ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type')
                                    if (commentCollapseButton.textContent.indexOf('收起评论') > -1) {
                                        commentCollapseButton.click()
                                        if (!isElementInViewport(commentCollapseButton)) {console.log(parentElement,parentElement.offsetTop,parentElement.offsetHeight);scrollTo(0,parentElement.offsetTop+parentElement.offsetHeight-50)}
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


// 回到顶部（监听点击事件，鼠标右键点击网页两侧空白处）
function backToTop(selectors) {
    if (!menu_value('menu_backToTop')) return
    document.querySelector(selectors).oncontextmenu = function(event){
        if (event.target == this) {
            event.preventDefault();
            window.scrollTo(0,0)
        }
    }
}


//获取元素是否在可视区域（完全可见）
function isElementInViewport(el) {
    let rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
//获取元素是否在可视区域（部分可见）
function isElementInViewport_(el) {
    let rect = el.getBoundingClientRect();
    return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0
  );
}


// 自定义屏蔽用户
function customBlockUsers() {
    let nowBlockUsers = '';
    menu_value('menu_customBlockUsers').forEach(function(item){nowBlockUsers += '|' + item})
    let newBlockUsers = prompt('编辑 [自定义屏蔽用户]\n（不同用户名之间使用 "|" 分隔，例如：用户A|用户B|用户C ）', nowBlockUsers.replace('|',''));
    if (newBlockUsers === '') {
        GM_setValue('menu_customBlockUsers', []);
        registerMenuCommand(); // 重新注册脚本菜单
    } else if (newBlockUsers != null) {
        let newBlockUsers = '故事档案局|盐选推荐|盐选科普|盐选成长计划|知乎盐选会员|知乎盐选创作者|盐选心理|盐选健康必修课|盐选奇妙物语|盐选生活馆|盐选职场|盐选文学甄选|盐选作者小管家|盐选博物馆|盐选点金|盐选测评室|盐选科技前沿|盐选会员精品|象哥|老杨叔聊志愿填报|虎山行不行|弗兰克杨|我变成了一条狗|流浪的蛤蟆|曹多鱼|圆胖肿|心理突破与成长|宦海无声|安好心|pb|pansz|王可丹|职场升迁随笔|职场潜规则|睡前消息|宏桑|硅谷IT胖子|满分激光枪|';
        GM_setValue('menu_customBlockUsers', newBlockUsers.split('|'));
        registerMenuCommand(); // 重新注册脚本菜单
    }
};


// 屏蔽指定用户
function blockUsers(type) {
    if (!menu_value('menu_blockUsers')) return
    if (!menu_value('menu_customBlockUsers') || menu_value('menu_customBlockUsers').length < 1) return
    switch(type) {
        case 'index':
            blockUsers_('.Card.TopstoryItem.TopstoryItem-isRecommend', 'Card TopstoryItem TopstoryItem-isRecommend');
            break;
        case 'question':
            blockUsers_question();
            break;
        case 'search':
            blockUsers_search();
            break;
        case 'topic':
            blockUsers_('.List-item.TopicFeedItem', 'List-item TopicFeedItem');
            break;
        case 'people':
            blockUsers_button_people(); // 添加屏蔽用户按钮（用户主页）
            break;
    }
    blockUsers_comment(); //       评论区
    blockUsers_button(); //        加入黑名单按钮

    function blockUsers_(className1, className2) {
        // 前几条因为是直接加载的，而不是动态插入网页的，所以需要单独判断
        function blockKeywords_now() {
            document.querySelectorAll(className1).forEach(function(item1){
                let item = item1.querySelector('.ContentItem.AnswerItem, .ContentItem.ArticleItem'); // 用户名所在元素
                if (item) {
                    for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                        if (keyword != '' && item.dataset.zop.indexOf('authorName":"' + keyword + '",') > -1) { // 找到就删除该信息流
                            item1.hidden = true;
                            break;
                        }
                    }
                }
            })
        }

        blockKeywords_now();
        window.addEventListener('urlchange', function(){
            setTimeout(blockKeywords_now, 1000); // 网页 URL 变化后再次执行
        })

        // 这个是监听网页插入事件，用来判断后续网页动态插入的元素
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.className === className2) {
                        let item = target.querySelector('.ContentItem.AnswerItem, .ContentItem.ArticleItem'); // 用户名所在元素
                        if (item) {
                            for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                                if (keyword != '' && item.dataset.zop.indexOf('authorName":"' + keyword + '",') > -1) { // 找到就删除该信息流
                                    target.hidden = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    function blockUsers_question() {
        const blockUsers_question_ = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.className === 'List-item' || target.className === 'Card AnswerCard') {
                        let item1 = target.querySelector('.ContentItem.AnswerItem');
                        if (item1) {
                            menu_value('menu_customBlockUsers').forEach(function(item2){ // 遍历用户黑名单
                                if (item1.dataset.zop.indexOf('authorName":"' + item2 + '",') > -1) { // 找到就删除该回答
                                    target.hidden = true;
                                }
                            })
                        }
                    }
                }
            }
        };

        const blockUsers_question_answer_ = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    target.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
                        let item1 = item.querySelector('.ContentItem.AnswerItem');
                        if (item1) {
                            menu_value('menu_customBlockUsers').forEach(function(item2){ // 遍历用户黑名单
                                if (item1.dataset.zop.indexOf('authorName":"' + item2 + '",') > -1) { // 找到就删除该回答
                                    item.hidden = true;
                                }
                            })
                        }
                    })
                }
            }
        };

        if (location.pathname.indexOf('/answer/') > -1) { // 回答页（就是只有三个回答的页面）
            const observer = new MutationObserver(blockUsers_question_answer_);
            observer.observe(document, { childList: true, subtree: true });
        } else { // 问题页（可以显示所有回答的页面）
            const observer = new MutationObserver(blockUsers_question_);
            observer.observe(document, { childList: true, subtree: true });
        }

        // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
        document.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
            let item1 = item.querySelector('.ContentItem.AnswerItem');
            if (item1) {
                menu_value('menu_customBlockUsers').forEach(function(item2){ // 遍历用户黑名单
                    if (item1.dataset.zop.indexOf('authorName":"' + item2 + '",') > -1) { // 找到就删除该回答
                        item.hidden = true;
                    }
                })
            }
        })
    }

    function blockUsers_search() {
        function blockUsers_now() {
            if (location.search.indexOf('type=content') === -1) return // 目前只支持搜索页的 [综合]
            document.querySelectorAll('.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]').forEach(function(item1){
                let item = item1.querySelector('.RichText.ztext.CopyrightRichText-richText b'); // 用户名所在元素
                if (item) {
                    for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                        if (keyword != '' && item.textContent === keyword) { // 找到就删除该信息流
                            item1.hidden = true;
                            break;
                        }
                    }
                }
            })
        }

        setTimeout(blockUsers_now, 2000);
        window.addEventListener('urlchange', function(){
            setTimeout(blockUsers_now, 1000); // 网页 URL 变化后再次执行
        })

        const callback = (mutationsList, observer) => {
            if (location.search.indexOf('type=content') === -1) return // 目前只支持搜索页的 [综合]
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    let item = target.querySelector('.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"] .RichText.ztext.CopyrightRichText-richText b, .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"] .RichText.ztext.CopyrightRichText-richText b');
                    if (item) {
                        for (const keyword of menu_value('menu_customBlockUsers')) { // 遍历用户名黑名单
                            if (keyword != '' && item.textContent === keyword) { // 找到就删除该信息流
                                target.hidden = true;
                                break;
                            }
                        }
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }

    function blockUsers_comment() {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    let item = target.querySelector('img.Avatar[width="24"]')
                    if (item) {
                        menu_value('menu_customBlockUsers').forEach(function(item1){ // 遍历用户黑名单
                            if (item.alt === item1) { // 找到就删除该搜索结果
                                item.parentElement.parentElement.style.display = "none";
                            }
                        })

                        // 添加屏蔽用户按钮（点赞、回复等按钮后面）
                        /*if (item) {
                            let footer = findParentElement(item, 'CommentItemV2-meta', true).parentElement.querySelector('.CommentItemV2-metaSibling > .CommentItemV2-footer'),
                                userid = item.parentElement;
                            if (userid && footer && !footer.lastElementChild.dataset.name) {
                                userid = userid.href.split('/')[4];
                                footer.insertAdjacentHTML('beforeend',`<button type="button" data-name="${item.alt}" data-userid="${userid}" class="Button CommentItemV2-hoverBtn Button--plain"><span style="display: inline-flex; align-items: center;">&#8203;<svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(180deg); margin-right: 5px;"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>屏蔽用户</button>`);
                                footer.lastElementChild.onclick = function(){blockUsers_button_add(this.dataset.name, this.dataset.userid, false)}
                            }
                        }*/
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    // 添加屏蔽用户按钮（用户信息悬浮框中）
    function blockUsers_button() {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.className && (target.className.indexOf('Popover-content Popover-content--top HoverCard-popoverTarget') > -1 || target.className.indexOf('Popover-content Popover-content--bottom HoverCard-popoverTarget') > -1) || target.querySelector('.Popover-content.Popover-content--top.HoverCard-popoverTarget') || target.querySelector('.Popover-content.Popover-content--bottom.HoverCard-popoverTarget')) {
                        let item = target.querySelector('.MemberButtonGroup.ProfileButtonGroup.HoverCard-buttons'),
                            item1 = target.querySelector('a.UserLink-link'),
                            name = item1.textContent,
                            userid = item1.href.split('/')[4];
                        if (item && !target.querySelector('button[data-name][data-userid]')) {
                            item.insertAdjacentHTML('beforeend', `<button type="button" data-name="${name}" data-userid="${userid}" class="Button FollowButton Button--primary Button--red" style="width: 100%;margin: 7px 0 0 0;"><span style="display: inline-flex; align-items: center;">?<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>屏蔽用户</button>`);
                            item.lastElementChild.onclick = function(){blockUsers_button_add(this.dataset.name, this.dataset.userid, false)}
                        }
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }

    // 添加屏蔽用户按钮（用户主页）
    function blockUsers_button_people() {
        let item = document.querySelector('.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons'), // 获取按钮元素位置
            name = document.querySelector('.ProfileHeader-name').firstChild.textContent, // 获取用户名
            users = menu_value('menu_customBlockUsers'), // 读取屏蔽列表
            userid = location.href.split('/')[4];
        for (let num = 0;num<users.length;num++) { // 判断是否已存在
            if (users[num] === name) { // 已存在
                document.querySelectorAll('.Button.Button--primary.Button--red').forEach(function(item){item.style.display = 'none';}) // 隐藏知乎自带的已屏蔽按钮
                item.insertAdjacentHTML('beforeend', `<button type="button" data-name="${name}" data-userid="${userid}" class="Button FollowButton Button--primary Button--red" style="margin: 0 0 0 12px;"><span style="display: inline-flex; align-items: center;">?<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>取消屏蔽</button>`);
                item.lastElementChild.onclick = function(){blockUsers_button_del(this.dataset.name, this.dataset.userid, true)}
                return
            }
        };
        if (item) {
            item.insertAdjacentHTML('beforeend', `<button type="button" data-name="${name}" data-userid="${userid}" class="Button FollowButton Button--primary Button--red" style="margin: 0 0 0 12px;"><span style="display: inline-flex; align-items: center;">?<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>屏蔽用户</button>`);
            item.lastElementChild.onclick = function(){blockUsers_button_add(this.dataset.name, this.dataset.userid, true)}
        }
    }

    // 屏蔽用户按钮绑定事件（添加）
    function blockUsers_button_add(name, userid, reload) {
        if (!name || !userid) return
        let users = menu_value('menu_customBlockUsers'), // 读取屏蔽列表
            index = users.indexOf(name);
        if (index === -1) {
            users.push(name); // 追加用户名
            GM_setValue('menu_customBlockUsers', users); // 写入屏蔽列表
            // 加入知乎自带的黑名单（和本脚本互补~
            GM_xmlhttpRequest({url: `https://www.zhihu.com/api/v4/members/${userid}/actions/block`,method: 'POST',timeout: 2000});
            // 是否刷新本页
            if (reload) {
                setTimeout(function(){location.reload()}, 200); // 刷新网页，延迟 200 毫秒，避免知乎反应慢~
            } else {
                GM_notification({text: `该用户已被屏蔽~\n刷新网页后生效~`, timeout: 3000});
            }
        } else {
            GM_notification({text: `该用户已经被屏蔽啦，无需重复屏蔽~`, timeout: 3000});
        }
    }


    // 屏蔽用户按钮绑定事件（删除）
    function blockUsers_button_del(name, userid, reload) {
        if (!name || !userid) return
        let users = menu_value('menu_customBlockUsers'), // 读取屏蔽列表
            index = users.indexOf(name);
        if (index > -1) {
            users.splice(index, 1); // 移除用户名
            GM_setValue('menu_customBlockUsers', users); // 写入屏蔽列表
            // 移除知乎自带的黑名单
            GM_xmlhttpRequest({url: `https://www.zhihu.com/api/v4/members/${userid}/actions/block`,method: 'DELETE',timeout: 2000});
            // 是否刷新本页
            if (reload) {
                setTimeout(function(){location.reload()}, 200); // 刷新网页，延迟 200 毫秒，避免知乎反应慢~
            } else {
                GM_notification({text: `该用户已取消屏蔽啦~\n刷新网页后生效~`, timeout: 3000});
            }
        } else {
            GM_notification({text: `没有在屏蔽列表中找到该用户...`, timeout: 3000});
        }
    }
}


// 自定义屏蔽关键词（标题）
function customBlockKeywords() {
    let nowBlockKeywords = '';
    menu_value('menu_customBlockKeywords').forEach(function(item){nowBlockKeywords += '|' + item})
    let newBlockKeywords = prompt('编辑 [自定义屏蔽关键词]\n（不同关键词之间使用 "|" 分隔，例如：关键词A|关键词B|关键词C \n（关键词不区分大小写，支持表情如：[捂脸]|[飙泪笑]', nowBlockKeywords.replace('|',''));
    if (newBlockKeywords === '') {
        GM_setValue('menu_customBlockKeywords', []);
        registerMenuCommand(); // 重新注册脚本菜单
    } else if (newBlockKeywords != null) {
        let newBlockKeywords = '光圈|亲子鉴定|默克尔|死亡|回民|减肥|俄罗斯|退休金|貂蝉|溥仪|闺蜜|乌鸦|基金|奥运|战争|绿茶|穿越|表情包|白敬亭|HPV|艾尔登法环|讨薪|盐选会员|徒步|表盘|股灾|英雄联盟|郑爽|口袋怪物|武松|扫黑风暴|婴儿|电竞|殡葬|小品|快乐大本营|吴谢宇|星座|自杀|pua|不想上班|猫粮|李鸿章|打仗|搞笑|东航|空乘|羽生结弦|震撼|恶心|海瑞|原神|边牧|盲人|约会|笑傲江湖|西港|狗粮|陈世美|绝望|八卦|跨性别者|被骗|生育率|失恋|缅甸|电影|漫画|爱豆|情话|刷单|黄渤|产后|黑社会|座山雕|冤枉|绘本|白羊座|周星驰|黄家驹|杨丽娟|张艺兴|葡萄酒|INTP|诡秘之主|荒岛|散户|服刑|用工荒|公知|高育良|师生恋|蔡徐坤|唐国强|三十而已|张维为|天秤|比特币|贴吧|配音|风骚|鹿晗|医美|欺负|猫|刘华强|画师|军婚|时代少年团|鬼故事|拉黑|魔兽|键政|陈道明|毛骨悚然|生个孩子|钟南山|乌军|姐弟恋|米哈游|吕后|巨人|何超莲|INFP|儒家|反派|宠物|钢琴|欺凌|猥琐|相亲|内卷|流水线工人|腿毛|唐僧|美食|去世|家有儿女|大专|女性购房|全职妈妈|举重|王嘉尔|骂|辛巴|斯基|LPL|原生家庭|死后|金瓶梅|寝室|混日子|剧本杀|早恋|美军|知否|刘鑫|争宠|教培|顿巴斯|热巴|A股|AirPods|祁同伟|冤案|查重|刘畊宏|北电|博尔特|马嘉祺|流浪地球|黑暗|屠宰|MBTI|网贷|伏地魔|交响乐|渣男|追星|大明王朝|张爱玲|催婚|剥削|带货|冰墩|睡前消息|作死|章泽天|暧昧|老实人|蒋欣|茶叶|入侵|朱一旦|哀伤|乐高|林妙可|电梯|死心|侵华|伴娘|斗罗大陆|小三|广告|陈丹青|裁员|禁毒|许嵩|外貌|魅族|996|林丹|三胎|币圈|宝妈|小米|释永信|伊利|空调|白鹿原|房贷|抗战|侵略|cos|戒赌|饭圈|左宗棠|娱乐圈|华为|杀手|吃播|沙雕|黄磊|魔法|水瓶座|小故事|核弹|杀人|护士|绘圈|月子|按摩|杨笠|学生会|熊出没|焦虑|uzi|在意|张艺谋|同性恋|女仆|二胎|生育|死侍|篮球|追了很多女生|佛|房东|军训|电视剧|歌曲|细思极恐|筋膜枪|足球|甜文|烂尾楼|方方|同居|乌克兰|水浒|乒乓|足浴|网红|红米|偷拍|艳遇|理财|严刑拷打|张怡宁|择偶|女权|幽门螺旋|男朋友|鹿鼎记|舰长|声乐|心机婊|槟榔|单亲|王力宏|动画|易烊千玺|巴基斯坦|生孩子|生日|打架|哈士奇|刘亦菲|粉丝|明朝|产假|柴静|卫生间|笑死人|喜羊羊|国产剧|复仇|丁真|仇富|格斗|1450|资本家|讨厌|生小孩|虐|李佳琦|亮剑|司机|八小时工作|男足|骇人听闻|日漫|丁俊晖|泰国|还珠格格|演员|团长|地狱|张韶涵|糜烂|狼|替身|老赖|傻子|射手座|虚拟币|张子强|足疗|手机|港片|房价|财阀|离世|小奶狗|碎尸|EDG|吸奶|乌合|姚安娜|崔永元|黄蓉|易经|斗破苍穹|cp|甄嬛|黄药师|谷爱凌|香烟|皇帝|显示器|失业|沪指|仙剑|卧底|耳机|军旅|上帝|龙珠|圣母|吴京|炒股|买房|颜值|私房|主播|家务|魔戒|戒色|双子座|出轨|疫情|快手|负债|挽回|辍学|批评|梁山|动物保护|杜兰特|抗美援朝|人贩子|冰雪奇缘|陈奕迅|鬼|薇娅|走光|黑人|马丽|芒果|寒窗|说唱|朱元璋|丧尸|电子烟|累|武林外传|传销|养生|彩礼|明日方舟|房产税|缅北|润|欧阳娜娜|羊奶|国脚|缘分|倪萍|天蝎座|孙悟空|羽毛球|刘浩存|明星|追女生|资本论|武器|无耻|孟美岐|八小时双休|慢跑|国足|金牛|王思聪|超能力|中兴|养老|吴亦凡|黑头|月嫂|段子|残疾|大明劫|歌手|杨超越|修仙|李云龙|俄军|海王|病娇|杀猪盘|陈世峰|吸毒|贝克汉姆|产房|瑜伽裤|网文|躺平|肖战|笔记本|间谍|周杰伦|穷|烂尾|疫苗|开战|郑云龙|加班|婚姻|贾静雯|超人|金灿荣|亲爱的|合租|肝癌|甜宠|封校|剩女|自闭|邓伦|夜店|INTJ|哈利|出生|整容|宋冬野|张国荣|宠文|恐惧|抖音|赌博|杨丽萍|李赛高|和亲|体检|爽文|看守所|欧冠|性别对立|霸总|化妆|二孩|NBA|亚马逊|癌|内奸|狮子座|亚美尼亚|离职|阎王|房思琪|曹丰泽|九价|红楼梦|赵今麦|酒店|窒息|海贼王|县城|邓文迪|李连杰|食堂|健身|战锤|马航|琅琊榜|动漫|追我的男生|妃|蒙古|金军|运气|调休|女神|低谷|宋江|谭乔|火葬场|开除|公益|王志文|跑步|约稿|灵堂|邪念|全聚德|凯迪拉克|迁就|自卑|外卖|哪吒|手枪|子弹|维生素|剧情|女配|男主|绿卡|辅警|上官|游戏|带娃|屁|舞蹈|搭讪|孕期|军官|人民的名义|钟薛高|比特币|礼物|网吧|数码宝贝|断舍离|脾气不好|索尼|清真寺|焊工|韩剧|没教养|显卡|唐山烧烤|劳务派遣|劳动仲裁|塔利班|光棍|香港|恒大|世界杯|曹操|朴树|日语|江歌|台湾|湖南卫视|韦东奕|藏族|独居|普洱茶|蘑菇|LOL|黑袍纠察队|高晓松|丐帮|金庸|暑假工|马云的崩塌|台湾|抑郁|希特勒|林冲|裙子|诈骗|公务员|长得丑|恐怖|痘印|Nike|耐克|花柳|音乐|摩羯座|冒险岛|校服|奇异博士|老友记|中考|防晒|静香|全红婵|胖子|怀孕|图书馆|背单词|驾照|镖客|尴尬|青储|余秀华|安踏|新番|头像|结婚|母乳|新概念英语|灾荒|吸星大法|北冥神功|肯德基|老龄化|退休|乐器|朴秀荣|已婚|酷刑|身高|德善|垃圾分类|同人|悲哀|志愿军|子宫|国军|中华民国|国民党|综艺|爬山|攀岩|啃老|北约|长残了|人养玉|回避|藏语|今麦郎|凉白开|周冬雨|彭于晏|考公|撒贝宁|李世民|休学|彩虹六号|傻逼|纪晓岚|护肤|无力|pb|照骗|防晒|厅局风|不婚主义|小说|车位|消防|咖啡|睡前故事|运动员|晋江|八段锦|刷酸|镇长|星巴克|爱情公寓|生完孩子|梦华录|约翰可汗|安乐死|枪支|伊朗|右翼|国防部|农业部|赖宁|郑成功|脱口秀|汉奸|堕胎|刺杀|冰壶|顿涅茨克|卢甘斯克|孔家店|莫言|立陶宛|插旗菜业|春晚|尼赫鲁|康熙|粟裕|玛雅|金智秀|大瓜|崩坏|生发液|排泄|黑眼圈|iPhone|股票|武将|上尉|戏曲|灌篮高手|战斗机|道士|俄乌|杨幂|宿舍|RNG|新歌|破事精英|于谦|华约|王漫妮|卫生巾|朝鲜|离婚|酒桌|迦太基|白嫖|林青霞|姚明|湖人|科比|禁枪|郭靖|满族|赖座|驾校|温网|家暴|肝硬化|陈晓|薛宝钗|林黛玉|鲁滨逊|严屹宽|褪黑素|王者荣耀|四驱兄弟|产科|火影|幼师|乔丹|乌方|赫尔松|韩语|悲观|张杰|林俊杰|渣女|太原|羞愧|尹天仇|喜剧之王|何以笙箫默|何以琛|听力|萝莉|老年痴呆|失禁|贾平凹|贾浅浅|冯唐|汤唯|男篮|阿富|戴笠|马未都|张若昀|郭德纲|编剧|红卫兵|男团|分娩|杨玉环|圣斗士|王菲|糖尿病|les|MIUI|腿长|奥尼尔|董明珠|坦克|DOTA|跆拳道|专升本|考研|纵火|柯洁|订婚|股市|结石|毁三观|士兵突击|冯巩|岳云鹏|徐艺洋|彝族|德云社|赵丽颖|本兮|过世|陈妍希|孙杨|赵露思|鲁豫|唐仁杰|守望先锋|DM|明日方舟|小三|男A|出过轨|杜月笙|张作霖|苏联|雪中|东方不败|梅西|C罗|普京|布达拉宫|扶弟魔|初三|包贝尔|包文婧|赵本山|刘邦|圆明园|围棋|王冰冰|射雕|献血|古装|汪小菲|张飞|关羽|刘备|罗贯中|何同学|关晓彤|李玉刚|暗黑破坏神|王传君|内马尔|植发|抽烟|哲学|赵薇|詹姆斯|盗墓|清史|胡适|鱼翅|李达康|阿富汗|彭宇|方便面|胡锡进|仇日|吕小军|黄多多|大叔控|竹鼠|杨紫|梦幻西游|北欧|霍思燕|杜江|向太|陈岚|乾隆|三国演义|少林|王一博|奥特曼|崇祯|任盈盈|梅西|马拉多纳|';
        GM_setValue('menu_customBlockKeywords', newBlockKeywords.split('|'));
        registerMenuCommand(); // 重新注册脚本菜单
    }
};


// 屏蔽指定关键词
function blockKeywords(type) {
    if (!menu_value('menu_blockKeywords')) return
    if (!menu_value('menu_customBlockKeywords') || menu_value('menu_customBlockKeywords').length < 1) return
    switch(type) {
        case 'index':
            blockKeywords_('.Card.TopstoryItem.TopstoryItem-isRecommend', 'Card TopstoryItem TopstoryItem-isRecommend');
            break;
        case 'topic':
            blockKeywords_('.List-item.TopicFeedItem', 'List-item TopicFeedItem');
            break;
        case 'people':
            blockKeywords_('.List-item', 'List-item');
            break;
        case 'collection':
            blockKeywords_('.Card.CollectionDetailPageItem', 'Card CollectionDetailPageItem');
            break;
        case 'search':
            blockKeywords_search();
            break;
        case 'comment':
            blockKeywords_comment();
            break;
    }


    function blockKeywords_(className1, className2) {
        // 前几条因为是直接加载的，而不是动态插入网页的，所以需要单独判断
        function blockKeywords_now() {
            if (location.pathname === '/hot') {
                document.querySelectorAll('.HotItem').forEach(function(item1){blockKeywords_1(item1, 'h2.HotItem-title');})
            } else {
                document.querySelectorAll(className1).forEach(function(item1){blockKeywords_1(item1, 'h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"]');})
            }
        }

        blockKeywords_now();
        window.addEventListener('urlchange', function(){
            setTimeout(blockKeywords_now, 1000); // 网页 URL 变化后再次执行
        })

        // 这个是监听网页插入事件，用来判断后续网页动态插入的元素
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.className === className2) {blockKeywords_1(target, 'h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"]');}
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    function blockKeywords_search() {
        function blockKeywords_now() {
            if (location.search.indexOf('type=content') === -1) return // 目前只支持搜索页的 [综合]
            document.querySelectorAll('.HotLanding-contentItem, .Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]').forEach(function(item1){blockKeywords_1(item1, 'a[data-za-detail-view-id]');})
        }

        setTimeout(blockKeywords_now, 2000);
        window.addEventListener('urlchange', function(){
            setTimeout(blockKeywords_now, 1000); // 网页 URL 变化后再次执行
        })

        const callback = (mutationsList, observer) => {
            if (location.search.indexOf('type=content') === -1) return // 目前只支持搜索页的 [综合]
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    if (target.className === 'Card SearchResult-Card' && (target.dataset.zaDetailViewPathModule === 'AnswerItem' || target.dataset.zaDetailViewPathModule === 'PostItem')) {blockKeywords_1(target, 'a[data-za-detail-view-id]');}
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }


    function blockKeywords_comment() {
        function filterComment(comment) {
            let content = comment.querySelector('.RichText'); // 寻找评论文字所在元素
            let texts = [content.textContent.toLowerCase()]; // 因为要针对评论中的表情，所以需要整个数组并全部转为小写（用来不区分大小写）
            for (let i = 0; i < content.children.length; i++) { // 该条针对的是评论中的表情
                let emoticonValue = content.children[i].getAttribute('data-zhihu-emoticon'); // 确定是表情就将其添加到稍后遍历的数组中
                if (emoticonValue) {
                    texts.push(emoticonValue)
                }
            }

            let keywords = menu_value('menu_customBlockKeywords');
            for (const text of texts) {
                for (const keyword of keywords) { // 遍历关键词黑名单
                    if (keyword != '' && text.indexOf(keyword.toLowerCase()) > -1) { // 找到就删除该评论
                        content.textContent = '[该评论已屏蔽]';
                        break;
                    }
                }
            }
        }

        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType != 1) return
                    for (const node of target.querySelectorAll('*')) {
                        if (node.className === 'CommentItemV2-metaSibling') filterComment(node);
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }

    function blockKeywords_1(item1, css) {
        let item = item1.querySelector(css); // 标题所在元素
        if (item) {
            for (const keyword of menu_value('menu_customBlockKeywords')) { // 遍历关键词黑名单
                let text = item.content || item.textContent;
                if (keyword != '' && text.toLowerCase().indexOf(keyword.toLowerCase()) > -1) { // 找到就删除该信息流
                    item1.hidden = true;
                    item1.style.display = 'none';
                    break;
                }
            }
        }
    }
}


// 屏蔽指定类别（视频/文章等）
function blockType(type) {
    let name;
    // 一开始加载的信息流 + 添加标签样式
    if (type === 'search') { // 搜索页
        if (!menu_value('menu_blockTypeVideo') && !menu_value('menu_blockTypeArticle') && !menu_value('menu_blockTypeTopic') && !menu_value('menu_blockTypeSearch')) return
        if (menu_value('menu_blockTypeSearch') && location.pathname === '/search') setTimeout(function(){document.querySelector('.RelevantQuery').parentElement.parentElement.hidden = true;}, 2000)
        name = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a'
        addSetInterval_(name);
    } else if (type === 'question') { // 问题页
        if (!menu_value('menu_blockTypeVideo')) return
        document.lastChild.appendChild(document.createElement('style')).textContent = `.VideoAnswerPlayer, .VideoAnswerPlayer-video, .VideoAnswerPlayer-iframe {display: none !important;}`;
        name = '.VideoAnswerPlayer'
        document.querySelectorAll(name).forEach(function(item){blockType_(item);})
    } else { // 首页
        if (!menu_value('menu_blockTypeVideo') && !menu_value('menu_blockTypeArticle')) return
        if (menu_value('menu_blockTypeVideo')) document.lastChild.appendChild(document.createElement('style')).textContent = `.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}`;
        name = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion)'
        document.querySelectorAll(name).forEach(function(item){blockType_(item);})
    }

    // 后续加载的信息流
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                blockType_(target.querySelector(name));
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

    window.addEventListener('urlchange', function(){
        addSetInterval_(name);
        // 移除相关搜索
        if (menu_value('menu_blockTypeSearch') && location.pathname === '/search' && location.search.indexOf('type=content') > -1) setTimeout(function(){document.querySelector('.RelevantQuery').parentElement.parentElement.hidden = true;}, 1500)
    })

    function blockType_(titleA) {
        if (!titleA) return // 判断是否为真
        if (location.pathname === '/search') { // 搜索页
            if (location.search.indexOf('type=content') === -1) return //   仅限搜索页的 [综合]
            if (titleA.href.indexOf('/zvideo/') > -1 || titleA.href.indexOf('video.zhihu.com') > -1) { //                  如果是视频
                if (menu_value('menu_blockTypeVideo')) findParentElement(titleA, 'Card').hidden = true;
            } else if (titleA.href.indexOf('zhuanlan.zhihu.com') > -1) { // 如果是文章
                if (menu_value('menu_blockTypeArticle')) findParentElement(titleA, 'Card SearchResult-Card').hidden = true;
            } else if (titleA.href.indexOf('/topic/') > -1) { //            如果是话题
                if (menu_value('menu_blockTypeTopic')) findParentElement(titleA, 'Card SearchResult-Card').hidden = true;
            } else if (titleA.href.indexOf('/market/') > -1) { //           如果是杂志文章等乱七八糟的
                if (menu_value('menu_blockTypeArticle')) findParentElement(titleA, 'Card SearchResult-Card').hidden = true;
            }
        } else if (location.pathname.indexOf('/question/') > -1) { // 问题页
            if (menu_value('menu_blockTypeVideo')) findParentElement(titleA, 'List-item').hidden = true;
        } else { // 首页
            if (titleA.href.indexOf('/zvideo/') > -1 || titleA.href.indexOf('video.zhihu.com') > -1) { //                  如果是视频
                if (menu_value('menu_blockTypeVideo')) findParentElement(titleA, 'Card TopstoryItem TopstoryItem-isRecommend').hidden = true;
            } else if (titleA.href.indexOf('/answer/') > -1) { //           如果是问题（视频回答）
                if (findParentElement(titleA, 'ContentItem AnswerItem').querySelector('.VideoAnswerPlayer')) {
                    if (menu_value('menu_blockTypeVideo')) findParentElement(titleA, 'Card TopstoryItem TopstoryItem-isRecommend').hidden = true;
                }
            } else if (titleA.href.indexOf('/education/video-course/') > -1) { // 如果是視頻課程
                if (menu_value('menu_blockTypeVideo')) findParentElement(titleA, 'Card TopstoryItem TopstoryItem-isRecommend').hidden = true;
            } else if (titleA.href.indexOf('zhuanlan.zhihu.com') > -1) { // 如果是文章
                if (menu_value('menu_blockTypeArticle')) findParentElement(titleA, 'Card TopstoryItem TopstoryItem-isRecommend').hidden = true;
            }
        }
    }

    function addSetInterval_(A) {
        let timer = setInterval(function(){
            let aTag = document.querySelectorAll(A);
            if (aTag.length > 0) {
                clearInterval(timer);
                aTag.forEach(function(item){blockType_(item);})
            }
        });
    }
}


// 寻找父元素
function findParentElement(item, className, type = false) {
    if (item.parentElement) {
        if (type) { // true = 完全一致，false = 包含即可
            if (item.parentElement.className && item.parentElement.className === className) {
                return item.parentElement;
            } else {
                let temp = findParentElement(item.parentElement, className, true)
                if (temp) return temp
            }
        } else {
            if (item.parentElement.className && item.parentElement.className.indexOf(className) > -1) {
                return item.parentElement;
            } else {
                let temp = findParentElement(item.parentElement, className)
                if (temp) return temp
            }
        }
    }
    return
}


// 移除高亮链接
function removeHighlightLink() {
    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1 || target.tagName != 'A') break
                if (target.dataset.zaNotTrackLink && target.href.indexOf('https://www.zhihu.com/search?q=') > -1) {
                    target.parentElement.replaceWith(target.textContent);
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document, { childList: true, subtree: true });

    // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
    document.querySelectorAll('span > a[data-za-not-track-link][href^="https://www.zhihu.com/search?q="]').forEach(e => e.parentElement.replaceWith(e.textContent))
}


// 屏蔽盐选内容
function blockYanXuan() {
    if (!menu_value('menu_blockYanXuan')) return
    const blockYanXuan_question = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                if (target.className === 'List-item' || target.className === 'Card AnswerCard') {
                    if (target.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
                        target.hidden = true;
                    }
                }
            }
        }
    };

    const blockYanXuan_question_answer = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                target.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
                    if (item.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
                        item.hidden = true;
                    }
                })
            }
        }
    };

    if (location.pathname.indexOf('/answer/') > -1) { // 回答页（就是只有三个回答的页面）
        const observer = new MutationObserver(blockYanXuan_question_answer);
        observer.observe(document, { childList: true, subtree: true });
    } else { // 问题页（可以显示所有回答的页面）
        const observer = new MutationObserver(blockYanXuan_question);
        observer.observe(document, { childList: true, subtree: true });
    }

    // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
    document.querySelectorAll('.List-item, .Card.AnswerCard').forEach(function(item){
        if (item.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
            item.hidden = true;
        }
    })
}


// 区分问题文章
function addTypeTips() {
    if (!menu_value('menu_typeTips')) return
    let style = `font-weight: bold;font-size: 13px;padding: 1px 4px 0;border-radius: 2px;display: inline-block;vertical-align: top;margin: ${(location.pathname === '/search') ? '2' : '4'}px 4px 0 0;`
    document.body.appendChild(document.createElement('style')).textContent = `/* 区分问题文章 */
.AnswerItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
.TopstoryQuestionAskItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #ff5a4e;background-color: #ff5a4e33;${style}}
.ZVideoItem .ContentItem-title a::before, .ZvideoItem .ContentItem-title a::before {content:'视频';color: #00BCD4;background-color: #00BCD433;${style}}
.ArticleItem .ContentItem-title a::before {content:'文章';color: #2196F3;background-color: #2196F333;${style}}`;
}


// 直达问题按钮
function addToQuestion() {
    if (!menu_value('menu_toQuestion')) return

    // 一开始加载的信息流 + 添加按钮样式
    if (location.pathname === '/search') {
        document.lastChild.appendChild(document.createElement('style')).textContent = `a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;height: 20.67px !important;line-height: 20.67px !important;margin-top: 2px !important;}`;
        addSetInterval_('h2.ContentItem-title a:not(.zhihu_e_tips)');
    } else {
        document.lastChild.appendChild(document.createElement('style')).textContent = `a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;margin-top: 4px !important;}`;
        document.querySelectorAll('h2.ContentItem-title a:not(.zhihu_e_tips)').forEach(function(item){addTypeTips_(item);})
    }

    // 后续加载的信息流
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                addTypeTips_(target.querySelector('h2.ContentItem-title a:not(.zhihu_e_tips)'));
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

    window.addEventListener('urlchange', function(){
        addSetInterval_('h2.ContentItem-title a:not(.zhihu_e_tips)');
    })

    function addTypeTips_(titleA) {
        if (!titleA) return // 判断是否为真
        if (titleA.parentElement.querySelector('a.zhihu_e_toQuestion')) return // 判断是否已添加
        if (titleA.textContent.indexOf('?') != -1) { // 把问题末尾英文问好 [?] 的替换为中文问好 [？]，这样按钮与标题之间的间距就刚刚好~
            titleA.innerHTML = titleA.innerHTML.replace('?', "？")
        }
        if (/answer\/\d+/.test(titleA.href)) { //  如果是指向回答的问题（而非指向纯问题的链接）
            titleA.insertAdjacentHTML('afterend', `<a class="zhihu_e_toQuestion VoteButton" href="${titleA.parentElement.querySelector('meta[itemprop="url"]').content}" target="_blank">直达问题</a>`);
        }
    }

    function addSetInterval_(A) {
        let timer = setInterval(function(){
            let aTag = document.querySelectorAll(A);
            if (aTag.length > 0) {
                clearInterval(timer);
                aTag.forEach(function(item){addTypeTips_(item);})
            }
        });
    }
}


// 展开问题描述
function questionRichTextMore() {
    if (!menu_value('menu_questionRichTextMore')) return
    let button = document.querySelector('button.QuestionRichText-more');
    if (button) button.click()
}


// 知乎免登录
function removeLogin() {
    const removeLoginModal = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                if (target.querySelector('.signFlowModal')) {
                    let button = target.querySelector('.Button.Modal-closeButton.Button--plain');
                    if (button) button.click();
                } else if (getXpath('//button[text()="立即登录/注册"]',target)) {
                    target.remove();
                }
            }
        }
    };

    // 未登录时才会监听并移除登录弹窗
    if(location.hostname === 'zhuanlan.zhihu.com') { // 如果是文章页
        if (!document.querySelector('.ColumnPageHeader-profile>.AppHeader-menu')) { // 未登录
            const observer = new MutationObserver(removeLoginModal);
            observer.observe(document, { childList: true, subtree: true });
            if (getXpath('//button[text()="登录/注册"]')) getXpath('//button[text()="登录/注册"]').outerHTML = '<a class="Button AppHeader-login Button--blue" href="https://www.zhihu.com/signin" target="_blank">登录/注册</a>'; // [登录] 按钮跳转至登录页面
        } else {
            cleanTitles(); // 净化标题消息
        }
    } else { // 不是文章页
        if (!document.querySelector('.AppHeader-profile>.AppHeader-menu')) { // 未登录
            const observer = new MutationObserver(removeLoginModal);
            observer.observe(document, { childList: true, subtree: true });
            document.lastElementChild.appendChild(document.createElement('style')).textContent = '.Question-mainColumnLogin, button.AppHeader-login {display: none !important;}'; // 屏蔽问题页中间的登录提示
            if (getXpath('//button[text()="登录/注册"]')) getXpath('//button[text()="登录/注册"]').outerHTML = '<a class="Button AppHeader-login Button--blue" href="https://www.zhihu.com/signin" target="_blank">登录/注册</a>'; // [登录] 按钮跳转至登录页面
        } else {
            cleanTitles(); // 净化标题消息
        }
    }
}


// 净化标题消息
function cleanTitles() {
    if (!menu_value('menu_cleanTitles')) return

    // 方案一
    const elTitle = document.head.querySelector('title');
    const original = elTitle.textContent;
    const observer = new MutationObserver(function() {
        if (elTitle.textContent != original) { // 避免重复执行
            elTitle.textContent = original;
        }
    });
    observer.observe(elTitle, { childList: true });

    // 方案二
    // if (Reflect.getOwnPropertyDescriptor(document, 'title')) {
    //     const elTitle = document.head.querySelector('title');
    //     const original = elTitle.textContent;
    //     const observer = new MutationObserver(function() {
    //         if (elTitle.textContent != original) { // 避免重复执行
    //             elTitle.textContent = original;
    //         }
    //     });
    //     observer.observe(elTitle, { childList: true });
    // } else {
    //     const title = document.title;
    //     Reflect.defineProperty(document, 'title', {
    //         set: () => {},
    //         get: () => title,
    //     });
    // }
}


// 净化搜索热门
function cleanSearch() {
    if (!menu_value('menu_cleanSearch')) return

    const el = document.querySelector('.SearchBar-input > input');
    const observer = new MutationObserver((mutationsList, observer) => {
        if (mutationsList[0].attributeName === 'placeholder' && mutationsList[0].target.placeholder != '') mutationsList[0].target.placeholder = '';
    });
    el.placeholder = '';
    observer.observe(el, { attributes: true });
    document.documentElement.appendChild(document.createElement('style')).textContent = '.AutoComplete-group > .SearchBar-label:not(.SearchBar-label--history), .AutoComplete-group > [id^="AutoComplete2-topSearch-"] {display: none !important;}';
}


// 快捷关闭悬浮评论（监听点击事件，点击网页两侧空白处）
function closeFloatingComments() {
    const closeFloatingCommentsModal = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                let button = document.querySelector('button[aria-label="关闭"]');
                if (button) {button.parentElement.parentElement.onclick = function(event){if (event.target.parentElement == this) {button.click();}}}
            }
        }
    };
    const observer = new MutationObserver(closeFloatingCommentsModal);
    observer.observe(document, { childList: true, subtree: true });
}


// 监听 XMLHttpRequest 事件
/*function EventXMLHttpRequest() {
    var _send = window.XMLHttpRequest.prototype.send
    function sendReplacement(data) {
        addTypeTips();
        return _send.apply(this, arguments);
    }
    window.XMLHttpRequest.prototype.send = sendReplacement;
}*/


// 自定义 urlchange 事件（用来监听 URL 变化）
function addUrlChangeEvent() {
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('urlchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('urlchange'))
    });
}


function getXpath(xpath, contextNode, doc = document) {
    contextNode = contextNode || doc;
    try {
        const result = doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        // 应该总是返回一个元素节点
        return result.singleNodeValue && result.singleNodeValue.nodeType === 1 && result.singleNodeValue;
    } catch (err) {
        throw new Error(`无效 Xpath: ${xpath}`);
    }
}


// 显示问题作者
function question_author() {
    if (document.querySelector('.BrandQuestionSymbol, .QuestionAuthor')) return
    let qJson = JSON.parse(document.querySelector('#js-initialData').textContent).initialState.entities.questions[/\d+/.exec(location.pathname)[0]].author,
        html = `<div class="BrandQuestionSymbol"><a class="BrandQuestionSymbol-brandLink" href="/people/${qJson.urlToken}"><img role="presentation" src="${qJson.avatarUrl}" class="BrandQuestionSymbol-logo" alt=""><span class="BrandQuestionSymbol-name">${qJson.name}</span></a><div class="BrandQuestionSymbol-divider" style="margin-left: 5px;margin-right: 10px;"></div></div>`;
        //html = `<div class="QuestionAuthor"><div class="AuthorInfo AuthorInfo--plain" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><div class="AuthorInfo"><span class="UserLink AuthorInfo-avatarWrapper"><div class="Popover"><div id="Popover18-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover18-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="${qJson.urlToken}"><img class="Avatar AuthorInfo-avatar" width="24" height="24" src="${qJson.avatarUrl}"></a></div></div></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><div class="Popover"><div id="Popover19-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover19-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="${qJson.urlToken}">${qJson.name}</a></div></div></span></div></div></div></div></div>`
    document.querySelector('.QuestionHeader-topics').insertAdjacentHTML('beforebegin', html);
    //document.querySelector('.QuestionPage h1.QuestionHeader-title').insertAdjacentHTML('afterend', html);
}


// [完整显示时间 + 置顶显示时间] 功能修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
// 完整显示时间 + 置顶显示时间
function topTime_(css, classs) {
    document.querySelectorAll(css).forEach(function(_this) {
        let t = _this.querySelector('.ContentItem-time'); if (!t) return
        if (!(t.classList.contains('full')) && t.querySelector('span') && t.querySelector('span').textContent != null) {
            // 完整显示时间
            topTime_allTime(t)
            // 发布时间置顶
            topTime_publishTop(t, _this, classs)
        }
    });
}


// 完整显示时间 + 置顶显示时间 - 文章
function topTime_post() {
    let t = document.querySelector('.ContentItem-time:not(.xiu-time)'); if (!t) return
    // 完整显示时间
    if (t.textContent.indexOf('编辑于') > -1 && !(t.classList.contains('xiu-time'))) {
        let tt = t.textContent;
        t.click();
        t.textContent = (t.textContent + ' ，' + tt)
        t.classList.add('xiu-time');
    }

    //发布时间置顶
    if (menu_value('menu_publishTop') && !(document.querySelector('.Post-Header > .ContentItem-time')) && !(document.querySelector('.ContentItem-meta > .ContentItem-time'))) {
        let temp_time = t.cloneNode(true);
        temp_time.style.padding = '0px';
        document.querySelector('.Post-Header').insertAdjacentElement('beforeEnd', temp_time);
    }
}


// 完整显示时间
function topTime_allTime(t) {
    if (t.textContent.indexOf('发布于') > -1 && t.textContent.indexOf('编辑于') == -1) {
        t.querySelector('span').textContent = (t.querySelector('span').dataset.tooltip);
        t.classList.add('full');
    } else if (t.textContent.indexOf('发布于') == -1 && t.textContent.indexOf('编辑于') > -1) {
        t.querySelector('span').textContent = (t.querySelector('span').dataset.tooltip) + ' ，' + (t.querySelector('span').textContent);
        t.classList.add('full');
    }
}


// 发布时间置顶
function topTime_publishTop(t, _this, _class) {
    if (!menu_value('menu_publishTop')) return
    if (!t.parentNode.classList.contains(_class)) {
        let temp_time = t.cloneNode(true);
        temp_time.style.padding = '0px';
        // 对于较短的回答，隐藏回答底部的时间
        if (_this.offsetHeight < 400) t.style.display = 'none';
        _this.querySelector('.' + _class).insertAdjacentElement('beforeEnd', temp_time);
    }
}


// 问题创建时间
function question_time() {
    if (!(document.querySelector('.QuestionPage .QuestionHeader-side .QuestionTime-xiu'))) {
        document.querySelector('.QuestionPage .QuestionHeader-side').insertAdjacentHTML('beforeEnd', '<div class="QuestionTime-xiu" style="color: #9098ac; margin-top: 5px; font-size: 13px; font-style: italic;"><p>创建时间：' + getUTC8(new Date(document.querySelector('.QuestionPage > meta[itemprop=dateCreated]').content)) + '</p><p>最后编辑：' + getUTC8(new Date(document.querySelector('.QuestionPage > meta[itemprop=dateModified]').content)) + '</p></div>');
    }
}


// UTC 标准时转 UTC+8 北京时间，修改自：https://greasyfork.org/zh-CN/scripts/402808（精简）
function getUTC8(t) {
    return (t.getFullYear() + '-' + (((t.getMonth() + 1) < 10) ? ('0' + (t.getMonth() + 1)) : (t.getMonth() + 1)) + '-' + ((t.getDate() < 10) ? ('0' + t.getDate()) : t.getDate()) + '\xa0\xa0' + ((t.getHours() < 10) ? ('0' + t.getHours()) : t.getHours()) + ':' + ((t.getMinutes() < 10) ? ('0' + t.getMinutes()) : t.getMinutes()) + ':' + ((t.getSeconds() < 10) ? ('0' + t.getSeconds()) : t.getSeconds()));
}


// 默认站外直链，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
function directLink () {
    document.querySelectorAll('a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)').forEach(function (_this) {_this.href = decodeURIComponent(_this.href.substring(_this.href.indexOf('link.zhihu.com/?target=') + 23));});
}


// 默认高清原图，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
function originalPic(){
    document.querySelectorAll('img[data-original]:not(.comment_sticker):not(.Avatar)').forEach(function(one){if (one.src != one.dataset.original) {one.src = one.dataset.original}});
}


// 默认折叠邀请，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
function questionInvitation(){
    let time = setInterval(function(){
        let q = document.querySelector('.QuestionInvitation-content'); if (!q) return
        clearInterval(time);
        q.style.display = 'none';
        document.querySelector('.QuestionInvitation-title').innerHTML = document.querySelector('.QuestionInvitation-title').innerText + '<span style="cursor: pointer; font-size: 14px; color: #919aae;"> 展开/折叠</span>'
        // 点击事件（展开/折叠）
        document.querySelector('.Topbar').onclick = function(){
            let q = document.querySelector('.QuestionInvitation-content')
            if (q.style.display == 'none') {
                q.style.display = ''
            } else {
                q.style.display = 'none'
            }
        }
    });
}


(function() {
    if (window.onurlchange === undefined) {addUrlChangeEvent();} // Tampermonkey v4.11 版本添加的 onurlchange 事件 grant，可以监控 pjax 等网页的 URL 变化
    removeLogin(); //                                                      移除登录弹窗
    setInterval(originalPic,100); //                                       默认高清原图
    setInterval(directLink, 100); //    默认站外直链
    window.addEventListener('urlchange', function(){ // 针对的是从单个回答页跳转到完整回答页时
        if (location.pathname.indexOf('question') > -1 && location.pathname.indexOf('waiting') === -1 && location.pathname.indexOf('/answer/') === -1) { //       回答页 //
            setTimeout(function(){
                collapsedNowAnswer('.QuestionPage'); //                        收起当前回答 + 快捷返回顶部
                collapsedNowAnswer('.Question-main'); //                       收起当前回答 + 快捷返回顶部
                questionRichTextMore(); //                                     展开问题描述
                blockUsers('question'); //                                     屏蔽指定用户
                blockYanXuan(); //                                             屏蔽盐选内容
            }, 300);
        } else if (location.pathname == '/') {
            setTimeout(()=>{
                blockUsers('index'); //                                        屏蔽指定用户
                blockKeywords('index'); //                                     屏蔽指定关键词
                blockType(); //                                                屏蔽指定类别（视频/文章等）
            }, 500);
        } else if (location.pathname == '/hot') {
            setTimeout(()=>{blockKeywords('index');}, 500);//                  屏蔽指定关键词
        }
    })

    if (GM_info.scriptHandler === 'Violentmonkey') { // Violentmonkey 比 Tampermonkey 加载更早，会导致一些元素还没加载，因此需要延迟一会儿
        setTimeout(start, 300);
    } else {
        start();
    }

    function start(){
        removeHighlightLink(); //                                              移除高亮链接
        if (location.hostname != 'zhuanlan.zhihu.com') {
            if (location.pathname.indexOf('/column/') === -1) cleanSearch(); //净化搜索热门
            collapsedAnswer(); //                                              一键收起回答
        }
        closeFloatingComments(); //                                            快捷关闭悬浮评论（监听点击事件，点击网页两侧空白处）
        blockKeywords('comment'); //                                           屏蔽指定关键词（评论）


        if (location.pathname.indexOf('question') > -1 && location.href.indexOf('/log') == -1) { //       回答页 //
            if (location.pathname.indexOf('waiting') == -1) {
                collapsedNowAnswer('.QuestionPage'); //                        收起当前回答 + 快捷返回顶部
                collapsedNowAnswer('.Question-main'); //                       收起当前回答 + 快捷返回顶部
                questionRichTextMore(); //                                     展开问题描述
                blockUsers('question'); //                                     屏蔽指定用户
                blockYanXuan(); //                                             屏蔽盐选内容
                blockType('question'); //                                      屏蔽指定类别（视频/文章等）
                defaultCollapsedAnswer(); //                                   默认收起回答
            }
            setInterval(function(){topTime_('.ContentItem.AnswerItem', 'ContentItem-meta')}, 300); // 置顶显示时间
            setTimeout(function(){question_time(); question_author()}, 100); //问题创建时间 + 显示问题作者
            questionInvitation(); //                                           默认折叠邀请

        } else if (location.pathname === '/search') { //          搜索结果页 //
            collapsedNowAnswer('main div'); //                                 收起当前回答 + 快捷返回顶部
            collapsedNowAnswer('.Search-container'); //                        收起当前回答 + 快捷返回顶部
            setInterval(function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'SearchItem-meta')}, 300); // 置顶显示时间
            addTypeTips(); //                                                  区分问题文章
            addToQuestion(); //                                                直达问题按钮
            blockUsers('search'); //                                           屏蔽指定用户
            blockKeywords('search'); //                                        屏蔽指定关键词
            blockType('search'); //                                            屏蔽指定类别（视频/文章等）


        } else if (location.pathname.indexOf('/topic/') > -1) { //   话题页 //
            if (location.pathname.indexOf('/hot') > -1 || location.href.indexOf('/top-answers') > -1) { // 仅限 [讨论] [精华]
                collapsedNowAnswer('main.App-main'); //                        收起当前回答 + 快捷返回顶部
                collapsedNowAnswer('.ContentLayout'); //                       收起当前回答 + 快捷返回顶部
                setInterval(function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta')}, 300); // 置顶显示时间
                addTypeTips(); //                                              区分问题文章
                addToQuestion(); //                                            直达问题按钮
                blockUsers('topic'); //                                        屏蔽指定用户
                blockKeywords('topic'); //                                     屏蔽指定关键词
            }

        } else if (location.hostname === 'zhuanlan.zhihu.com'){ //    文章 //
            backToTop('article.Post-Main.Post-NormalMain'); //                 快捷返回顶部
            backToTop('div.Post-Sub.Post-NormalSub'); //                       快捷返回顶部
            setTimeout(topTime_post, 300); //                                  置顶显示时间
            blockUsers(); //                                                   屏蔽指定用户


        } else if (location.pathname.indexOf('/column/') > -1) { //    专栏 //
            setTimeout(function(){
                collapsedAnswer(); //                                           一键收起回答
                collapsedNowAnswer('main div'); //                              收起当前回答 + 快捷返回顶部
                setInterval(function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta')}, 300); // 置顶显示时间
                blockUsers(); //                                                屏蔽指定用户
            }, 300);


        } else if (location.pathname.indexOf('/people/') > -1 || location.href.indexOf('org') > -1) { // 用户主页 //
            if (location.pathname.split('/').length === 3) addTypeTips();addToQuestion(); // 区分问题文章、直达问题按钮
            collapsedNowAnswer('main div'); //                                 收起当前回答 + 快捷返回顶部
            collapsedNowAnswer('.Profile-main'); //                            收起当前回答 + 快捷返回顶部
            setInterval(function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta')}, 300); // 置顶显示时间
            blockUsers('people'); //                                           屏蔽指定用户
            blockKeywords('people'); //                                        屏蔽指定关键词


        } else if (location.pathname.indexOf('/collection/') > -1) { // 收藏夹 //
            addTypeTips(); //                                                  区分问题文章
            addToQuestion(); //                                                直达问题按钮
            collapsedNowAnswer('main'); //                                     收起当前回答 + 快捷返回顶部
            collapsedNowAnswer('.CollectionsDetailPage'); //                   收起当前回答 + 快捷返回顶部
            setInterval(function(){topTime_('.ContentItem.AnswerItem, .ContentItem.ArticleItem', 'ContentItem-meta')}, 300); // 置顶显示时间
            blockKeywords('collection'); //                                    屏蔽指定关键词


        } else { //                                                     首页 //
            // 解决屏蔽类别后，因为首页信息流太少而没有滚动条导致无法加载更多内容的问题
            document.lastElementChild.appendChild(document.createElement('style')).textContent = '.Topstory-container {min-height: 1500px;}';
            if (menu_value('menu_blockTypeVideo')) document.lastChild.appendChild(document.createElement('style')).textContent = `.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}`;

            collapsedNowAnswer('main div'); //                                 收起当前回答 + 快捷返回顶部
            collapsedNowAnswer('.Topstory-container'); //                      收起当前回答 + 快捷返回顶部
            setInterval(function(){topTime_('.TopstoryItem', 'ContentItem-meta')}, 300); // 置顶显示时间
            addTypeTips(); //                                                  区分问题文章
            addToQuestion(); //                                                直达问题按钮
            if (location.pathname == '/') {
                blockUsers('index'); //                                        屏蔽指定用户
                blockKeywords('index'); //                                     屏蔽指定关键词
                blockType(); //                                                屏蔽指定类别（视频/文章等）
            } else if (location.pathname == '/hot') {
                blockKeywords('index'); //                                     屏蔽指定关键词
            } else {
                blockUsers();
            }
        }
    }
})();