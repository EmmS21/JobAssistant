import { NextResponse } from "next/server";
import Redis from "ioredis";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";
import {
  ONE_DAY_SECONDS,
  ERROR_INVALID_DATA_FORMAT,
  ERROR_REQUEST_LIMIT_EXCEEDED,
  ERROR_DUPLICATE_SUBMISSION,
  ERROR_INTERNAL_SERVER,
  STATUS_BAD_REQUEST,
  STATUS_REQUEST_LIMIT_EXCEEDED,
  STATUS_DUPLICATE_SUBMISSION,
  STATUS_INTERNAL_SERVER_ERROR,
} from "../../constants/errors";
import dotenv from "dotenv";

// dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const REDIS_URI = process.env.REDIS_URI;

if (!REDIS_URI) {
    throw new Error('REDIS_URI is not set in the environment variables.');
}

const redis = new Redis(REDIS_URI);
export async function POST(request: Request) {
  try {
    const userData = await request.json();
    if (
      typeof userData.resume !== "string" ||
      typeof userData.portfolio !== "string" ||
      typeof userData.vacancy !== "string" ||
      typeof userData.country !== "string" ||
      typeof userData.laborMarket !== "string"
    ) {
      return NextResponse.json(
        { error: ERROR_INVALID_DATA_FORMAT },
        { status: STATUS_BAD_REQUEST }
      );
    }
    const ip = request.headers?.get("x-forwarded-for")?.split(",")[0] || "";
    const jobDescript = userData.vacancy;
    const storedData = await redis.get(`rateLimit:${ip}`);
    const storedTimestamp = storedData ? parseInt(storedData.split(":")[0]) : 0;
    let currentCount = storedData ? parseInt(storedData.split(":")[1]) : 0;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - storedTimestamp >= ONE_DAY_SECONDS) {
      currentCount = 0;
      await redis.set(`rateLimit:${ip}`, `${currentTimestamp}:${currentCount}`);
    }
    const submissionId = `${ip}:${jobDescript}`;
    const lastSubmission = await redis.get("lastSubmission:${submissionId}");
    if (lastSubmission) {
      const lastSubmissionTimestamp = parseInt(lastSubmission);
      if (currentTimestamp - lastSubmissionTimestamp < ONE_DAY_SECONDS) {
        return NextResponse.json(
          {
            error: ERROR_DUPLICATE_SUBMISSION,
          },
          { status: STATUS_DUPLICATE_SUBMISSION }
        );
      }
    }

    currentCount++;
    await redis.set(`rateLimit:${ip}`, `${currentTimestamp}:${currentCount}`);
    await redis.set(`lastSubmission:${submissionId}`, `${currentTimestamp}`);

    if (currentCount > 10) {
      return NextResponse.json(
        { error: ERROR_REQUEST_LIMIT_EXCEEDED },
        { status: STATUS_REQUEST_LIMIT_EXCEEDED }
      );
    }

    const configs = new Configuration({
      organization: process.env.ORGANIZATION,
      apiKey: process.env.API_KEY,
    });
    const openai = new OpenAIApi(configs);
    const filePath = path.join(
      process.cwd(),
      "src",
      "app",
      "Submission",
      "api",
      "prompts.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    const prompts = JSON.parse(fileContents);
    const fullPrompt =
      prompts["text"][0] +
      "\n" +
      userData["resume"] +
      "\n" +
      prompts["text"][1] +
      "\n" +
      userData["portfolio"] +
      "\n" +
      prompts["text"][2] +
      "\n" +
      userData["vacancy"] +
      "\n" +
      prompts["text"][3] +
      " " +
      userData["laborMarket"] +
      " " +
      prompts["text"][4] +
      " " +
      prompts["text"][5] +
      " " +
      userData["country"] +
      ". " +
      prompts["text"][6];
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: fullPrompt }],
    });
    const resp = completion.data.choices[0].message;
    return NextResponse.json({ ...resp, rateLimit: currentCount });
  } catch (err) {
    return NextResponse.json(
      { error: ERROR_INTERNAL_SERVER },
      { status: STATUS_INTERNAL_SERVER_ERROR },
    );
  }
}
