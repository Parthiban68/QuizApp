const {createLogger, format, transports} = require('winston')

const logger = createLogger({
    transports :[
        new transports.File({
            filename:'utils/Logs/info.log',
            level : "info",
            format:format.combine(
                format((info) => (info.level === "info" ? info : false))(),
                format.timestamp(), format.json()
            )
        }),
        new transports.File({
            filename:'utils/Logs/error.log',
            level : "error",
            format:format.combine(
                format((info) => (info.level === "error" ? info : false))(),
                format.timestamp(), format.json()
            )
        }),
    ]
})


module.exports = logger;