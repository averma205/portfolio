import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projCount = document.querySelector('.count');

projCount.innerHTML = `
<h2>${projects.length} Projects</h2>`;
renderProjects(projects, projectsContainer, 'h2');