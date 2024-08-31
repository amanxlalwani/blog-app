-- CreateTable
CREATE TABLE "Subscribe" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subscriber_id" TEXT NOT NULL,

    CONSTRAINT "Subscribe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscribe" ADD CONSTRAINT "Subscribe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribe" ADD CONSTRAINT "Subscribe_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
