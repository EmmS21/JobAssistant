import { NextResponse } from "next/server";
import Redis from "ioredis";
// import fetch from "node-fetch";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";

const redis = new Redis();

export async function POST(request: Request) {
  try {
    const ip = request.headers?.get("x-forwarded-for")?.split(",")[0] || "";
    const currentCount = await redis.incr(ip);
    if (currentCount === 1) {
      await redis.expire(ip, 86400);
    }
    if (currentCount > 20) {
      return NextResponse.json(
        { error: "You are limited to 20 requests a day" },
        { status: 429 }
      );
    }

    const configs = new Configuration({
      organization: "org-0z7fb7SDKSEBJywmd19fQep5",
      apiKey: "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",
    });
    const openai = new OpenAIApi(configs);
    const userData = await request.json();
    if (
      typeof userData.resume !== "string" ||
      typeof userData.portfolio !== "string" ||
      typeof userData.vacancy !== "string" ||
      typeof userData.country !== "string" ||
      typeof userData.laborMarket !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

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
    console.log("sending Resp***", resp);
    return NextResponse.json({ ...resp, rateLimit: currentCount });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
