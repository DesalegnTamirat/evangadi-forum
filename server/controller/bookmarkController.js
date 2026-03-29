import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const toggleBookmark = async (req, res) => {
  const { questionid } = req.params;
  const userid = req.user.userid;

  try {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userid_questionid: {
          userid: Number(userid),
          questionid: Number(questionid),
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: {
          userid_questionid: {
            userid: Number(userid),
            questionid: Number(questionid),
          },
        },
      });
      return res.status(200).json({ message: "Bookmark removed" });
    } else {
      await prisma.bookmark.create({
        data: {
          userid: Number(userid),
          questionid: Number(questionid),
        },
      });
      return res.status(200).json({ message: "Bookmark added" });
    }
  } catch (error) {
    console.error("Bookmark toggle error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getBookmarks = async (req, res) => {
  const userid = req.user.userid;

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userid: Number(userid) },
      include: {
        question: {
          include: {
            user: {
              select: {
                username: true,
                reputation: true,
              },
            },
            _count: {
              select: {
                answers: true,
              },
            },
          },
        },
      },
    });

    const questions = bookmarks.map(b => ({
      ...b.question,
      username: b.question.user.username,
      reputation: b.question.user.reputation,
      answer_count: b.question._count.answers,
    }));

    return res.status(200).json({ questions });
  } catch (error) {
    console.error("Fetch bookmarks error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
