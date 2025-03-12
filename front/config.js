// config.js
const fs = require('fs');
const path = require('path');

class Config {
    static DEFAULT_CONFIG = {
        GENERAL: {
            username: "admin",
            language: "Japanese"
        },
        TIME: {
            timezone: "Asia/Tokyo",
            timedelta: "year=0,month=0,day=0,hour=0,minute=0,second=0"
        },
        SERVER: {
            port: "8080"
        },
        LOOPTEXT: {
            fullscreen: "false",
            screen_height: "1080",
            screen_width: "1920",
            position: "top", // top, bottom
            height: "90",
            width: "1920",
            speed: "10",
            backgroundcolor: "#000000",
            textcolor: "#ffffff"
        }
    };

    constructor(filename = "config.json") {
        this.filename = filename;
        this.config = {};
        this._loadConfig();
    }

    _loadConfig() {
        if (!fs.existsSync(this.filename)) {
            this.config = Config.DEFAULT_CONFIG;
            this.save();
        } else {
            const content = fs.readFileSync(this.filename, "utf-8");
            this.config = JSON.parse(content);
        }
    }

    get(section, key, fallback = undefined) {
        if (this.config.hasOwnProperty(section) && this.config[section].hasOwnProperty(key)) {
            return this.config[section][key];
        }
        return fallback;
    }

    set(section, key, value) {
        if (!this.config.hasOwnProperty(section)) {
            this.config[section] = {};
        }
        this.config[section][key] = String(value);
        this.save();
    }

    getTimedelta() {
        const timedeltaStr = this.get("TIME", "timedelta", "");
        const parts = timedeltaStr.split(",");
        let kwargs = {};
        parts.forEach(part => {
            let [k, v] = part.split("=");
            if (k && v) {
                kwargs[k.trim()] = parseInt(v.trim(), 10);
            }
        });
        const years = kwargs.year || 0;
        const months = kwargs.month || 0;
        const days = (kwargs.day || 0) + (years * 365) + (months * 30);
        const hours = kwargs.hour || 0;
        const minutes = kwargs.minute || 0;
        const seconds = kwargs.second || 0;
        return { days, hours, minutes, seconds };
    }

    setTimedelta(kwargs) {
        const timedeltaStr = Object.entries(kwargs)
            .map(([key, value]) => `${key}=${value}`)
            .join(",");
        this.set("TIME", "timedelta", timedeltaStr);
    }

    save() {
        fs.writeFileSync(this.filename, JSON.stringify(this.config, null, 4), { encoding: "utf-8" });
    }

    getAllSections() {
        return Object.keys(this.config);
    }

    getAllConfigs() {
        return this.config;
    }
}

if (require.main === module) {
    const config = new Config();
    console.log("All Sections:", config.getAllSections());
    console.log("All Configs:", config.getAllConfigs());
    console.log("Username:", config.get("GENERAL", "username"));
    console.log("Language:", config.get("GENERAL", "language"));
    config.set("GENERAL", "username", "new_user");
    console.log("Updated Username:", config.get("GENERAL", "username"));
    console.log("Timedelta:", config.getTimedelta());
}

module.exports = Config;
