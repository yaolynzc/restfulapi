var sql = require('mssql');
var coordtransform = require('coordtransform')

var config = {
	user:'sa',
	password:'flame',
	server:'127.0.0.1',
	database:'SeqPanorama'
}

sql.connect(config, err => {
  var request1 = new sql.Request();
  request1.query('select * from seq_panorama_new where name is not null ', (err, result) => {
    // console.dir(result)
    for(var i=0;i<result.length;i++){
      // console.log(result[i].name)
      var bd09togcj02=coordtransform.bd09togcj02(result[i].lng, result[i].lat);
      // console.log(i + "-b2g：" + bd09togcj02)
      var gcj02towgs84=coordtransform.gcj02towgs84(bd09togcj02[0], bd09togcj02[1]);
      console.log(i + "-g2w：" + gcj02towgs84)
      var request2 = new sql.Request();
      request2.input('id',sql.NVarChar(50),result[i].panoramaid);
		  request2.input('wgslng',sql.Float,parseFloat(gcj02towgs84[0]).toFixed(7));
      request2.input('wgslat',sql.Float,parseFloat(gcj02towgs84[1]).toFixed(7));

      request2.query('update seq_panorama_new set lng2=@wgslng,lat2=@wgslat where panoramaid=@id ',(err,result)=>{
        if(err){
          console.log(err)
        }else{
          console.log(result)
        }
      })
    }
  })
})
