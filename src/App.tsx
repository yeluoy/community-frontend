import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { AuthProvider } from '@/contexts/authContext.tsx';
import UserProfile from './pages/UserProfile'; // 引入新的页面组件
import SettingsProfile from './pages/SettingsProfile'; // 引入新的页面组件
import CreatePost from './pages/CreatePost'; // 引入新的页面组件

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 【新增】个人主页的路由，使用 :uid 作为动态参数 */}
          <Route path="/profile/:uid" element={<UserProfile />} />
          <Route path="/settings/profile" element={<SettingsProfile />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </AuthProvider>
  );
}
