import os
import configparser
from datetime import timedelta


class Config:
    DEFAULT_CONFIG = {
        "GENERAL": {
            "username": "admin",
            "language": "Japanese",
        },
        "TIME": {
            "timezone": "Asia/Tokyo",
            "timedelta": "year=0,month=0,day=0,hour=0,minute=0,second=0",
        },
        "SERVER": {
            "port": "8080",
        },
        "LOOPTEXT": {
            "fullscreen": "false",
            "screen_height": "1080",
            "screen_width": "1920",
            "position": "top",  # top, bottom
            "height": "90",
            "width": "1920",
            "speed": "10",
            "backgroundColor": "#000000",
            "textColor": "#ffffff",
        }
    }

    def __init__(self, filename="config.ini"):
        self.filename = filename
        self.config = configparser.ConfigParser()
        self._load_config()

    def _load_config(self):
        """設定ファイルを読み込む。存在しない場合はデフォルト値を使用。"""
        if not os.path.exists(self.filename):
            self._set_defaults()
        else:
            self.config.read(self.filename, encoding="utf-8")

    def _set_defaults(self):
        """デフォルト値を設定"""
        for section, options in self.DEFAULT_CONFIG.items():
            self.config[section] = options
        self.save()

    def get(self, section, key, fallback=None):
        """指定されたセクションとキーの値を取得する"""
        return self.config.get(section, key, fallback=fallback)

    def set(self, section, key, value):
        """指定されたセクションとキーに値を設定する"""
        if section not in self.config:
            self.config.add_section(section)
        self.config[section][key] = str(value)
        self.save()

    def get_timedelta(self):
        """タイムデルタ形式の設定を取得"""
        timedelta_str = self.get("TIME", "timedelta", fallback="")
        kwargs = dict(
            map(lambda x: x.split("="), timedelta_str.split(","))
        )
        years = int(kwargs.pop("year", 0))
        months = int(kwargs.pop("month", 0))
        days = int(kwargs.get("day", 0)) + (years * 365) + (months * 30)
        
        timedelta_kwargs = {
            "days": days,
            "hours": int(kwargs.get("hour", 0)),
            "minutes": int(kwargs.get("minute", 0)),
            "seconds": int(kwargs.get("second", 0)),
        }

        return timedelta(**timedelta_kwargs)

    def set_timedelta(self, **kwargs):
        """タイムデルタ形式の設定を更新"""
        timedelta_str = ",".join(f"{key}={value}" for key, value in kwargs.items())
        self.set("TIME", "timedelta", timedelta_str)

    def save(self):
        """現在の設定をファイルに保存"""
        with open(self.filename, "w", encoding="utf-8") as configfile:
            self.config.write(configfile)

    def get_all_sections(self):
        """全セクションを取得"""
        return self.config.sections()

    def get_all_configs(self):
        """全セクションとキーのペアを辞書として取得"""
        return {section: dict(self.config.items(section)) for section in self.get_all_sections()}


if __name__ == "__main__":
    config = Config()

    # 設定の取得
    print("All Sections:", config.get_all_sections())
    print("All Configs:", config.get_all_configs())
    print("Username:", config.get("GENERAL", "username"))
    print("Language:", config.get("GENERAL", "language"))

    # 設定の更新
    config.set("GENERAL", "username", "new_user")

    # 再確認
    print("Updated Username:", config.get("GENERAL", "username"))
    print("Timedelta:", config.get_timedelta())
