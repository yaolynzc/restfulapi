var sql = require('mssql');
var md5js = require('../libs/md5');

var config = {
	user:'sa',
	password:'flame',
	server:'127.0.0.1',
	database:'XAapp'
}

//5.1 用户登录login
//get(/login/:uid/:pwd)
exports.login = function(req,res){
	//console.log(req.params.uid+"/" + md5js.hex_md5(req.params.pwd));
	sql.connect(config).then(function(){
		var request = new sql.Request();
		request.input('name',sql.NVarChar(50),req.params.uid);
		request.input('pwd',sql.NVarChar(50),md5js.hex_md5(req.params.pwd));
		request.query('select top 1 * from tb_user where name=@name and pwd=@pwd').then(function(recordset){
				res.send({
					success:true,
					// err:'',
					user:recordset
				});
			}).catch(function(err){
				console.log(err);
				res.statusCode = 503;
				res.send({
					success:false,
					errs:err
				});
			})
	});
}

//5.2 用户注册register
//get(/register/:uid/:pwd)
exports.register = function(req,res){
  sql.connect(config).then(function(){
		var request = new sql.Request();
		request.input('name',sql.NVarChar(50),req.params.uid);
		request.input('pwd',sql.NVarChar(50),md5js.hex_md5(req.params.pwd));
		// request.input('addtime',sql.DateTime(),new DateTime());
		// request.input('updatetime',sql.DateTime(),new DateTime());
		request.query('insert into tb_user(name,pwd) values(@name,@pwd)').then(function(){
			res.send({
				success:true
			})
		}).catch(function(err){
			console.log(err);
			res.statusCode = 503;
			res.send({
				success:false,
				msg:err
			})
		});
	});
}

//5.3 修改用户信息updateuser
//get(/updateuser?uid=&pwd=&nickname=&pic=)
exports.updateuser = function(req,res){
	sql.connect(config).then(function(){
		var request = new sql.Request();
		request.input('name',sql.NVarChar(50),req.query.uid);

		var querystr = 'update tb_user set ';
		if(req.query.pwd){
			request.input('pwd',sql.NVarChar(50),md5js.hex_md5(req.query.pwd));
			querystr += 'pwd=@pwd '
		}
		if(req.query.nickname){
			request.input('nickname',sql.NVarChar(50),req.query.nickname);
			querystr += 'nickname=@nickname ';
		}
		if(req.query.pic){
			request.input('pic',sql.NVarChar(200),'\\upload\\user\\'+req.query.pic);
			querystr += 'pic=@pic ';
		}
		querystr += ' where name=@name '
		// console.log(querystr);
		request.query(querystr).then(function(){
			// res.send({
			// 	success:true
			// })
			var request2 = new sql.Request();
			request2.input('name',sql.NVarChar(50),req.query.uid);
			request2.query('select * from tb_user where name=@name ').then(function(recordset){
				res.send({
					success:true,
					user:recordset
				});
			}).catch(function(err){
				console.log(err);
				res.statusCode = 503;
				res.send({
					success:false,
					msg:err
				})
			});
		}).catch(function(err){
			console.log(err);
			res.statusCode = 503;
			res.send({
				success:false,
				msg:err
			})
		});
	})
}
