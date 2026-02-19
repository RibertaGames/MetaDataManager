export interface Project {
  id: string;
  name: string;
  fastlanePath: string;
  createdAt: string;
}

export interface ProjectsData {
  projects: Project[];
}

export interface Settings {
  deeplApiKey: string;
  deeplFreeApi: boolean;
}
