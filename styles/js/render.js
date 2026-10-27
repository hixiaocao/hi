/* ============================================================================
 *  render.js —— 读取 config.js 并渲染整个页面
 * ----------------------------------------------------------------------------
 *  不需要修改这个文件。要改内容请编辑 config.js。
 * ========================================================================== */
(function () {
    "use strict";

    var CFG = window.SITE_CONFIG;
    if (!CFG) {
        console.error("[render] 没有找到 SITE_CONFIG，请确认 config.js 已正确引入");
        return;
    }

    /* ------------------------------------------------------------ 小工具 */

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function html(node, markup) {
        if (node) node.innerHTML = markup;
    }

    function enabledSections() {
        var out = [];
        var sections = CFG.sections || {};
        for (var key in sections) {
            if (Object.prototype.hasOwnProperty.call(sections, key) && sections[key] && sections[key].enabled !== false) {
                out.push({ key: key, data: sections[key] });
            }
        }
        return out;
    }

    /* --------------------------------------------------------- 站点头部 */

    function renderHead() {
        var site = CFG.site || {};

        document.title = site.title || "个人主页";

        if (site.description) {
            var meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute("name", "description");
                document.head.appendChild(meta);
            }
            meta.setAttribute("content", site.description);
        }

        if (site.favicon) {
            var icon = document.createElement("link");
            icon.rel = "icon";
            icon.href = site.favicon;
            document.head.appendChild(icon);
        }

        if (site.themeColor) {
            document.documentElement.setAttribute("data-theme-color", site.themeColor);
        }

        document.documentElement.setAttribute("lang", site.lang || "zh-CN");
    }

    /* --------------------------------------------------------- 个人名片 */

    function renderProfile() {
        var profile = CFG.profile || {};
        var socials = (profile.socials || []).map(function (item) {
            var icon = '<span class="ace-icon ace-icon-' + esc(item.icon || "link") + '"></span>';
            var inner = item.href
                ? '<a href="' + esc(item.href) + '" title="' + esc(item.label) + '" target="_blank" rel="noopener">' + icon + "</a>"
                : '<a href="javascript:void(0)" title="' + esc(item.label) + '">' + icon + "</a>";
            return "<li>" + inner + "</li>";
        }).join("");

        var printButton = "";
        if (!profile.printButton || profile.printButton.enabled !== false) {
            printButton =
                '<footer class="ace-card-footer">' +
                    '<a class="btn btn-lg btn-block btn-thin btn-upper" href="javascript:void(0)" onclick="window.print()">' +
                        esc((profile.printButton && profile.printButton.text) || "下载简历 / 打印") +
                    "</a>" +
                "</footer>";
        }

        html($("#personal-card"),
            '<article id="ace-card" class="ace-card bg-primary">' +
                '<div class="ace-card-inner text-center">' +
                    '<div class="avatar-ring">' +
                        '<img class="avatar avatar-195" src="' + esc(profile.avatar) + '" width="195" height="195" alt="' + esc(profile.name) + '">' +
                    "</div>" +
                    "<h1>" + esc(profile.name) + "</h1>" +
                    '<p class="text-muted">' + esc(profile.tagline) + "</p>" +
                    '<ul class="ace-social clear-list">' + socials + "</ul>" +
                "</div>" +
                printButton +
            "</article>"
        );
    }

    /* --------------------------------------------------------- 左侧导航 */

    function renderNav() {
        var site = CFG.site || {};
        var items = [
            '<li><a href="#top" data-tooltip="回到顶部" class="nav-home">' +
                '<img class="avatar avatar-42" src="' + esc(site.favicon || "styles/img/show-star.png") + '" alt="">' +
            "</a></li>"
        ];

        enabledSections().forEach(function (section) {
            var data = section.data;
            if (!data.nav) return;
            items.push(
                "<li>" +
                    '<a href="#' + esc(data.id || section.key) + '" data-tooltip="' + esc(data.nav) + '">' +
                        '<span class="ace-icon ace-icon-' + esc(data.icon || "circle-o") + '"></span>' +
                    "</a>" +
                "</li>"
            );
        });

        html($("#ace-nav-list"), items.join(""));
    }

    /* --------------------------------------------------------- 娱乐组件 */

    function renderWidgets() {
        var widgets = CFG.widgets || {};
        var parts = [];

        if (widgets.clock && widgets.clock.enabled !== false) {
            parts.push(
                '<div class="widget widget-clock">' +
                    '<div class="widget-head">' +
                        '<span class="ace-icon ace-icon-clock-o"></span>' + esc(widgets.clock.title || "当前时间") +
                    "</div>" +
                    '<div class="clock-time" id="clock-time">--:--:--</div>' +
                    '<div class="clock-date" id="clock-date">&nbsp;</div>' +
                    (widgets.clock.showProgress !== false
                        ? '<div class="clock-progress" title="今日进度"><span id="clock-progress-bar"></span></div>'
                        : "") +
                "</div>"
            );
        }

        if (widgets.lucky && widgets.lucky.enabled !== false) {
            parts.push(
                '<div class="widget widget-lucky">' +
                    '<div class="widget-head">' +
                        '<span class="ace-icon ace-icon-magic"></span>' + esc(widgets.lucky.title || "今日幸运数字") +
                    "</div>" +
                    '<div class="lucky-digits" id="lucky-digits"></div>' +
                    '<div class="lucky-meta" id="lucky-meta"></div>' +
                "</div>"
            );
        }

        html($("#widget-strip"), parts.join(""));
    }

    /* ------------------------------------------------- 各简历板块渲染 */

    var renderers = {
        list: function (data, id) {
            var rows = (data.items || []).map(function (item) {
                var value = item.href
                    ? '<a href="' + esc(item.href) + '">' + esc(item.value) + "</a>"
                    : esc(item.value);
                return '<dt class="text-upper">' + esc(item.label) + "</dt><dd>" + value + "</dd>";
            }).join("");

            return '<div class="row"><div class="col-sm-6 clear-mrg">' +
                '<dl class="dl-horizontal clear-mrg">' + rows + "</dl>" +
            "</div></div>";
        },

        skills: function (data, id) {
            var max = data.max || 10;
            var columns = data.columns || [];
            return '<div class="row"><div class="clear-mrg skills-wrap">' +
                columns.map(function (column) {
                    var bars = (column || []).map(function (skill, i) {
                        var level = Math.max(0, Math.min(max, Number(skill.level) || 0));
                        var bullets = "";
                        for (var b = 0; b < max; b++) {
                            bullets += '<span class="bullet' + (b < level ? " fill" : "") + '"></span>';
                        }
                        return '<div class="progress-bullets" style="--i:' + i + '"' +
                                    ' role="progressbar" aria-valuenow="' + level + '" aria-valuemin="0" aria-valuemax="' + max + '">' +
                                    '<strong class="progress-title">' + esc(skill.name) + "</strong>" +
                                    '<span class="progress-bar">' + bullets + "</span>" +
                                "</div>";
                    }).join("");
                    return '<div class="col-sm-6 clear-mrg">' + bars + "</div>";
                }).join("") +
            "</div></div>";
        },

        education: function (data, id) {
            return (data.items || []).map(function (item, i) {
                var notes = (item.notes || []).map(function (note) {
                    return "<p>" + esc(note) + "</p>";
                }).join("");

                return '<div class="ref-box hreview reveal-item" style="--i:' + i + '">' +
                    '<div class="ref-avatar">' +
                        '<img alt="" src="' + esc(item.avatar) + '" class="avatar avatar-54 photo" height="54" width="54">' +
                    "</div>" +
                    '<div class="ref-info">' +
                        '<div class="ref-author">' +
                            "<strong>" + esc(item.school) + "</strong>" +
                            "<span>" + esc(item.period) + " | " + esc(item.major) + "</span>" +
                        "</div>" +
                        '<blockquote class="ref-cont clear-mrg">' + notes + "</blockquote>" +
                    "</div>" +
                "</div>";
            }).join("");
        },

        experience: function (data, id) {
            return '<br><div class="education">' +
                (data.items || []).map(function (item, i) {
                    var points = (item.points || []).map(function (point) {
                        return "<p>" + esc(point) + "</p>";
                    }).join("");

                    return '<div class="education-box reveal-item" style="--i:' + i + '">' +
                        '<time class="education-date" datetime="' + esc(item.datetime || "") + '">' +
                            "<span>" + esc(item.date) + "</span>" +
                        "</time>" +
                        "<h3>" + esc(item.role) + "</h3>" +
                        '<span class="education-company">' + esc(item.company) + "</span>" +
                        points +
                    "</div>";
                }).join("") +
            "</div>";
        },

        certifications: function (data, id) {
            return '<div class="row">' +
                (data.items || []).map(function (item, i) {
                    return '<div class="col-sm-6 clear-mrg reveal-item" style="--i:' + i + '">' +
                        '<div class="award-box">' +
                            '<figure class="award-img"><img src="' + esc(item.img) + '" alt="' + esc(item.title) + '"></figure>' +
                            '<h3 class="award-title">' + esc(item.title) + "</h3>" +
                        "</div>" +
                    "</div>";
                }).join("") +
            "</div>";
        },

        projects: function (data, id) {
            var items = (data.items || []).map(function (item, i) {
                var popupId = "pf-popup-" + (i + 1);

                var action = "";
                if (item.detail) {
                    action = '<a href="#' + popupId + '" class="pf-btn-view btn btn-primary">详情</a>';
                } else if (item.link) {
                    action = '<a href="' + esc(item.link) + '" class="btn btn-primary" target="_blank" rel="noopener">详情</a>';
                }

                var popup = "";
                if (item.detail) {
                    var meta = (item.detail.meta || []).map(function (row) {
                        var value = row.href
                            ? '<a href="' + esc(row.href) + '" target="_blank" rel="noopener">' + esc(row.value) + "</a>"
                            : esc(row.value);
                        return "<dt>" + esc(row.label) + ":</dt><dd>" + value + "</dd>";
                    }).join("");

                    popup =
                        '<div id="' + popupId + '" class="pf-popup clearfix">' +
                            '<div class="pf-popup-col1">' +
                                '<div class="pf-popup-media" style="background-image:url(' + esc(item.detail.media || item.img) + ');background-repeat:no-repeat;background-size:cover;">' +
                                "</div>" +
                            "</div>" +
                            '<div class="pf-popup-col2">' +
                                '<div class="pf-popup-info clear-mrg">' +
                                    '<h2 class="text-upper">' + esc(item.title) + "</h2>" +
                                    '<p class="text-muted"><strong>' + esc(item.detail.subtitle || "") + "</strong></p>" +
                                    "<dl class=\"dl-horizontal\">" + meta + "</dl>" +
                                    "<p>" + esc(item.detail.desc || item.desc) + "</p>" +
                                "</div>" +
                            "</div>" +
                        "</div>";
                }

                return '<div class="pf-grid-item reveal-item" style="--i:' + i + '">' +
                    '<div class="project">' +
                        '<figure class="portfolio-figure"><img src="' + esc(item.img) + '" alt="' + esc(item.title) + '"></figure>' +
                        '<div class="portfolio-caption text-center">' +
                            '<div class="valign-table"><div class="valign-cell">' +
                                '<h2 class="text-upper">' + esc(item.title) + "</h2>" +
                                "<p>" + esc(item.desc) + "</p>" + action +
                            "</div></div>" +
                        "</div>" +
                    "</div>" +
                    popup +
                "</div>";
            }).join("");

            return '<div class="pf-wrap"><div class="pf-grid">' +
                '<div class="pf-grid-sizer"></div>' + items +
            "</div></div>";
        }
    };

    function renderSections() {
        var markup = enabledSections().map(function (section) {
            var data = section.data;
            var id = data.id || section.key;
            var layout = data.layout || "list";
            var renderer = renderers[layout];
            if (!renderer) {
                console.warn("[render] 未知的 layout: " + layout);
                return "";
            }

            return '<section class="section reveal" id="' + esc(id) + '">' +
                '<h2 class="title-thin text-muted">' + esc(data.title) + "</h2>" +
                renderer(data, id) +
            "</section>";
        }).join("");

        html($("#resume-sections"), markup);
    }

    /* ------------------------------------------------------------ 页脚 */

    function renderFooter() {
        var site = CFG.site || {};
        var footer = site.footer || {};
        var link = footer.link
            ? ' <a href="' + esc(footer.link) + '" target="_blank" rel="noopener">' + esc(footer.text || "") + "</a>"
            : " " + esc(footer.text || "");

        html($("#ace-footer-cont"),
            '<p class="text-center">Copyright &copy; ' + esc(footer.copyright || new Date().getFullYear()) +
            ". All rights reserved." + link + "</p>"
        );
    }

    /* --------------------------------------------------- 时钟 & 幸运数字 */

    function pad(n) {
        return n < 10 ? "0" + n : String(n);
    }

    function startClock() {
        var clockEl = $("#clock-time");
        if (!clockEl) return;

        var dateEl = $("#clock-date");
        var barEl = $("#clock-progress-bar");
        var showSeconds = !CFG.widgets.clock || CFG.widgets.clock.showSeconds !== false;
        var weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

        function tick() {
            var now = new Date();
            var text = pad(now.getHours()) + ":" + pad(now.getMinutes());
            if (showSeconds) text += ":" + pad(now.getSeconds());
            clockEl.textContent = text;

            if (dateEl) {
                dateEl.textContent = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日 " +
                    weekdays[now.getDay()];
            }

            if (barEl) {
                var passed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
                barEl.style.width = (passed / 86400 * 100).toFixed(2) + "%";
            }
        }

        tick();
        setInterval(tick, 1000);
    }

    // FNV-1a：同一份配置 + 同一天，永远得到同一个数字
    function hashString(str) {
        var hash = 2166136261 >>> 0;
        for (var i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = Math.imul(hash, 16777619) >>> 0;
        }
        return hash >>> 0;
    }

    function todayKey(now) {
        return now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    }

    function startLucky() {
        var digitsEl = $("#lucky-digits");
        if (!digitsEl) return;

        var cfg = CFG.widgets.lucky || {};
        var digits = cfg.digits || 6;
        var now = new Date();
        var seed = hashString(todayKey(now) + "|" + (cfg.salt || "hi"));

        var number = String(seed % Math.pow(10, digits));
        while (number.length < digits) number = "0" + number;

        digitsEl.innerHTML = number.split("").map(function (digit) {
            return "<span>" + digit + "</span>";
        }).join("");

        // 数字滚动动效：先随机跳几下，再定格
        var spans = digitsEl.querySelectorAll("span");
        var rounds = 12;
        var timer = setInterval(function () {
            rounds--;
            for (var i = 0; i < spans.length; i++) {
                spans[i].textContent = rounds > 0 ? Math.floor(Math.random() * 10) : number[i];
                spans[i].classList.toggle("settling", rounds <= 0);
            }
            if (rounds <= 0) clearInterval(timer);
        }, 70);

        // 幸运色
        var metaEl = $("#lucky-meta");
        if (metaEl && cfg.showColor !== false && cfg.palette && cfg.palette.length) {
            var color = cfg.palette[seed % cfg.palette.length];
            metaEl.innerHTML =
                '<span class="lucky-label">今日幸运色</span>' +
                '<span class="lucky-color" style="background:' + esc(color.hex) + '"></span>' +
                "<span>" + esc(color.name) + "</span>";
        }
    }

    /* ------------------------------------------------------ 滚动进入动画 */

    function startReveal() {
        var nodes = document.querySelectorAll(".reveal");

        if (!("IntersectionObserver" in window)) {
            for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("is-visible");
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

        for (var j = 0; j < nodes.length; j++) observer.observe(nodes[j]);
    }

    /* ------------------------------------------------------- 导航平滑滚动 */

    function startSmoothScroll() {
        document.addEventListener("click", function (event) {
            var link = event.target;
            while (link && link.tagName !== "A") link = link.parentNode;

            if (!link) return;
            if (link.classList.contains("pf-btn-view")) return;   // 作品详情交给 main.js

            var href = link.getAttribute("href") || "";
            if (href.charAt(0) !== "#" || href.charAt(1) === "!" || href === "#") return;

            var target = document.getElementById(href.slice(1));
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            try {
                if (history.replaceState) history.replaceState(null, "", href);
            } catch (e) {
                /* file:// 下部分浏览器不允许改地址，忽略即可 */
            }
        });
    }

    /* --------------------------------------------------------- 导航高亮 */

    function startScrollSpy() {
        var links = document.querySelectorAll("#ace-nav-list a[href^='#']");
        if (!links.length || !("IntersectionObserver" in window)) return;

        var map = {};
        for (var i = 0; i < links.length; i++) {
            var id = links[i].getAttribute("href").slice(1);
            if (id && id !== "top") map[id] = links[i].parentNode;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var item = map[entry.target.id];
                if (!item) return;
                if (entry.isIntersecting) {
                    for (var key in map) {
                        if (Object.prototype.hasOwnProperty.call(map, key)) map[key].classList.remove("active");
                    }
                    item.classList.add("active");
                }
            });
        }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });

        for (var id in map) {
            if (Object.prototype.hasOwnProperty.call(map, id)) {
                var section = document.getElementById(id);
                if (section) observer.observe(section);
            }
        }
    }

    /* ------------------------------------------------------------ 启动 */

    renderHead();
    renderProfile();
    renderNav();
    renderWidgets();
    renderSections();
    renderFooter();

    startClock();
    startLucky();
    startReveal();
    startSmoothScroll();
    startScrollSpy();

})();
