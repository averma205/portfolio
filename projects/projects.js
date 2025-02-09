import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projCount = document.querySelector('.count');

projCount.innerHTML = `
<h2>${projects.length} Projects</h2>`;
renderProjects(projects, projectsContainer, 'h2');

function renderPieChart(projects) {
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let rolledData = d3.rollups(
        projects,
        (v) => v.length,
        (d) => d.year,
    );
    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    let total = 0;
    for (let d of data) {
        total += d;
    }
    let angle = 0;
    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));
    for (let d of data) {
        let endAngle = angle + (d / total) * 2 * Math.PI;
        arcData.push({ startAngle: angle, endAngle });
        angle = endAngle;
    }
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    arcs.forEach((arc, idx) => {
        d3.select('svg')
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
    })

    let selectedIndex = -1;
    let svg = d3.select('svg'); 
    svg.selectAll('path').remove();
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    data.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`) // set the inner html of <li>
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
                legend
                    .selectAll('path')
                    .attr('class', (_, i) => (
                        i === selectedIndex ? 'selected': ''
                ));
                legend
                    .selectAll('li')
                    .attr('class', (_, i) => (
                        i === selectedIndex ? 'selected': ''
                ));
                
                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    let filtered = projects.filter((projects) => projects.year === d.label);
                    renderProjects(filtered, projectsContainer, 'h2');
                }
            });
    })
    arcs.forEach((arc, i) => {
        svg
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .on('click', () => {
            selectedIndex = selectedIndex === i ? -1 : i;
            svg
                .selectAll('path')
                .attr('class', (_, idx) => (
                    idx === selectedIndex ? 'selected': ''
            ));
            legend
                .selectAll('li')
                .attr('class', (_, idx) => (
                    idx === selectedIndex ? 'selected': ''
            ));
            
            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
                console.log(arc);
            } else {
                let filtered = projects.filter((projects) => projects.year === data[selectedIndex].label);
                renderProjects(filtered, projectsContainer, 'h2');
            }
        });
    });
}
// Call this function on page load
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    // update query value
    query = event.target.value;
    // filter projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    // render filtered projects
    renderProjects(filteredProjects, projectsContainer, 'h2');
    let newSVG = d3.select('svg'); 
    newSVG.selectAll('path').remove();
    let newUL = d3.select('ul'); 
    newUL.selectAll('li').remove();
    renderPieChart(filteredProjects);
});