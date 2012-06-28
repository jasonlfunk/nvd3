
nv.models.pie = function() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 500,
      height = 500,
      animate = 2000,
      label ='label',
      field ='y',
      getY = function(d) { return d.y },
      id = Math.floor(Math.random() * 10000), //Create semi-unique ID in case user doesn't select one
      color = d3.scale.category20(),
      showLabels = true,
      donut = false;

      var lastWidth = 0,
      lastHeight = 0;


  var  dispatch = d3.dispatch('chartClick', 'elementClick', 'elementDblClick', 'tooltipShow', 'tooltipHide');

  function chart(selection) {
    selection.each(function(data) {
      var availableWidth = width - margin.left - margin.right,
          availableHeight = height - margin.top - margin.bottom,
          radius = Math.min(availableWidth, availableHeight) / 2;

      var container = d3.select(this)
          .on("click", function(d,i) {
              dispatch.chartClick({
                  data: d,
                  index: i,
                  pos: d3.event,
                  id: id
              });
          });



      var wrap = container.selectAll('.wrap.pie').data([data]);
      var wrapEnter = wrap.enter().append('g').attr('class','wrap nvd3 pie chart-' + id);
      var gEnter = wrapEnter.append('g');
      var g = wrap.select('g')

      gEnter.append('g').attr('class', 'pie');

      wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      g.select('.pie').attr("transform", "translate(" + radius + "," + radius + ")");



      var arc = d3.svg.arc()
                  .outerRadius((radius-(radius / 5)));

      if (donut) arc.innerRadius(radius / 2);


      // Setup the Pie chart and choose the data element
      var pie = d3.layout.pie()
         .value(getY);

      var slices = wrap.select('.pie').selectAll(".slice")
            .data(pie);

      slices.exit().remove();

      var ae = slices.enter().append("svg:g")
              .attr("class", "slice")
              .on('mouseover', function(d,i){
                        d3.select(this).classed('hover', true);
                        dispatch.tooltipShow({
                            label: d.data[label],
                            value: d.data[field],
                            data: d.data,
                            index: i,
                            pos: [d3.event.pageX, d3.event.pageY],
                            id: id
                        });

              })
              .on('mouseout', function(d,i){
                        d3.select(this).classed('hover', false);
                        dispatch.tooltipHide({
                            label: d.data[label],
                            value: d.data[field],
                            data: d.data,
                            index: i,
                            id: id
                        });
              })
              .on('click', function(d,i) {
                    dispatch.elementClick({
                        label: d.data[label],
                        value: d.data[field],
                        data: d.data,
                        index: i,
                        pos: d3.event,
                        id: id
                    });
                    d3.event.stopPropagation();
              })
              .on('dblclick', function(d,i) {
                dispatch.elementDblClick({
                    label: d.data[label],
                    value: d.data[field],
                    data: d.data,
                    index: i,
                    pos: d3.event,
                    id: id
                });
                 d3.event.stopPropagation();
              });

        var paths = ae.append("svg:path")
            .attr('class','path')
            .attr("fill", function(d, i) { return color(i); });
            //.attr('d', arc);

        d3.transition(slices.select('.path'))
            .attr('d', arc)
            //.ease("bounce")
            .attrTween("d", tweenPie);

        if (showLabels) {
            // This does the normal label
            ae.append("text");

            d3.transition(slices.select("text"))
              //.ease('bounce')
              .attr("transform", function(d) {
                 d.outerRadius = radius + 10; // Set Outer Coordinate
                 d.innerRadius = radius + 15; // Set Inner Coordinate
                 return "translate(" + arc.centroid(d) + ")";
              })
              .attr("text-anchor", "middle") //center the text on it's origin
              //.style("font", "bold 12px Arial") // font style's should be set in css!
              .text(function(d, i) {  return d.data[label]; });
        }


        // Computes the angle of an arc, converting from radians to degrees.
        function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }


        function tweenPie(b) {
            b.innerRadius = 0;
            var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
            return function(t) {
                return arc(i(t));
            };
        }

    });

    return chart;
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return getY;
    getY = d3.functor(_);
    return chart;
  };

  chart.labelField = function(_) {
    if (!arguments.length) return (label);
      label = _;
      return chart;
  };

  chart.dataField = function(_) {
    if (!arguments.length) return (field);
    field = _;
    return chart;
  };

  chart.showLabels = function(_) {
      if (!arguments.length) return (showLabels);
      showLabels = _;
      return chart;
  };

  chart.donut = function(_) {
        if (!arguments.length) return (donut);
        donut = _;
        return chart;
  };

  chart.id = function(_) {
        if (!arguments.length) return id;
        id = _;
        return chart;
  };

  chart.dispatch = dispatch;



    return chart;
}