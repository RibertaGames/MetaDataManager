import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Project, ProjectsData } from "@/types/project";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readProjects(): ProjectsData {
  ensureDataDir();
  if (!fs.existsSync(PROJECTS_FILE)) {
    const init: ProjectsData = { projects: [] };
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(init, null, 2), "utf-8");
    return init;
  }
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8")) as ProjectsData;
}

function writeProjects(data: ProjectsData) {
  ensureDataDir();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getProject(id: string): Project | undefined {
  return readProjects().projects.find((p) => p.id === id);
}

export function createProject(name: string, fastlanePath: string): Project {
  const data = readProjects();
  const project: Project = {
    id: uuidv4(),
    name,
    fastlanePath,
    createdAt: new Date().toISOString(),
  };
  data.projects.push(project);
  writeProjects(data);
  return project;
}

export function updateProject(id: string, name: string, fastlanePath: string): Project {
  const data = readProjects();
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Project not found");
  data.projects[idx] = { ...data.projects[idx], name, fastlanePath };
  writeProjects(data);
  return data.projects[idx];
}

export function deleteProject(id: string) {
  const data = readProjects();
  data.projects = data.projects.filter((p) => p.id !== id);
  writeProjects(data);
}

// パストラバーサル防止: fastlanePathが登録済みかを検証
export function validateFastlanePath(projectId: string, fastlanePath: string): boolean {
  const project = getProject(projectId);
  return project !== undefined && project.fastlanePath === fastlanePath;
}
