const createThemeColorReplacerPlugin = require('./config/plugin.config');
module.exports = {
    configureWebpack: {
        plugins: [
            createThemeColorReplacerPlugin()
        ],
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "com.iclearjs.web",
                "productName":"ClearJS",//项目名，也是生成的安装文件名，即aDemo.exe
                "copyright":"ClearJS Copyright © 2020",//版权信息
                "win":{//win相关配置
                    "icon":"./icon.ico",//图标，当前图标在根目录下，注意这里有两个坑
                    "target": [
                        {
                            "target": "nsis",//利用nsis制作安装程序
                            "arch": ["x64"]//64位
                        }
                    ]
                },
                "nsis": {
                    "oneClick": false, // 是否一键安装
                    "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
                    "allowToChangeInstallationDirectory": true, // 允许修改安装目录
                    "installerIcon": "./icon.ico",// 安装图标
                    "uninstallerIcon": "./icon.ico",//卸载图标
                    "installerHeaderIcon": "./icon.ico", // 安装时头部图标
                    "createDesktopShortcut": true, // 创建桌面图标
                    "createStartMenuShortcut": true,// 创建开始菜单图标
                    "shortcutName": "ClearJS", // 图标名称
                },
                "mac":{//mac相关配置
                    "icon":"./icon.png",//图标，当前图标在根目录下，注意这里有两个坑
                },
            },
            nodeIntegration: true,
            preload: 'src/preload.js',
        }
    },
    lintOnSave: false,
    css: {
        loaderOptions: { // 向 CSS 相关的 loader 传递选项
            less: {
                modifyVars: {
                    'font-size-base': '12px',
                    'text-color': 'rgba(0, 0, 0, 1)'
                },
                javascriptEnabled: true
            }
        }
    },
    outputDir: '../server/app/public',
    assetsDir: 'static',
    indexPath: 'index.html',
    runtimeCompiler: true,
    productionSourceMap: false,
    parallel: undefined
}
