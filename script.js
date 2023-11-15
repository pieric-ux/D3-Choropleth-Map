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

    const colorScale = d3.scaleSequential(d3.interpolateGreens)
      .domain(d3.extent(EducationalData, (d) => d.bachelorsOrHigher));

    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const svg = main
      .append('svg')
      .attr('width' , 960)
      .attr('height', 600);

    svg
      .append('g')
      .attr('class', 'counties')
      .selectAll()
      .data(topojson.feature(USCountyData, USCountyData.objects.counties).features)
      .join("path")
      .attr("d", path)
      .attr('class', 'county')
      .attr('data-fips', (d) => d.id)
      .attr('data-education', (d) => {
        const result = EducationalData.filter((obj) => {
          return obj.fips === d.id;
        });
        if (result[0]) {
          return result[0].bachelorsOrHigher;
        } else {
          return 0;
        }
      })
      .attr('fill', (d) => {
        const result = EducationalData.filter((obj) => {
          return obj.fips === d.id;
        });
        if (result[0]) {
          return colorScale(result[0].bachelorsOrHigher);
        } else {
          return colorScale(0);
        }
      })
      .on('mouseover', (event, d) => {
        const result = EducationalData.filter((obj) => {
          return obj.fips === d.id;
        });
        if (result[0]) { 
          tooltip
            .html(
              result[0]['area_name'] + ', ' + 
              result[0]['state'] + ': ' +
              result[0].bachelorsOrHigher + '%'
            )
            .attr('data-education', result[0].bachelorsOrHigher)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px')
            .style('opacity', 0.9);
        }
      })
      .on('mouseout', (event, d) => {
        tooltip
          .style('opacity', 0);
      });

    svg
      .append('g')
      .attr('class', 'states')
      .selectAll()
      .data(topojson.feature(USCountyData, USCountyData.objects.states).features)
      .join("path")
      .attr("d", path)
      .attr('class', 'state');

    const legendWidth = 260;
    const legendHeight = 30;

    const legendScale = d3.scaleSequential(d3.interpolateGreens)
      .domain(d3.extent(EducationalData, (d) => d.bachelorsOrHigher))
      .range([600, (600 + legendWidth)]);

    const xAxis = d3.axisBottom(legendScale);

    const legendColors = svg
      .append('g')
      .attr('id', 'legend')
      .attr('class', 'legend')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .selectAll('rect')
      .data(legendScale.ticks(10))
      .enter()
      .append('rect')
      .attr('width', legendWidth / 7)
      .attr('height', legendHeight)
      .attr('x', (d) => legendScale(d))
      .attr('fill', (d) => colorScale(d));

    const legendText = svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(23, ' + legendHeight + ')')
      .call(
        d3
          .axisBottom(legendScale)
          .tickSize(13)
          .tickFormat(function (x) {
            return Math.round(x) + '%';
          })
          .ticks(legendScale.ticks(10).length)
      );
    
  })
  .catch((err) => console.error(err));
