import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Admin } from "../model/admin.model.js";
import { Blog } from "../model/blog.model.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Admin.deleteMany({});
    await Blog.deleteMany({});
    console.log("Cleared existing data");

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = await Admin.create({
      username: "admin",
      email: "admin@blog.com",
      password: hashedPassword,
    });
    console.log("Default admin created:");
    console.log("  Email: admin@blog.com");
    console.log("  Password: admin123");


    const sampleBlogs = [
      {
        title: "Getting Started with MERN Stack",
        description: "<h2>What is MERN Stack?</h2><p>The MERN stack is a popular full-stack JavaScript framework consisting of <strong>MongoDB</strong>, <strong>Express.js</strong>, <strong>React</strong>, and <strong>Node.js</strong>. It enables developers to build dynamic web applications using JavaScript on both the client and server sides.</p><h3>Why MERN?</h3><ul><li>Full JavaScript stack</li><li>Large community support</li><li>Excellent for building SPAs</li><li>Scalable and performant</li></ul><p>In this blog post, we explore the fundamentals of each technology and how they work together to create powerful web applications.</p>",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
        author: admin._id,
        likes: ["visitor1", "visitor2", "visitor3"],
        comments: [
          { username: "John", text: "Great introduction to MERN!" },
          { username: "Jane", text: "Very helpful, thanks for sharing!" },
        ],
        shareCount: 5,
      },
      {
        title: "Understanding JWT Authentication",
        description: "<h2>JSON Web Tokens Explained</h2><p>JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object. It is commonly used for <em>authentication</em> and <em>authorization</em> in web applications.</p><h3>How JWT Works</h3><p>A JWT consists of three parts:</p><ol><li><strong>Header</strong> - Contains the token type and signing algorithm</li><li><strong>Payload</strong> - Contains the claims (user data)</li><li><strong>Signature</strong> - Verifies the token integrity</li></ol><p>When a user logs in, the server creates a JWT and sends it back to the client. The client stores this token and includes it in subsequent requests to access protected resources.</p>",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
        author: admin._id,
        likes: ["visitor1", "visitor4"],
        comments: [
          { username: "Dev_Mike", text: "Clear explanation of JWT flow!" },
        ],
        shareCount: 3,
      },
      {
        title: "Building REST APIs with Express.js",
        description: "<h2>REST API Best Practices</h2><p>Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.</p><h3>Key Principles</h3><ul><li>Use proper HTTP methods (GET, POST, PUT, DELETE)</li><li>Implement proper error handling</li><li>Use middleware for common tasks</li><li>Follow RESTful naming conventions</li><li>Validate input data</li></ul><p>In this comprehensive guide, we cover everything from setting up your first Express server to building production-ready APIs with authentication, validation, and error handling.</p>",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
        author: admin._id,
        likes: ["visitor2", "visitor3", "visitor5", "visitor6"],
        comments: [
          { username: "Sarah_Dev", text: "This helped me understand REST better!" },
          { username: "CodeNewbie", text: "Perfect for beginners like me." },
          { username: "FullStackPro", text: "Solid best practices guide." },
        ],
        shareCount: 8,
      },
    ];

    await Blog.insertMany(sampleBlogs);
    console.log(`Created ${sampleBlogs.length} sample blog posts`);

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedData();
