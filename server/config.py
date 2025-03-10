import os
import json
from datetime import timedelta


class Config:
    DEFAULT_CONFIG = {
        "GENERAL": {
            "username": "admin",
            "language": "Japanese"
        },
        "TIME": {
            "timezone": "Asia/Tokyo",
            "timedelta": "year=0,month=0,day=0,hour=0,minute=0,second=0"
        },
        "SERVER": {
            "port": "8080"
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
            "textColor": "#ffffff"
        }
    }

    def __init__(self, filename="config.json"):
        self.filename = filename
        self._load_config()

    def _load_config(self):
        """設定ファイルを読み込む。存在しない場合はデフォルト値を使用。"""
        if not os.path.exists(self.filename):
            self.config = Config.DEFAULT_CONFIG.copy()
            self.save()
        else:
            with open(self.filename, "r", encoding="utf-8") as f:
                self.config = json.load(f)

    def get(self, section, key, fallback=None):
        """指定されたセクションとキーの値を取得する"""
        return self.config.get(section, {}).get(key, fallback)

    def set(self, section, key, value):
        """指定されたセクションとキーに値を設定する"""
        if section not in self.config:
            self.config[section] = {}
        self.config[section][key] = str(value)
        self.save()

    def get_timedelta(self):
        """タイムデルタ形式の設定を取得"""
        timedelta_str = self.get("TIME", "timedelta", fallback="")
        # "year=0,month=0,day=0,..." を分解
        kwargs = dict(map(lambda x: x.split("="), timedelta_str.split(",")))
        years = int(kwargs.pop("year", 0))
        months = int(kwargs.pop("month", 0))
        days = int(kwargs.get("day", 0)) + (years * 365) + (months * 30)
        timedelta_kwargs = {
            "days": days,
            "hours": int(kwargs.get("hour", 0)),
            "minutes": int(kwargs.get("minute", 0)),
            "seconds": int(kwargs.get("second", 0))
        }
        return timedelta(**timedelta_kwargs)

    def set_timedelta(self, **kwargs):
        """タイムデルタ形式の設定を更新"""
        timedelta_str = ",".join(f"{key}={value}" for key, value in kwargs.items())
        self.set("TIME", "timedelta", timedelta_str)

    def save(self):
        """現在の設定をファイルに保存"""
        with open(self.filename, "w", encoding="utf-8") as f:
            json.dump(self.config, f, indent=4, ensure_ascii=False)

    def get_all_sections(self):
        """全セクションを取得"""
        return list(self.config.keys())

    def get_all_configs(self):
        """全セクションとキーのペアを辞書として取得"""
        return self.config


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
