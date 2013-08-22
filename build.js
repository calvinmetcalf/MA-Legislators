var spawn = require('child_process').spawn;
 
var fs = require('fs');
var congress={};
congress.geo = require('./geometry/congress.json');
congress.prop = require('./properties/congress.json');
congress.name='congress';
var house={};
house.geo = require('./geometry/house.json');
house.prop = require('./properties/house.json');
house.name = 'house';
var senate={};
senate.geo = require('./geometry/senate.json');
senate.prop = require('./properties/senate.json');
senate.name='senate';
var types = [congress,house,senate];
var done = 0;
function doTopo(){
    var topo = spawn('./node_modules/topojson/bin/topojson', ['-p','-o','legislators.topojson','--','congress=congress.geojson','house=house.geojson','senate=senate.geojson']);
    topo.stdout.on('data', function (data) {
  console.log('topojson: '+data);
});

topo.stderr.on('data', function (data) {
  console.error('topojson: '+data);
});

topo.on('close', function (code) {
    if(code===0){
        console.log('all done');
    }else{
        console.error('something bad happend, topojson exited with code '+code);
    }
  
});
}
types.forEach(function(doc){
    doc.geo.features.forEach(function(v){
        v.properties=doc.prop[v.id];
    });
    fs.writeFile('./'+doc.name+'.geojson',JSON.stringify(doc.geo,false,4),{encoding:'utf8'},function(){
        console.log('done with',doc.name);
        done++;
        if(done===types.length){
            doTopo();
        }
    });
});