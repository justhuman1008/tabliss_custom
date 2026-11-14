import { Config } from "../../types";
import Todo from "./Todo";
import TodoSettings from "./TodoSettings";

const config: Config = {
  key: "widget/todo",
  name: "TODO",
  description: "Add reminders to procrastinate.",
  dashboardComponent: Todo,
  settingsComponent: TodoSettings,
};

export default config;
