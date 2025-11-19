import { toast } from "sonner";

export const showAuthToast = {
  // 登录成功
  loginSuccess: (username: string) => {
    toast.success(`欢迎回来，${username}！`, {
      description: "登录成功...",
      duration: 2000,
    });
  },

  // 登录失败
  loginError: (message: string) => {
    toast.error("登录失败", {
      description: message,
      duration: 4000,
    });
  },

  // 登出成功
  logoutSuccess: () => {
    toast.success("已成功登出", {
      description: "再见！",
      duration: 2000,
    });
  },

  // 注册成功
  registerSuccess: (username: string) => {
    toast.success("注册成功！", {
      description: `欢迎加入，${username}！`,
      duration: 3000,
    });
  },

  // 注册失败
  registerError: (message: string) => {
    toast.error("注册失败", {
      description: message,
      duration: 4000,
    });
  },

  // 欢迎进入dashboard
  welcomeToDashboard: (username: string) => {
    toast.success("进入管理面板", {
      description: `你好，${username}！所有系统正常运行。`,
      duration: 3000,
    });
  },

  // 权限错误
  permissionError: () => {
    toast.error("权限不足", {
      description: "您没有访问此页面的权限",
      duration: 3000,
    });
  },

  // 管理员权限错误
  adminPermissionError: () => {
    toast.error("访问被拒绝", {
      description: "只有管理员才能访问控制面板",
      duration: 4000,
    });
  },

  // 网络错误
  networkError: () => {
    toast.error("网络连接错误", {
      description: "请检查您的网络连接后重试",
      duration: 4000,
    });
  },

  // 会话过期
  sessionExpired: () => {
    toast.warning("会话已过期", {
      description: "请重新登录",
      duration: 3000,
    });
  },

  // 操作成功
  operationSuccess: (operation: string) => {
    toast.success("操作成功", {
      description: `${operation}已完成`,
      duration: 2000,
    });
  },

  // 操作失败
  operationError: (operation: string, error: string) => {
    toast.error("操作失败", {
      description: `${operation}失败：${error}`,
      duration: 4000,
    });
  },
};
