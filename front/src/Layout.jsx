import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            {/* 共通ヘッダーやナビゲーションなどがあればここに記述 */}
            <Outlet />
        </div>
    );
};

export default Layout;
