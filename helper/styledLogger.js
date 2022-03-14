const clc = require("cli-color");

module.exports = {
    styledColorLogger: {
        success: (msg) => {
            console.log(clc.green("[*]"), msg);
        },
        error: (msg) => {
            console.log(clc.red("[*]"), msg);
        },
        colorLog: {
            black: (msg) => {
                console.log(clc.black("[*]"), msg);
            },
            red: (msg) => {
                console.log(clc.red("[*]"), msg);
            },
            green: (msg) => {
                console.log(clc.green("[*]"), msg);
            },
            yellow: (msg) => {
                console.log(clc.yellow("[*]"), msg);
            },
            blue: (msg) => {
                console.log(clc.blue("[*]"), msg);
            },
            magenta: (msg) => {
                console.log(clc.magenta("[*]"), msg);
            },
            cyan: (msg) => {
                console.log(clc.cyan("[*]"), msg);
            },
            white: (msg) => {
                console.log(clc.white("[*]"), msg);
            }
        },
        brightColorLog: {
            brightBlack: (msg) => {
                console.log(clc.blackBright("[*]"), msg);
            },
            brightRed: (msg) => {
                console.log(clc.redBright("[*]"), msg);
            },
            brightGreen: (msg) => {
                console.log(clc.greenBright("[*]"), msg);
            },
            brightYellow: (msg) => {
                console.log(clc.yellowBright("[*]"), msg);
            },
            brightBlue: (msg) => {
                console.log(clc.blueBright("[*]"), msg);
            },
            brightMagenta: (msg) => {
                console.log(clc.magentaBright("[*]"), msg);
            },
            brightCyan: (msg) => {
                console.log(clc.cyanBright("[*]"), msg);
            },
            brightWhite: (msg) => {
                console.log(clc.whiteBright("[*]"), msg);
            }
        },
        customColor: {
            xterm: (color, msg) => {
                const msgClr = clc.xterm(color);
                console.log(msgClr(msg));
            }
        },
        styledLog: {
            // https://www.npmjs.com/package/cli-color
        },
        styledLogWithColor: {
            // https://www.npmjs.com/package/cli-color
        },
        clearConsole: () => {
            console.clear();
        }
    }
};