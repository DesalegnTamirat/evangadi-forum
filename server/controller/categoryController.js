import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from "http-status-codes";

const getAllCategories = async (req, res) => {
  const userid = req.user?.userid;
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { questions: true, members: true }
        },
        members: userid ? {
          where: { userid }
        } : false
      }
    });

    const formattedCategories = categories.map(cat => ({
      ...cat,
      isMember: cat.members ? cat.members.length > 0 : false,
      members: undefined
    }));

    res.status(StatusCodes.OK).json(formattedCategories);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching categories", error: error.message });
  }
};

const createCategory = async (req, res) => {
  const userid = req.user.userid;
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Name and description are required" });
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        creatorId: userid,
        members: {
          create: { userid }
        }
      }
    });
    res.status(StatusCodes.CREATED).json(newCategory);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error creating forum", error: error.message });
  }
};

const joinCategory = async (req, res) => {
  const userid = req.user.userid;
  const { id } = req.params;
  try {
    await prisma.forumMembership.upsert({
      where: {
        userid_categoryid: { userid, categoryid: parseInt(id) }
      },
      create: { userid, categoryid: parseInt(id) },
      update: {}
    });
    res.status(StatusCodes.OK).json({ message: "Joined successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error joining forum", error: error.message });
  }
};

const leaveCategory = async (req, res) => {
  const userid = req.user.userid;
  const { id } = req.params;
  try {
    await prisma.forumMembership.delete({
      where: {
        userid_categoryid: { userid, categoryid: parseInt(id) }
      }
    });
    res.status(StatusCodes.OK).json({ message: "Left successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Not a member or error leaving", error: error.message });
  }
};

const getCategoryQuestions = async (req, res) => {
  const { id } = req.params;
  try {
    const questions = await prisma.question.findMany({
      where: { categoryid: parseInt(id) },
      include: {
        user: {
          select: { username: true, firstname: true, lastname: true, profile_picture: true }
        },
        _count: {
          select: { answers: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.status(StatusCodes.OK).json(questions);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching category questions", error: error.message });
  }
};

export { getAllCategories, createCategory, joinCategory, leaveCategory, getCategoryQuestions };

