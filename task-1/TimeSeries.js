/**
 * Created by June on 16/2/4.
 */

d3.timeSeries = function(){
    //Internal variables
    //will need some default values, which can be overridden
    var w = 800;
    var h = 600;
    var m = {t:25,r:50,b:25,l:50},
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,
        timeRange = [new Date(), new Date()],
        binSize,
        maxY = 1000,
        scaleX = d3.time.scale().range([0,chartW]).domain(timeRange),
        scaleY = d3.scale.linear().range([chartH,0]).domain([0,maxY]),
        valueAccessor = function(d){return d.startTime};




    //customChart/exports
    //the function gets returned
    function exports(selection){

        //console.log(binSize);

        //console.log('start drawing the chart')

        //selection.append("svg")
        //    .attr("width",w)
        //    .attr("height",h)
        //    .append("circle").attr("r",50);

        //create a histogram layout
        var layout = d3.layout.histogram()
            .value(valueAccessor)
            .range(timeRange)
            .bins( binSize.range( timeRange[0],timeRange[1] ) ); //go read d3.time.interval

        scaleX.range([0,chartW]).domain(timeRange);
        scaleY.range([chartH,0]).domain([0,maxY]);
        //d3.time.week.range(date1, date2);


        //take the data, use a histogram layout to transform into a series of (x,y)
        selection.each(function(_d){
            //"selection" --> d3.select(".plot")
            var data = layout(_d);
            console.log(data);

            var line = d3.svg.line()
                .x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
                .y(function(d){ return scaleY(d.y)})
                .interpolate('basis');
            var area = d3.svg.area()
                .x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
                .y0(chartH)
                .y1(function(d){ return scaleY(d.y)})
                .interpolate('basis');
            var axisX = d3.svg.axis()
                .orient('bottom')
                .scale(scaleX)
                .ticks(d3.time.year);

            //append DOM element
           var svg =  d3.select(this).append('svg');
            svg.attr('width',w).attr('height',h);
            svg.append("g").attr("class","line").attr('transform','translate(0,-200)')
                   .append("path");
            svg.append("g").attr("class","area").attr('transform','translate(0,-200)')
                    .append("path");
            svg.append("g").attr("class","axis").attr('transform','translate(0,350)');



            // var svg.append("g").attr()

            //draw the (x,y) as a line, and an area

            //axis

            svg.select('.line')
                .select('path')
                .datum(data)
                .attr('d',line);

            svg.select('.area')
                .select('path')
                .datum(data)
                .attr('d',area);


            svg.select('.axis')
                .call(axisX);

        })





    }


    //Getter and setter
    //modify and access internal variables
    exports.width = function(_x){
        if(!arguments.length) return w;
        w = _x;
        return this;//return exports
    };

    exports.height = function(_x){
        if(!arguments.length) return h;
        h = _x;
        return this;//return exports
    };

    exports.timeRange = function(_r){
        if(!arguments.length) return timeRange;
        timeRange = _r;
        return this;//return exports
    };

    exports.binSize = function(interval){
        if(!arguments.length) return binSize;
        binSize = interval;
        return this;//return exports
    };

    exports.value = function(accessor){
        if(!arguments.length) return valueAccessor;
        valueAccessor = accessor;
        return this;//return exports
    };


    return exports;


}
