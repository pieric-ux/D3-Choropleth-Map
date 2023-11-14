const USCountyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const EducationUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

Promise.all([
  d3.json(USCountyUrl),
  d3.json(EducationUrl)
])
  .then ((data) => {
    const USCountyData = data[0];
    const EducationalData = data[1];

    const path = d3.geoPath();

    const main = d3.select('body')
      .append('div')
      .attr('id', 'main');

    main
      .append('h1')
      .attr('id', 'title')
      .text('United States Educational Attainment');
    
    main
      .append('p')
      .attr('id', 'description')
      .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");
    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(EducationalData, d => d.bachelorsOrHigher))
      .range([680, 800]);

    const svg = main
      .append('svg');
    
    svg
      .append('g')
      .attr('class', 'counties')
      .selectAll('path')
      .data(USCountyData.objects.counties.geometries)
      .join("path")
      .attr("d", path);
  
  })
  .catch((err) => console.error(err));
