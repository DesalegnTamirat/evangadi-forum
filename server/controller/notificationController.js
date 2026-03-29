import prisma from "../prisma/client.js";

export const getNotifications = async (req, res) => {
  const { userid } = req.user;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userid },
      orderBy: { created_at: "desc" },
      take: 20,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.notification.update({
      where: { notificationid: parseInt(id) },
      data: { is_read: true },
    });
    res.status(200).json({ msg: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Helper to create notifications internally
export const createNotification = async (userid, message, type) => {
  try {
    await prisma.notification.create({
      data: {
        userid,
        message,
        type,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
