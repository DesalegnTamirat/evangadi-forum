import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { StatusCodes } from "http-status-codes";

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });
    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching categories", error: error.message });
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

export { getAllCategories, getCategoryQuestions };
