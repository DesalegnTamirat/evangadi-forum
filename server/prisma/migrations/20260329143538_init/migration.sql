-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('system', 'user', 'assistant');

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "firstname" VARCHAR(20) NOT NULL,
    "lastname" VARCHAR(20) NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "reset_token" VARCHAR(255),
    "profile_picture" VARCHAR(250),
    "reset_token_expires" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "questions" (
    "questionid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "tag" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("questionid")
);

-- CreateTable
CREATE TABLE "answers" (
    "answerid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "questionid" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("answerid")
);

-- CreateTable
CREATE TABLE "chat_history" (
    "chatid" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("chatid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionid_fkey" FOREIGN KEY ("questionid") REFERENCES "questions"("questionid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE CASCADE;
