"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = exports.signupSchema = exports.signinSchema = void 0;
const zod_1 = require("zod");
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string()
});
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string().min(8, "Password should contain atleast 8 characters"),
    name: zod_1.z.string()
});
exports.blogSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    published: zod_1.z.boolean().optional(),
});
