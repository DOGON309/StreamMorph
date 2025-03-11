from flask import Flask, render_template, redirect, request
from flask_cors import CORS
import argparse
from config import Config
from looptext import LoopText

from databse import Database

import uuid, sys

CURRENT_VERSION = "1.1.0"

ROUTE_PATH = sys.path[1] if 2 == len(sys.path) else '.'
TEMPLATES_PATH = ROUTE_PATH + '/templates'

app = Flask(__name__, template_folder=TEMPLATES_PATH)
app.config['JSON_AS_ASCII'] = False
CORS(app)

@app.route('/')
def top():
    config = Config()
    params = {
        "port": config.get("SERVER", "port")
    }
    return render_template('top.html', params=params)

@app.route('/settings/', methods=['GET', 'POST'])
def settings():
    if request.method == 'GET':
        config = Config()
        params = {
            "username": config.get("GENERAL", "username"),
            "port": config.get("SERVER", "port")
        }
        return render_template('settings.html', params=params)
    else:
        config = Config()
        config.set("GENERAL", "username", str(request.form["username"]))
        config.set("GENERAL", "language", str(request.form["language"]))
        config.set("TIME", "timezone", str(request.form["timezone"]))
        config.set("SERVER", "port", int(request.form["port"]))
        return redirect("/")

@app.route('/overlay/looptext/', methods=['GET'])
def overlay_list():
    config = Config()
    params = {
        "fullscreen": config.get("LOOPTEXT", "fullscreen"),
        "screen_width": config.get("LOOPTEXT", "screen_width"),
        "screen_height": config.get("LOOPTEXT", "screen_height"),
        "position": config.get("LOOPTEXT", "position"),
        "height": config.get("LOOPTEXT", "height"),
        "width": config.get("LOOPTEXT", "width"),
        "speed": config.get("LOOPTEXT", "speed"),
        "backgroundColor": config.get("LOOPTEXT", "backgroundColor"),
        "textColor": config.get("LOOPTEXT", "textColor"),
        "items": Database().get_all_looptexts()
    }
    return render_template('looptext.html', params=params)

@app.route('/overlay/looptext/edit/', methods=['GET'])
def overlay_edit():
    params = {
        "items": Database().get_all_looptexts()
    }
    return render_template('looptext_edit.html', params=params)

@app.route('/overlay/looptext/add/', methods=['POST'])
def overlay_edit_add():
    looptext = LoopText(str(uuid.uuid4()), request.form["new-content"])
    Database().add_looptext(looptext)
    return redirect("/overlay/looptext/edit/")

@app.route('/overlay/looptext/edit/content/<string:id>/', methods=['POST'])
def overlay_edit_content(id: str):
    looptext = LoopText(id, request.form["content"])
    Database().update_looptext(looptext)
    return redirect("/overlay/looptext/edit/")

@app.route('/overlay/looptext/delete/<string:id>/', methods=['GET'])
def overlay_delete(id: str):
    looptext = LoopText(id, "")
    Database().delete_looptext(looptext)
    return redirect("/overlay/looptext/edit/")

@app.route('/overlay/looptext/config/', methods=['GET', 'POST'])
def overlay_config():
    if request.method == 'GET':
        config = Config()
        params = {
            "fullscreen": config.get("LOOPTEXT", "fullscreen"),
            "screen_width": config.get("LOOPTEXT", "screen_width"),
            "screen_height": config.get("LOOPTEXT", "screen_height"),
            "position": config.get("LOOPTEXT", "position"),
            "height": config.get("LOOPTEXT", "height"),
            "width": config.get("LOOPTEXT", "width"),
            "speed": config.get("LOOPTEXT", "speed"),
            "backgroundColor": config.get("LOOPTEXT", "backgroundColor"),
            "textColor": config.get("LOOPTEXT", "textColor")
        }
        return render_template('looptext_config.html', params=params)
    else: 
        config = Config()
        if "fullscreen" in request.form:
            # チェックがついている場合
            config.set("LOOPTEXT", "fullscreen", "true")
        else:
            # チェックがついていない場合
            config.set("LOOPTEXT", "fullscreen", "false")
        if "screen_width" in request.form:
            config.set("LOOPTEXT", "screen_width", str(request.form["screen_width"]))
        if "screen_height" in request.form:
            config.set("LOOPTEXT", "screen_height", str(request.form["screen_height"]))
        if "position" in request.form:
            config.set("LOOPTEXT", "position", str(request.form["position"]))
        config.set("LOOPTEXT", "height", str(request.form["height"]))
        config.set("LOOPTEXT", "width", str(request.form["width"]))
        config.set("LOOPTEXT", "speed", str(request.form["speed"]))
        config.set("LOOPTEXT", "backgroundColor", str(request.form["backgroundColor"]))
        config.set("LOOPTEXT", "textColor", str(request.form["textColor"]))
        return redirect("/")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--version', help='show version', action='store_true')
    args = parser.parse_args()
    if args.version:
        print(CURRENT_VERSION)
        sys.exit(0)
    config = Config()
    port = config.get("SERVER", "port")
    app.run(host="localhost", port=int(port))