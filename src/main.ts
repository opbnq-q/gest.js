import "dotenv/config";
import { Matcher } from "./modules/router/matcher.class.router";

const baseUrl = "http://localhost:3000";
console.log(Matcher.match(baseUrl + "/users/[id]", "/users/123?active=true"));
