import { ref, computed } from "vue";

export interface INotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: "system" | "order" | "chat";
}

export const useNotifications = () => {
  const notifications = ref<INotification[]>([
    {
      id: 1,
      title: "Добро пожаловать!",
      message: "Рады видеть вас в нашем магазине.",
      isRead: false,
      createdAt: new Date().toISOString(),
      type: "system",
    },
    {
      id: 2,
      title: "Новое объявление",
      message: "Ваше объявление прошло модерацию.",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      type: "order",
    },
  ]);

  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.isRead).length
  );

  const markAsRead = (id: number) => {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  };

  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.isRead = true));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
