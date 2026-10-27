/* ============================================================================
 *  站点配置 —— 只改这一个文件就能更换所有内容
 * ----------------------------------------------------------------------------
 *  改完保存，刷新页面即可生效（不需要任何构建工具）。
 *  字段说明见每一项上方的注释；不想要某个板块，把 enabled 改成 false 即可。
 * ========================================================================== */
window.SITE_CONFIG = {

    /* -------------------------------------------------------------- 站点信息 */
    site: {
        lang: "zh-CN",
        title: "小草 的简历",                       // 浏览器标签页标题
        description: "小草的个人主页 · Java 开发工程师",  // 搜索引擎描述
        themeColor: "#c0e3e7",                      // 主题色（进度条、时间轴等）
        favicon: "styles/img/show-star.png",        // 标签页小图标，留空则不显示

        footer: {
            text: "XiaoCao",
            link: "https://hixiaocao.github.io/hi/",
            copyright: "2023"                       // 显示为 Copyright © 2023
        }
    },

    /* ------------------------------------------------------------ 个人名片区 */
    profile: {
        avatar: "styles/img/personal.png",          // 头像，换成自己的图片路径
        name: "小草",
        tagline: "北京 | IBM | Java开发工程师",       // 名字下面一行小字
        // 右侧图标链接，icon 可选任意 font-awesome 图标名（省略 ace-icon- 前缀）
        socials: [
            { icon: "github",   label: "GitHub",   href: "https://hixiaocao.github.io/hi/" },
            { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
            { icon: "phone",    label: "1529346xxxx", href: "" },          // 无链接，仅 hover 显示
            { icon: "contact",  label: "2375635198@qq.com", href: "mailto:2375635198@qq.com" }
        ],
        printButton: {
            enabled: true,
            text: "下载简历 / 打印"
        }
    },

    /* ---------------------------------------------------------- 娱乐小组件 */
    widgets: {
        clock: {
            enabled: true,
            title: "当前时间",
            showSeconds: true,                      // 是否显示秒
            showProgress: true                      // 是否显示“今日进度”进度条
        },
        lucky: {
            enabled: true,
            title: "今日幸运数字",
            digits: 6,                              // 位数，默认 6 位
            salt: "xiaocao",                        // 换个词，结果就完全不同
            showColor: true,                        // 是否附带“今日幸运色”
            palette: [                              // 幸运色候选池
                { name: "湖蓝", hex: "#c0e3e7" },
                { name: "薄荷绿", hex: "#30cc81" },
                { name: "暖橙", hex: "#f5a623" },
                { name: "藕粉", hex: "#f7b6c2" },
                { name: "雾紫", hex: "#a99bd6" },
                { name: "青柠", hex: "#a3d977" },
                { name: "珊瑚红", hex: "#ef6f6c" },
                { name: "天青", hex: "#79c7d4" }
            ]
        }
    },

    /* ---------------------------------------------------------- 简历各板块
     * 板块顺序 = 对象里的书写顺序，左侧导航也会按这个顺序自动生成。
     * ------------------------------------------------------------------------ */
    sections: {

        basic: {
            enabled: true,
            id: "basic_info",
            nav: "基本信息",
            icon: "home",
            title: "基本信息",
            layout: "list",                        // 两列键值对
            items: [
                { label: "性别",     value: "男" },
                { label: "出生日期", value: "1998-01-09" },
                { label: "手机",     value: "1829346XXXX" },
                { label: "e-mail",   value: "2375635198@qq.com", href: "mailto:2375635198@qq.com" },
                { label: "英语",     value: "CET-4" },
                { label: "日语",     value: "八级" }
            ]
        },

        skills: {
            enabled: true,
            id: "profetional",
            nav: "职业技能",
            icon: "experience",
            title: "职业技能",
            layout: "skills",
            max: 10,                               // 满格是多少点
            columns: [                             // 每列一个数组，最多建议 2 列
                [
                    { name: "Java",       level: 10 },
                    { name: "HTML",       level: 8 },
                    { name: "CSS",        level: 8 },
                    { name: "Javascript", level: 5 }
                ],
                [
                    { name: "Maven",       level: 10 },
                    { name: "Spring",      level: 6 },
                    { name: "mybatis",     level: 7 },
                    { name: "spring boot", level: 10 }
                ]
            ]
        },

        education: {
            enabled: true,
            id: "education",
            nav: "教育经历",
            icon: "portfolio",
            title: "教育经历",
            layout: "education",
            items: [
                {
                    avatar: "styles/img/school.jpg",
                    school: "甘肃兰州大学",
                    period: "2016 - 2020",
                    major: "软件工程",
                    notes: [
                        "接受新事物的快，学习能力强",
                        "喜欢运动，梦想百万富翁"
                    ]
                }
            ]
        },

        experience: {
            enabled: true,
            id: "experience",
            nav: "工作经历",
            icon: "references",
            title: "工作经历",
            layout: "experience",
            items: [
                {
                    date: "Jan 2022 - Now",
                    datetime: "2022-01",
                    role: "Java Developer",
                    company: "18D统计项目 | 铁路科学院",
                    points: [
                        "使用技术为 mybatis、springmvc、spring 等等",
                        "负责项目中服务开发",
                        "参与部分需求调研"
                    ]
                },
                {
                    date: "Sep 2021 - Jan 2022",
                    datetime: "2021-09",
                    role: "Java Developer",
                    company: "日本本田项目 | 大连IBM",
                    points: [
                        "使用技术为 struts、hibernate、spring 等等",
                        "负责项目中服务开发",
                        "参与部分需求调研"
                    ]
                }
            ]
        },

        certifications: {
            enabled: true,
            id: "certification",
            nav: "获得证书",
            icon: "blog",
            title: "获得证书",
            layout: "certifications",
            items: [
                { img: "styles/img/PMP.png",   title: "PMP" },
                { img: "styles/img/udemy.png", title: "Udemy" }
            ]
        },

        projects: {
            enabled: true,
            id: "personal_project",
            nav: "个人作品",
            icon: "snowflake-o",
            title: "个人作品",
            layout: "projects",
            items: [
                {
                    img: "styles/img/portfolio/ibms.jpg",
                    title: "智能楼宇管理系统",
                    desc: "基于数据采集模型的智能楼宇管理系统，支持 SNMP、Modbus、电总、OPC 等协议。",
                    // 有 detail 就会弹出详情层；没有 detail 时若填了 link 则直接跳转
                    detail: {
                        media: "styles/img/portfolio/ibms.jpg",
                        subtitle: "design / development",
                        meta: [
                            { label: "Demo展示地址", value: "https://gitee.com/xiaodan_yu/resume.io", href: "https://gitee.com/xiaodan_yu/resume.io" }
                        ],
                        desc: "基于数据采集模型的智能楼宇管理系统，支持 SNMP、Modbus、电总、OPC 等协议。"
                    }
                },
                {
                    img: "styles/img/portfolio/prj-02.jpg",
                    title: "Jekyll 简历模板",
                    desc: "基于 Jekyll 的简历模板，托管在码云。记得给个赞哦！",
                    link: "https://gitee.com/xiaodan_yu/resume.io"
                },
                {
                    img: "styles/img/portfolio/ai.jpg",
                    title: "股票预测模型",
                    desc: "基于 AI 的股票预测模型"
                }
            ]
        }
    }
};
