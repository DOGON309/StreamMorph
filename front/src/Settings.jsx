import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Settings() {
    useEffect(() => {
        const usernameInput = document.getElementById("UsernameInput");
        const portInput = document.getElementById("PortInput");

        // preload.jsで公開したAPIからデータの取得
        window.electronAPI.onInitData((data) => {
            // 描写
            usernameInput.value = data.username;
            portInput.value = data.port;
        });

    });
    return (
        <>
            <div class="d-flex flex-column align-items-center justify-content-center h-100 w-100">
                <form action="/settings/" method="POST">
                    <div class="card">
                        <div class="card-header">GENERAL</div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <label for="UsernameInput" class="form-label">USERNAME</label>
                                <input name="username" type="text" class="form-control" id="UsernameInput" placeholder="username" />
                            </li>
                            <li class="list-group-item">
                                <label for="LanguageInput" class="form-label">LANGUAGE</label>
                                <select name="language" class="form-select" aria-label="Default select example">
                                    <option value="1">Asia/Tokyo</option>
                                </select>
                            </li>
                        </ul>
                    </div>
                    <div class="card mt-3">
                        <div class="card-header">TIME</div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <label for="LanguageInput" class="form-label">TIMEZONE</label>
                                <select name="timezone" class="form-select" aria-label="Default select example">
                                    <option value="1">Asia/Tokyo</option>
                                </select>
                            </li>
                        </ul>
                    </div>
                    <div class="card mt-3">
                        <div class="card-header">SERVER</div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <label for="PortInput" class="form-label">PORT</label>
                                <input name="port" type="text" class="form-control" id="PortInput" placeholder="port" />
                            </li>
                        </ul>
                    </div>
                    <div class="d-flex flex-column mt-3">
                        <Link class="btn btn-secondary w-100" to="/">キャンセル</Link>
                        <button class="btn btn-primary w-100 mt-3">保存</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Settings;